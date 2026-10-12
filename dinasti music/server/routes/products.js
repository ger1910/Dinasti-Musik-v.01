/**
 * Dinasti Musik - Product Routes
 * Handles inventory CRUD, catalog filtering, and real-time search.
 */

const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// GET /api/products
router.get('/', (req, res) => {
  const db = readDB();
  let { q, category } = req.query;
  let items = db.products || [];

  if (category && category !== 'All' && category !== 'Semua') {
    items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (q && q.trim() !== '') {
    const queryStr = q.trim().toLowerCase();
    items = items.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(queryStr)) ||
        (p.brand && p.brand.toLowerCase().includes(queryStr)) ||
        (p.category && p.category.toLowerCase().includes(queryStr)) ||
        (p.description && p.description.toLowerCase().includes(queryStr))
    );
  }

  res.json({
    total: items.length,
    products: items
  });
});

// POST /api/products
router.post('/', (req, res) => {
  const { name, brand, category, price, stock, description, image } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Nama produk dan harga wajib diisi.' });
  }

  const db = readDB();
  const newProduct = {
    id: 'PROD-' + Date.now().toString().slice(-4),
    name: name.trim(),
    brand: brand ? brand.trim() : 'Dinasti Custom',
    category: category || 'Gitar',
    price: Number(price),
    stock: Number(stock) || 0,
    image: image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    rating: 5.0,
    status: Number(stock) > 0 ? 'In Stock' : 'Out of Stock',
    description: description || ''
  };

  db.products.unshift(newProduct);
  writeDB(db);

  res.status(201).json({ message: 'Produk berhasil ditambahkan', product: newProduct });
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Produk tidak ditemukan.' });
  }

  const current = db.products[index];
  const updatedStock = req.body.stock !== undefined ? Number(req.body.stock) : current.stock;
  const updated = {
    ...current,
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : current.price,
    stock: updatedStock,
    status: updatedStock > 0 ? 'In Stock' : 'Out of Stock'
  };

  db.products[index] = updated;
  writeDB(db);

  res.json({ message: 'Produk berhasil diperbarui', product: updated });
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);

  if (db.products.length === initialLen) {
    return res.status(404).json({ error: 'Produk tidak ditemukan.' });
  }

  writeDB(db);
  res.json({ message: 'Produk berhasil dihapus.' });
});

module.exports = router;
