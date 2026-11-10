# 🧠 Panduan & Direktori AI Skills (skills-ai)

Direktori ini mengelompokkan modul, skill panduan kecerdasan buatan (AI coding agent), dan aturan desain antarmuka berkualitas tinggi untuk proyek **Dinasti Musik**.

---

## 📁 Struktur Berkas

```
skills-ai/
├── README.md               # Dokumentasi direktori ini
├── tasteskill.md           # Anti-slop frontend taste guidelines (editorial luxury)
├── antislop-core.md        # Aturan filter inti anti-slop (38 rules standard)
├── antislop-guide.md       # Panduan lengkap implementasi dan audit antislop
└── audits/                 # Laporan audit kepatuhan desain & aksesibilitas
    ├── audit-001-2026-10-10.md
    └── audit-001-remediation-report.md
```

---

## 🛠️ Modul Agen AI di Proyek Ini

Skill agent yang terdaftar dan siap digunakan secara otomatis oleh AI:
- **`taste-skill` / `tasteskill.md`**: Menghasilkan tata letak antarmuka tingkat lanjut (Awwwards/Linear quality), tipografi editorial, bento grids, dan micro-interaction responsif.
- **`antislop-ui`**: Mencegah visual AI slop (warna generik, kontras rendah, tombol tanpa status, layout berantakan).
- **`antislop-copywriting`**: Mencegah gaya penulisan korporat kaku/klise atau tanda baca artifisial seperti em dash berlebih.
- **`antislop-human`**: Standar aksesibilitas WCAG AA/AAA, ukuran tap target minimum 44px, dan navigasi keyboard.
- **`nextjs-app-router-patterns`**: Arsitektur server components, client components, dynamic routing, dan API endpoint.
- **`auth-implementation-patterns`**: Pola autentikasi sesi, verifikasi peran (role-based access control), dan enkripsi.

Kumpulan skill lengkap dapat diakses di direktori `.agents/skills/`.
