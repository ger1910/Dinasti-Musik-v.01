# Roadmap & Task Tracker — Dinasti Musik

Daftar tugas, pencapaian, dan rencana pengembangan sistem Dinasti Musik.

---

## 🚀 Fase 1: Fondasi & Standardisasi Proyek (Selesai ✅)

- [x] **Koreksi File Konfigurasi**: Memperbaiki typo `pacage.json` menjadi `package.json` yang valid.
- [x] **Pembuatan Server Node.js**: Membuat [server.js](file:///c:/Users/DELL/OneDrive/Documents/web%20projek/dinasti%20music/server.js) dengan dukungan Express dan fallback otomatis ke modul HTTP bawaan Node.js.
- [x] **Instalasi Dependensi**: Menjalankan `npm install` untuk modul Express.
- [x] **Instalasi Custom Skills Antigravity**: Mengunduh dan menempatkan 13 skill desain dari `leonxlnx/taste-skill` ke [.agents/skills](file:///c:/Users/DELL/OneDrive/Documents/web%20projek/.agents/skills) dan Global Configuration.
- [x] **Dokumentasi Terpadu**:
  - [x] [docs/AGENTS.md](file:///c:/Users/DELL/OneDrive/Documents/web%20projek/docs/AGENTS.md) — Panduan agen AI dan standar pengkodean.
  - [x] [docs/ARCHITECTURE.md](file:///c:/Users/DELL/OneDrive/Documents/web%20projek/docs/ARCHITECTURE.md) — Arsitektur teknis, diagram mermaid, dan skema data.
  - [x] [docs/prd.md](file:///c:/Users/DELL/OneDrive/Documents/web%20projek/docs/prd.md) — Product Requirement Document lengkap.
  - [x] [docs/SKILL.md](file:///c:/Users/DELL/OneDrive/Documents/web%20projek/docs/SKILL.md) — Salinan lengkap taste-skill v2.

---

## ⚡ Fase 2: Ekosistem Developer Tools & Integrasi MCP (Sedang Berjalan 🔄)

- [x] Unduh & instalasi **Chrome DevTools MCP** (`chrome-devtools-mcp`).
- [x] Konfigurasi server MCP global di `~/.gemini/config/mcp_config.json`.
- [x] Konfigurasi workspace MCP di `.agents/mcp_config.json`.
- [ ] Validasi konektivitas server MCP dari Antigravity.

---

## 📦 Fase 3: Fitur Lanjutan & Peningkatan UX (Backlog 📋)

- [ ] **Ekspor & Impor Cadangan Data**:
  - Opsi unduh seluruh data produk dan transaksi dalam bentuk file `.json` atau `.csv`.
  - Opsi unggah file cadangan untuk memulihkan data antar-komputer.
- [ ] **Optimalisasi Struk Transaksi**:
  - Pilihan tata letak struk termal ukuran 58mm dan 80mm.
  - Dukungan pratinjau cetak langsung (*print preview window*).
- [ ] **Scanner Barcode/QR Code**:
  - Integrasi pembacaan kamera untuk pemindaian barcode produk pada kasir POS.
- [ ] **PWA & Akses Offline Penuh**:
  - Pemasangan `manifest.json` dan Service Worker agar aplikasi dapat diinstal di desktop/smartphone sebagai aplikasi lokal.
