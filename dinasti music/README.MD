<div align="center">

# 🏛️ DINASTI MUSIK
### *Haute Horlogerie of Musical Instruments & Creative Management Hub*

[![Node.js](https://img.shields.io/badge/Node.js-v18+-0D1317?style=for-the-badge&logo=node.js&logoColor=C59B6D)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-REST_API-0D1317?style=for-the-badge&logo=express&logoColor=FFFFFF)](https://expressjs.com)
[![Architecture](https://img.shields.io/badge/Architecture-Modular_ES6+-0D1317?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](../README.md)
[![Design](https://img.shields.io/badge/Design_System-Double--Bezel_Luxury-0D1317?style=for-the-badge&logo=figma&logoColor=C59B6D)](styles.css)
[![Status](https://img.shields.io/badge/Production-Ready-0D1317?style=for-the-badge&logo=checkmarx&logoColor=10B981)](http://localhost:3000)

<p align="center">
  Platform e-commerce instrumen musik kurasi premium dan Creative Hub manajemen toko. <br>
  Dirancang dengan standar arsitektur perangkat lunak modular modern, bebas dari monolitik code-spaghetti ("vibecoding anti-pattern"), mengusung estetika editorial luxury bergaya <i>Awwwards / Linear-tier</i>.
</p>

</div>

---

## 🚀 Panduan Cepat Menjalankan

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan server
npm start
```
Buka peramban ke **http://localhost:3000**

---

## 🔑 Kredensial Pengujian (Demo Accounts)

| Role | Tab Login | Email | Password |
| :--- | :--- | :--- | :--- |
| **Owner / Manajemen** | Tab "Owner" | `admin@dinastimusik.com` | `dinasti2026` |
| **Customer / Pembeli** | Tab "Customer" | `customer@email.com` | `customer123` |

---

## 📐 Arsitektur Modular

- `index.html`: Shell presentasi bersih semantik (< 900 baris, tanpa inline script raksasa).
- `assets/js/modules/`: Modul ES6 terisolasi (`api.js`, `auth.js`, `catalog.js`, `cart.js`, `admin.js`, `ui.js`, `storage.js`).
- `server/`: Backend terstruktur (`db.js`, `routes/auth.js`, `routes/products.js`, `routes/orders.js`, `routes/owner.js`).
- `styles.css`: Luxury design tokens, Double-Bezel hardware styling, subtle film grain noise, spring transitions.

*Untuk dokumentasi teknis lengkap dan diagram alur sistem, silakan baca [README Utama Proyek](../README.md).*