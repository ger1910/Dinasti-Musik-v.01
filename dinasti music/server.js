/**
 * Dinasti Musik - Express REST API & Static Web Server
 * Integrated persistent JSON database (data/db.json) with fallback HTTP engine
 */

const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_PATH = path.join(ROOT_DIR, 'data', 'db.json');

// --- Helper Database Persist ---
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { storeConfig: {}, users: [], products: [], orders: [], carts: {} };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database:', err);
    return { storeConfig: {}, users: [], products: [], orders: [], carts: {} };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

function startWithExpress() {
  const express = require('express');
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(ROOT_DIR));

  // Serve assets explicitly
  app.use('/assets', express.static(path.join(ROOT_DIR, 'assets')));

  // --- REST API ENDPOINTS ---

  // 1. Store Config & Owner Info
  app.get('/api/config', (req, res) => {
    const db = readDB();
    res.json(db.storeConfig || {});
  });

  // 2. Authentication (Login)
  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }

    const db = readDB();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: 'Email atau password tidak ditemukan.' });
    }

    // Role check if requested specifically
    if (role && user.role !== role) {
      return res.status(403).json({ error: `Akun ini tidak memiliki hak akses sebagai ${role}.` });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login berhasil',
      user: userWithoutPassword
    });
  });

  // 3. Register Customer
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi.' });
    }

    const db = readDB();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }

    const newUser = {
      id: 'USR-' + Date.now(),
      email: email.trim(),
      password: password,
      name: name.trim(),
      role: 'customer',
      phone: phone || ''
    };

    db.users.push(newUser);
    writeDB(db);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Registrasi berhasil', user: userWithoutPassword });
  });

  // 4. Products API
  app.get('/api/products', (req, res) => {
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
          p.name.toLowerCase().includes(queryStr) ||
          p.brand.toLowerCase().includes(queryStr) ||
          p.category.toLowerCase().includes(queryStr) ||
          (p.description && p.description.toLowerCase().includes(queryStr))
      );
    }

    res.json({
      total: items.length,
      products: items
    });
  });

  app.post('/api/products', (req, res) => {
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

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }

    const current = db.products[index];
    const updated = {
      ...current,
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : current.price,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : current.stock,
      status: (req.body.stock !== undefined ? Number(req.body.stock) : current.stock) > 0 ? 'In Stock' : 'Out of Stock'
    };

    db.products[index] = updated;
    writeDB(db);

    res.json({ message: 'Produk berhasil diperbarui', product: updated });
  });

  app.delete('/api/products/:id', (req, res) => {
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

  // 5. Orders API
  app.get('/api/orders', (req, res) => {
    const db = readDB();
    const { customerId } = req.query;
    let orders = db.orders || [];

    if (customerId) {
      orders = orders.filter((o) => o.customerId === customerId);
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(orders);
  });

  app.post('/api/orders', (req, res) => {
    const { customerId, customerName, customerEmail, items, paymentMethod } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Keranjang belanja kosong.' });
    }

    const db = readDB();

    // Verify stock availability
    for (const item of items) {
      const prod = db.products.find((p) => p.id === item.productId);
      if (!prod) {
        return res.status(400).json({ error: `Produk ID ${item.productId} tidak ditemukan.` });
      }
      if (prod.stock < item.qty) {
        return res.status(400).json({
          error: `Stok produk ${prod.name} tidak mencukupi (Tersisa: ${prod.stock}).`
        });
      }
    }

    // Deduct stock
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

    db.orders.unshift(newOrder);
    writeDB(db);

    res.status(201).json({
      message: 'Transaksi berhasil dibuat',
      order: newOrder
    });
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status baru harus ditentukan.' });
    }

    const db = readDB();
    const order = db.orders.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
    }

    order.status = status;
    writeDB(db);

    res.json({ message: 'Status pesanan berhasil diperbarui', order });
  });

  // 6. Owner Stats API
  app.get('/api/owner/stats', (req, res) => {
    const db = readDB();
    const orders = db.orders || [];
    const products = db.products || [];
    const customers = (db.users || []).filter((u) => u.role === 'customer');

    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockCount = products.filter((p) => p.stock <= 3).length;

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockCount,
      totalCustomers: customers.length,
      recentOrders: orders.slice(0, 5)
    });
  });

  // SPA Fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`🎵 Dinasti Musik Server berjalan pada: http://localhost:${PORT}`);
    console.log(`📁 Melayani direktori: ${ROOT_DIR}`);
    console.log(`💾 Database File: ${DB_PATH}`);
  });
}

try {
  startWithExpress();
} catch (e) {
  console.log('⚠️ Express belum terpasang atau gagal dimuat:', e.message);
}
