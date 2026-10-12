/**
 * Dinasti Musik - High-End Modular Web Server
 * Orchestrates Express REST API routers and static asset delivery.
 */

const express = require('express');
const path = require('path');
const { readDB } = require('./server/db');

// Import modular routers
const authRoutes = require('./server/routes/auth');
const productRoutes = require('./server/routes/products');
const orderRoutes = require('./server/routes/orders');
const ownerRoutes = require('./server/routes/owner');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const app = express();

// Core Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets and public frontend
app.use(express.static(ROOT_DIR));
app.use('/assets', express.static(path.join(ROOT_DIR, 'assets')));

// Mount REST API Routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/owner', ownerRoutes);

// Store Configuration Endpoint
app.get('/api/config', (req, res) => {
  const db = readDB();
  res.json(db.storeConfig || {});
});

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// Server Initialization
const server = app.listen(PORT, () => {
  console.log(`🎵 Dinasti Musik Server running at: http://localhost:${PORT}`);
  console.log(`📁 Static Assets Directory: ${ROOT_DIR}`);
});

module.exports = { app, server };
