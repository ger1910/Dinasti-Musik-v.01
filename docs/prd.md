# Product Requirement Document (PRD) — Dinasti Musik

## 1. Informasi Produk
- **Nama Produk**: Dinasti Musik (Creative Hub & Storefront)
- **Versi**: 1.0.0
- **Status**: Siap Rilis / MVP Aktif
- **Pemilik Proyek**: Tim Kewirausahaan XI RPL 1

---

## 2. Latar Belakang & Visi Produk

### 2.1 Masalah
Toko alat musik mandiri seringkali menghadapi kendala pengelolaan inventaris manual, pencatatan transaksi yang rentan selisih, dan ketiadaan sistem kasir (POS) modern yang elegan tanpa biaya berlangganan server database yang mahal.

### 2.2 Solusi
**Dinasti Musik** menghadirkan solusi all-in-one berbasis web yang menggabungkan **Point of Sale (POS)**, **Manajemen Stok Real-Time**, dan **Etalase Pelanggan** dalam antarmuka bernuansa mewah (*vintage luxury*). Seluruh data tersimpan secara lokal dan instan di peramban klien tanpa memerlukan konfigurasi database eksternal yang rumit.

---

## 3. Profil Pengguna & Persona

| Persona | Peran | Kebutuhan Utama |
| :--- | :--- | :--- |
| **Budi (Admin / Kasir)** | Pengelola harian toko | Memproses checkout pelanggan dengan cepat, mencetak struk digital, dan mengupdate stok produk secara langsung. |
| **Iwan (Pemilik Toko)** | Pengambil keputusan bisnis | Melihat ringkasan omzet, memantau produk yang hampir habis, dan mengecek laporan keuangan harian/bulanan. |
| **Rian (Musisi / Pelanggan)** | Pembeli instrumen | Menjelajahi katalog instrumen premium, melihat spesifikasi gitar/drum/keyboard, dan menghubungi toko dengan mudah. |

---

## 4. Rincian Kebutuhan Fungsional (Functional Requirements)

### FR-1: Autentikasi & Navigasi Admin
- **Deskripsi**: Form login elegan dengan validasi kredensial dan opsi sembunyikan/tampilkan kata sandi.
- **Kriteria Penerimaan**:
  - Pengguna dapat masuk ke Creative Hub.
  - Sesi login mempertahankan state selama jendela dibuka.
  - Opsi logout mengembalikan antarmuka ke layar login secara bersih.

### FR-2: Dashboard Ringkasan Bisnis
- **Deskripsi**: Visualisasi metrik kunci performa toko.
- **Kriteria Penerimaan**:
  - Menampilkan kartu metrik: Total Omzet, Total Produk Terdaftar, Pesanan Hari Ini, dan Peringatan Stok Rendah.
  - Tabel transaksi terbaru yang diperbarui secara reaktif.

### FR-3: Manajemen Inventaris & Produk (CRUD)
- **Deskripsi**: Penambahan, pengeditan, penghapusan, dan pencarian produk musik.
- **Kriteria Penerimaan**:
  - Filter berdasarkan kategori: Gitar, Drum, Keyboard, Audio, Aksesori.
  - Kolom pencarian instan berdasarkan nama instrumen atau SKU.
  - Form modal untuk menambahkan instrumen baru beserta gambar, harga, dan stok awal.

### FR-4: Point of Sale (POS) Kasir
- **Deskripsi**: Modul kasir terpadu untuk toko fisik.
- **Kriteria Penerimaan**:
  - Klik produk untuk menambahkan ke keranjang transaksi.
  - Kalkulasi subtotal, pajak, diskon, dan total tagihan secara akurat.
  - Fitur checkout instan yang otomatis memotong jumlah stok produk.

### FR-5: Struk Digital & Riwayat Transaksi
- **Deskripsi**: Bukti pembayaran digital yang dapat dilihat dan dicetak.
- **Kriteria Penerimaan**:
  - Modal struk dengan identitas toko, nomor invoice, tanggal, rincian barang, dan total.
  - Tombol cetak struk kompatibel dengan printer termal/desktop.

### FR-6: Customer Storefront
- **Deskripsi**: Halaman publik untuk pengunjung toko.
- **Kriteria Penerimaan**:
  - Banner hero dengan visual instrumen premium.
  - Showcase produk unggulan dan grid katalog interaktif.

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)

1. **Performa**: Waktu muat halaman awal di bawah 1.5 detik pada jaringan standar.
2. **Kompatibilitas**: Berjalan mulus di Chrome, Edge, Safari, dan Firefox, baik pada resolusi desktop maupun smartphone.
3. **Ketahanan Data**: State disimpan pada `localStorage` sehingga data tidak hilang saat tab ditutup.
4. **Estetika**: Desain bertaraf agensi tinggi sesuai standar *Taste Skill* (warna hangat, tipografi Playfair/Inter, micro-interaction halus).
