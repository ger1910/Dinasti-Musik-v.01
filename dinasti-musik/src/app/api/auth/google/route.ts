import { NextResponse } from "next/server";
import { loginWithGoogle } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

interface GoogleTokenInfo {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  error_description?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let email = body.email;
    let name = body.name;
    let image = body.image || "";

    // Jika menerima Google ID Token (Google OAuth resmi)
    if (body.credential) {
      try {
        const verifyRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(body.credential)}`
        );
        if (verifyRes.ok) {
          const tokenInfo: GoogleTokenInfo = await verifyRes.json();
          if (tokenInfo.email) {
            email = tokenInfo.email;
            name = tokenInfo.name || email.split("@")[0];
            image = tokenInfo.picture || image;
          }
        } else {
          console.warn("[auth/google] Token verification failed, falling back to body data if provided");
        }
      } catch (tokenErr) {
        console.error("[auth/google] Gagal memverifikasi token Google:", tokenErr);
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email Google diperlukan untuk melanjutkan login." },
        { status: 400 }
      );
    }

    const user = await loginWithGoogle({
      email,
      name: name || email.split("@")[0],
      image,
    });

    logAudit({
      userId: user.id,
      userName: user.name,
      action: "LOGIN_SUCCESS",
      entity: "AUTH",
      entityId: user.id,
      metadata: { provider: "google", emailVerified: Boolean(body.credential) },
    });

    return NextResponse.json({
      message: "Berhasil masuk dengan akun Google.",
      user,
    });
  } catch (error) {
    console.error("[auth/google]", error);
    return NextResponse.json(
      { error: "Gagal menghubungkan ke akun Google." },
      { status: 500 }
    );
  }
}

