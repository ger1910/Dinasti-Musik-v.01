# Pedoman Agen (Agent Instructions & Operating Guidelines)

Dokumen ini adalah referensi operasional utama bagi Antigravity AI dan agen pengembang dalam merancang, menulis kode, dan memelihara ekosistem **Dinasti Musik** serta workspace `web projek`.

---

## 1. Identitas & Standar Kualitas

1. **Prinsip Anti-Slop & Desain Berkelas**:
   - Selalu patuhi standar estetika tinggi. Hindari desain generik (seperti font default, gradien ungu AI klise, atau tata letak kartu tiga kolom seragam yang membosankan).
   - Gunakan palet warna terkurasi khas Dinasti Musik:
     - **Maroon** (`#5A1A1A`), **Maroon-Dark** (`#3D0F0F`)
     - **Gold** (`#D4AF37`), **Gold-Light** (`#E5C158`)
     - **Cream** (`#FDFBF7`), **Cream-Dark** (`#F5EFE6`)
     - **Dark** (`#1A1A1A`)
   - Paduan tipografi: **Playfair Display** (Heading / Editorial Elegan) dan **Inter** (Body / UI Data Bersih).

2. **Kemandirian & Eksekusi Penuh**:
   - Hindari menghasilkan placeholder, fungsi separuh jadi (`// TODO implement later`), atau kode yang terpotong.
   - Sebelum menyelesaikan tugas, uji dan validasi kode secara mandiri melalui terminal dan periksa sintaksis.

---

## 2. Skillset Aktif Agen

Workspace ini dilengkapi dengan 13 skill khusus di [`.agents/skills`](file:///c:/Users/DELL/OneDrive/Documents/web%20projek/.agents/skills) dan dokumen referensi [docs/SKILL.md](file:///c:/Users/DELL/OneDrive/Documents/web%20projek/docs/SKILL.md):

| Skill | Nama Identifikasi | Panduan Penggunaan |
| :--- | :--- | :--- |
| **taste-skill** | `design-taste-frontend` | Skill frontend anti-slop utama untuk landing page, katalog, dan estetika premium. |
| **brutalist-skill** | `industrial-brutalist-ui` | Digunakan jika memerlukan tampilan data/telemetri stok bertema industrial Swiss / terminal presisi tinggi. |
| **gpt-tasteskill** | `gpt-taste` | Tata letak dinamis, asimetris, dan animasi interaktif halus. |
| **image-to-code-skill** | `image-to-code` | Alur kerja generate referensi visual terlebih dahulu sebelum dikonversi ke kode. |
| **redesign-skill** | `redesign-existing-projects` | Audit dan perbaikan visual proyek tanpa merusak alur data. |
| **output-skill** | `full-output-enforcement` | Memastikan keluaran kode selalu utuh dan tuntas. |
| **soft-skill** | `high-end-visual-design` | Desain tenang, premium, bernuansa agensi mewah. |
| **minimalist-skill** | `minimalist-ui` | Desain editorial utilitarian (gaya Notion / Linear). |
| **stitch-skill** | `stitch-design-taste` | Integrasi Semantic Design System. |
| **imagegen-*** | `web`, `mobile`, `brandkit` | Prompt generator untuk visualisasi dan branding. |

---

## 3. Struktur Proyek

```
web projek/
├── .agents/
│   └── skills/           # 13 skill terpasang untuk Antigravity
├── docs/                 # Dokumentasi rekayasa dan manajemen
│   ├── AGENTS.md         # Pedoman agen (file ini)
│   ├── ARCHITECTURE.md   # Arsitektur teknis sistem
│   ├── prd.md            # Product Requirement Document
│   ├── TODO.md           # Roadmap & task tracker
│   ├── workflow.md       # Alur kerja pengembangan
│   └── SKILL.md          # Referensi detail taste-skill
└── dinasti music/        # Aplikasi Web Dinasti Musik
    ├── index.html        # SPA Dinasti Musik (Admin + Customer)
    ├── server.js         # Express Static Server & Native HTTP fallback
    ├── package.json      # Konfigurasi dependensi Node.js
    └── README.MD         # Panduan instalasi dan penggunaan
```

---

## 4. Aturan Pengkodean

1. **Format File Links**:
   - Selalu gunakan link markdown bergaya GitHub dengan skema `file:///` dan garis miring `/` (contoh: `[index.html](file:///c:/Users/DELL/OneDrive/Documents/web%20projek/dinasti%20music/index.html)`).
2. **Kesesuaian Kode**:
   - Pertahankan kompatibilitas peramban modern.
   - Data state disimpan di `localStorage` dengan format JSON yang divalidasi `try-catch`.
   - Gunakan delegasi event yang efisien dan pastikan tidak ada kebocoran listener memori.
3. **Bahasa & Komunikasi**:
   - Gunakan Bahasa Indonesia yang ramah, jelas, dan profesional untuk berinteraksi dengan pengguna.
