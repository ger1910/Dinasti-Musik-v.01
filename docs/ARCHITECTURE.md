# Arsitektur Sistem — Dinasti Musik

Dokumen ini menjelaskan arsitektur teknis, aliran data, komponen antarmuka, dan model penyimpanan data untuk aplikasi **Dinasti Musik**.

---

## 1. Ikhtisar Sistem (High-Level Architecture)

Dinasti Musik dirancang sebagai **Single-Page Application (SPA)** hibrida yang menyatukan dua modul utama dalam satu ekosistem:
1. **Admin Creative Hub & POS**: Modul internal untuk pemilik toko dan kasir (inventaris, kasir/POS, struk digital, analitik).
2. **Customer Storefront**: Modul etalase bagi pelanggan untuk menjelajahi instrumen musik premium.

```mermaid
graph TD
    Client[Browser Klien]
    Server[Node.js Server - server.js]
    LocalStorage[(Browser LocalStorage)]
    
    subgraph Frontend SPA [Single-Page Application]
        Auth[Modul Autentikasi / Login]
        AdminHub[Creative Hub Admin]
        CustomerStore[Customer Storefront]
        
        AdminHub --> Dashboard[Dashboard Bisnis]
        AdminHub --> Products[CRUD Produk]
        AdminHub --> Stock[Manajemen Stok]
        AdminHub --> POS[Kasir & Checkout]
        AdminHub --> Reports[Laporan Keuangan]
        
        CustomerStore --> Hero[Showcase Beranda]
        CustomerStore --> Catalog[Katalog & Filter]
        CustomerStore --> Cart[Keranjang Belanja]
    end

    Client -->|HTTP Request| Server
    Server -->|Kirim File Statis & SPA Fallback| Client
    Frontend SPA <-->|Baca/Tulis State JSON| LocalStorage
```

---

## 2. Arsitektur Frontend

### 2.1 Desain Sistem & Token Visual
Aplikasi mengusung estetika **Luxury Heritage & Warm Craftsmanship**:
- **Warna Utama**:
  - `maroon` (`#5A1A1A`) & `maroon-dark` (`#3D0F0F`): Melambangkan kemewahan kayu instrumen dan wibawa.
  - `gold` (`#D4AF37`) & `gold-light` (`#E5C158`): Aksen kuningan/brass instrumen musik.
  - `cream` (`#FDFBF7`) & `cream-dark` (`#F5EFE6`): Latar belakang hangat ala partitur musik vintage.
  - `dark` (`#1A1A1A`): Tipografi dengan kontras tinggi dan mudah dibaca.
- **Tipografi**:
  - Headings: `Playfair Display, serif`
  - Body Text & Telemetri: `Inter, sans-serif`

### 2.2 Hirarki Komponen Antarmuka
- `login-page`: Halaman autentikasi terbelah dua (Left: Branding Image, Right: Form Input).
- `admin-wrapper`: Shell aplikasi admin dengan sidebar tetap (desktop) dan laci geser responsif (mobile).
  - `dashboard`: Ringkasan omzet, total produk, pesanan, dan tabel transaksi terkini.
  - `products`: Galeri dan tabel produk dengan filter kategori, pencarian real-time, dan modal penambahan produk.
  - `stock`: Status stok kritis, indikator visual kuantitas, dan opsi restock cepat.
  - `pos`: Panel transaksi kasir, kalkulator kembalian, diskon, dan generator struk digital.
  - `reports`: Rekap performa penjualan berkala.
- `customer-wrapper`: Tampilan etalase publik untuk pengalaman belanja yang ramah konsumen.

---

## 3. Skema Data & Model Penyimpanan

Aplikasi menggunakan penyimpanan berbasis klien via `localStorage` yang terisolasi dan mandiri:

### 3.1 Entitas Produk (`dinasti_products`)
```json
[
  {
    "id": "PROD-001",
    "name": "Fender American Professional II Stratocaster",
    "category": "Gitar",
    "price": 28500000,
    "stock": 4,
    "image": "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f",
    "status": "In Stock",
    "description": "Gitar listrik legendaris dengan pick-up V-Mod II single-coil."
  }
]
```

### 3.2 Entitas Transaksi (`dinasti_transactions`)
```json
[
  {
    "id": "TRX-20260908-001",
    "date": "2026-09-08T19:20:00.000Z",
    "items": [
      {
        "productId": "PROD-001",
        "name": "Fender American Professional II",
        "qty": 1,
        "price": 28500000
      }
    ],
    "subtotal": 28500000,
    "discount": 0,
    "total": 28500000,
    "paymentMethod": "Cash",
    "cashier": "Admin"
  }
]
```

---

## 4. Arsitektur Server (`server.js`)

Server dirancang dengan pola **Dual-Engine Robustness**:
1. **Engine Utama (Express.js)**: Menyajikan routing statis, kompresi, dan penanganan catch-all route SPA.
2. **Engine Cadangan (Native Node.js `http`)**: Jika dependensi `node_modules` belum terpasang, server otomatis beralih ke modul `http` bawaan Node.js tanpa menghentikan proses (*zero-failure startup*).

```javascript
// Struktur Port Binding
const PORT = process.env.PORT || 3000;
```

---

## 5. Keamanan & Performa

- **Sanitasi Data**: Menggunakan input escaping saat menyajikan data dinamis ke DOM untuk mencegah celah XSS.
- **Responsivitas**: Grid adaptif menggunakan Tailwind CSS breakpoint (`sm`, `md`, `lg`, `xl`).
- **Pembersihan Cache**: Aset eksternal dimuat melalui CDN terpercaya dengan integrasi font Google dan icon FontAwesome.
