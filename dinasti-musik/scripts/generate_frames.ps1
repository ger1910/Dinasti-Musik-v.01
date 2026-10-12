Add-Type -AssemblyName System.Drawing

$outputDir = Join-Path $PSScriptRoot "..\public\frames"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
}

$width = 960
$height = 540
$totalFrames = 60

Write-Host "Generating $totalFrames placeholder 3D frames in $outputDir..."

for ($i = 1; $i -le $totalFrames; $i++) {
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # 1. Background #080F0F
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(8, 15, 15))
    $g.FillRectangle($bgBrush, 0, 0, $width, $height)
    $bgBrush.Dispose()

    # 2. Ambient radial glow (copper #bb6a33 with low alpha)
    $progress = ($i - 1) / ($totalFrames - 1) # 0.0 to 1.0
    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 187, 106, 51))
    $g.FillEllipse($glowBrush, [int]($width/2 - 250), [int]($height/2 - 180), 500, 360)
    $glowBrush.Dispose()

    # 3. Geometric guitar wireframe representation
    # Rotation angle based on progress (smooth turn from -30 deg to 30 deg or 360 deg)
    $angle = -20 + ($progress * 70)
    $copperPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 197, 155, 109), 2)
    $accentPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 187, 106, 51), 3)
    $dimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 255, 255, 255), 1)

    # Save state for transformation
    $state = $g.Save()
    $g.TranslateTransform($width / 2, $height / 2)
    $g.RotateTransform($angle)

    # Zoom scale based on active inspection region
    $scale = 1.0
    if ($progress -ge 0.15 -and $progress -le 0.35) {
        # Headstock zoom
        $scale = 1.35
        $g.TranslateTransform(0, 100)
    } elseif ($progress -gt 0.35 -and $progress -le 0.58) {
        # Neck zoom
        $scale = 1.25
        $g.TranslateTransform(0, 30)
    } elseif ($progress -gt 0.58 -and $progress -le 0.78) {
        # Body zoom
        $scale = 1.3
        $g.TranslateTransform(0, -70)
    } elseif ($progress -gt 0.78 -and $progress -le 0.92) {
        # Bridge zoom
        $scale = 1.45
        $g.TranslateTransform(0, -90)
    }
    $g.ScaleTransform($scale, $scale)

    # Body contour (double curve)
    $g.DrawEllipse($copperPen, -90, 10, 180, 170)  # Lower bout
    $g.DrawEllipse($dimPen, -65, -50, 130, 110)    # Upper bout
    $g.DrawEllipse($accentPen, -28, 45, 56, 56)    # Soundhole / pickups

    # Neck
    $g.DrawLine($copperPen, -18, -50, -14, -200)
    $g.DrawLine($copperPen, 18, -50, 14, -200)
    for ($f = 0; $f -lt 12; $f++) {
        $fy = -55 - ($f * 12)
        $g.DrawLine($dimPen, -17, $fy, 17, $fy)
    }

    # Headstock
    $g.DrawPolygon($accentPen, @(
        (New-Object System.Drawing.Point(-14, -200)),
        (New-Object System.Drawing.Point(14, -200)),
        (New-Object System.Drawing.Point(22, -250)),
        (New-Object System.Drawing.Point(0, -260)),
        (New-Object System.Drawing.Point(-22, -250))
    ))

    # Strings
    for ($s = -2; $s -le 2; $s++) {
        $g.DrawLine($copperPen, $s * 5, 80, $s * 4, -245)
    }

    # Bridge
    $g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 197, 155, 109))), -35, 115, 70, 12)

    $g.Restore($state)

    # 4. HUD / Text metadata on frame
    $fontMono = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Bold)
    $fontTitle = New-Object System.Drawing.Font("Georgia", 14, [System.Drawing.FontStyle]::Italic)
    $fontSmall = New-Object System.Drawing.Font("Segoe UI", 9)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 243, 240, 232))
    $copperBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 187, 106, 51))
    $dimBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 255, 255, 255))

    # Frame counter (top-left)
    $frameNum = $i.ToString("D4")
    $g.DrawString("DINASTI MUSIK 3D INSPECTION SEQUENCE", $fontMono, $copperBrush, 32, 28)
    $g.DrawString("FRAME [$frameNum / 0060] | PROGRESS: $([int]($progress * 100))%", $fontMono, $dimBrush, 32, 48)

    # Active zone indicator (bottom-left)
    $partLabel = "Overview: Koleksi Instrumen Pilihan"
    if ($progress -ge 0.15 -and $progress -le 0.35) { $partLabel = "Part 1: Headstock & Tuning Pegs Precision" }
    elseif ($progress -gt 0.35 -and $progress -le 0.58) { $partLabel = "Part 2: Ergonomic Neck & Rosewood Fretboard" }
    elseif ($progress -gt 0.58 -and $progress -le 0.78) { $partLabel = "Part 3: Resonant Tonewood Body & Pickup Dynamics" }
    elseif ($progress -gt 0.78 -and $progress -le 0.92) { $partLabel = "Part 4: High-Stability Bridge & Intonation" }
    elseif ($progress -gt 0.92) { $partLabel = "Part 5: Siap Dieksplorasi - Jelajahi Katalog Resmi" }

    $g.DrawString($partLabel, $fontTitle, $textBrush, 32, $height - 56)
    $g.DrawString("3D Interactive Teardown Model - Placeholder Asset (Ganti di /public/frames/)", $fontSmall, $dimBrush, 32, $height - 32)

    # Clean up
    $copperPen.Dispose()
    $accentPen.Dispose()
    $dimPen.Dispose()
    $fontMono.Dispose()
    $fontTitle.Dispose()
    $fontSmall.Dispose()
    $textBrush.Dispose()
    $copperBrush.Dispose()
    $dimBrush.Dispose()
    $g.Dispose()

    # Save format
    $fileName = "frame_" + $i.ToString("D4") + ".webp"
    $filePath = Join-Path $outputDir $fileName
    $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Write-Host "Success! 60 frames created successfully in $outputDir."
