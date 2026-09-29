# Dinasti Musik — Web Management & Store

Aplikasi sistem manajemen toko alat musik premium (Creative Hub Admin) dan katalog toko pelanggan. 

## Struktur Proyek
```
dinasti music/
├── index.html       # Single-Page Application (Admin Dashboard, POS Kasir, Katalog Pelanggan)
├── server.js        # Server Node.js (Express & Native HTTP fallback)
├── package.json     # Konfigurasi dependensi & npm scripts
├── package-lock.json
└── README.MD        # Dokumentasi panduan proyek
```

## Cara Menjalankan
1. Pastikan **Node.js** sudah terpasang di komputer.
2. Buka terminal pada folder `dinasti music`:
   ```bash
   cd "dinasti music"
   ```
3. Pasang dependensi:
   ```bash
   npm install
   ```
4. Jalankan server:
   ```bash
   npm start
   ```
5. Buka peramban ke **http://localhost:3000**

## Fitur Utama

### 1. Admin Creative Hub
- **Login Admin**: Autentikasi dengan toggle tampil/sembunyi sandi.
- **Dashboard Ringkasan Bisnis**: Metrik omzet, total inventaris, pesanan hari ini, dan peringatan stok menipis.
- **Manajemen Produk**: CRUD produk lengkap (tambah, perbarui, hapus) dengan pencarian dan filter kategori.
- **Manajemen Stok**: Pemantauan level stok dan status restock inventaris.
- **Kasir & POS**: Pemilihan produk instan, keranjang belanja, kalkulasi otomatis, dan cetak struk transaksi digital.
- **Laporan Keuangan**: Analisis penjualan berkala dan ekspor data transaksi.

### 2. Front-End Toko Pelanggan (Customer Experience)
- **Beranda (Home)**: Tampilan visual showcase instrumen musik premium.
- **Katalog Produk**: Filter instrumen (Gitar, Drum, Keyboard/Piano, Audio, Aksesori).
- **Detail Produk**: Spesifikasi teknis instrumen dan galeri foto.
- **Keranjang & Kontak**: Pemesanan langsung dan integrasi layanan pelanggan.

> **Penyimpanan Data**: Data disimpan secara lokal di browser (`localStorage`) sehingga data tetap tersimpan saat tab ditutup atau direfresh.