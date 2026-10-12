/**
 * Dinasti Musik - Orders & Checkout Routes
 * Handles order placements, stock verification/deduction, and status transitions.
 */

const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// GET /api/orders
router.get('/', (req, res) => {
  const db = readDB();
  const { customerId } = req.query;
  let orders = db.orders || [];

  if (customerId) {
    orders = orders.filter((o) => o.customerId === customerId);
  }

  orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(orders);
});

// POST /api/orders
router.post('/', (req, res) => {
  const { customerId, customerName, customerEmail, items, paymentMethod } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Keranjang belanja kosong.' });
  }

  const db = readDB();

  // Validate stock
  for (const item of items) {
    const prod = (db.products || []).find((p) => p.id === item.productId);
    if (!prod) {
      return res.status(400).json({ error: `Produk ID ${item.productId} tidak ditemukan.` });
    }
    if (prod.stock < item.qty) {
      return res.status(400).json({
        error: `Stok produk ${prod.name} tidak mencukupi (Tersedia: ${prod.stock}).`
      });
    }
  }

  // Deduct stock atomically
  for (const item of items) {
    const prod = db.products.find((p) => p.id === item.productId);
    prod.stock -= item.qty;
    if (prod.stock <= 0) {
      prod.stock = 0;
      prod.status = 'Out of Stock';
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const newOrder = {
    id: `TRX-${dateStr}-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString(),
    customerId: customerId || 'GUEST',
    customerName: customerName || 'Pelanggan Umum',
    customerEmail: customerEmail || '-',
    items: items,
    subtotal: subtotal,
    total: subtotal,
    paymentMethod: paymentMethod || 'Transfer Bank',
    status: 'Pending'
  };

  db.orders = db.orders || [];
  db.orders.unshift(newOrder);
  writeDB(db);

  res.status(201).json({
    message: 'Transaksi berhasil dibuat',
    order: newOrder
  });
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status baru harus ditentukan.' });
  }

  const db = readDB();
  const order = (db.orders || []).find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
  }

  order.status = status;
  writeDB(db);

  res.json({ message: 'Status pesanan berhasil diperbarui', order });
});

module.exports = router;
