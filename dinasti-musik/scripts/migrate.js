/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");
const BACKUP_PATH = path.join(__dirname, "..", "data", "db.pre-migration.json");

async function migrate() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  const db = JSON.parse(raw);
  fs.writeFileSync(BACKUP_PATH, raw, "utf-8");
  console.log("Backup created.");

  // Hash passwords
  for (const user of db.users) {
    if (user.password && !user.password.startsWith("$2")) {
      const plain = user.password;
      user.password = await bcrypt.hash(plain, 12);
      console.log("Hashed:", user.email);
    }
    if (!user.createdAt) user.createdAt = new Date("2026-01-01").toISOString();
  }

  // Fix storeConfig
  db.storeConfig.address = "Jl. Pasir Rahayu IV, CC No. 22, Bandung";
  db.storeConfig.city = "Bandung";
  db.storeConfig.openingHours = "Senin-Sabtu: 09.00-18.00 WIB";

  // Remove test product
  const before = db.products.length;
  db.products = db.products.filter(p => p.id !== "PROD-3184");
  console.log("Removed test products:", before - db.products.length);

  // Add timestamps to products
  const now = new Date().toISOString();
  for (const p of db.products) {
    if (!p.createdAt) p.createdAt = new Date("2026-01-01").toISOString();
    if (!p.updatedAt) p.updatedAt = p.createdAt;
  }

  // Fix orders
  for (const o of db.orders) {
    if (!o.paymentStatus) o.paymentStatus = o.status === "Completed" ? "Paid" : "Unpaid";
    if (!o.createdAt) o.createdAt = o.date || now;
    if (!o.updatedAt) o.updatedAt = o.createdAt;
    if (!o.shippingCost) o.shippingCost = 0;
    for (const item of (o.items || [])) {
      if (!item.name) item.name = "Produk";
      if (!item.image) item.image = "";
    }
  }

  // Add new schema fields
  if (!db.sessions) db.sessions = [];
  if (!db.notifications) db.notifications = [{
    id: "NOTIF-001", type: "system",
    title: "Sistem Aktif",
    message: "Dashboard Dinasti Musik berhasil diinisialisasi.",
    isRead: false, createdAt: now
  }];
  if (!db.auditLogs) db.auditLogs = [{
    id: "AUDIT-001", userId: "USR-OWNER",
    userName: "Riski Ganjani", action: "SYSTEM_INIT",
    entity: "SYSTEM", timestamp: now
  }];
  if (!db.expenses) db.expenses = [];
  if (!db.carts) db.carts = {};

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  console.log("Migration complete! Products:", db.products.length, "Users:", db.users.length);
}

migrate().catch(e => { console.error("MIGRATION FAILED:", e); process.exit(1); });
