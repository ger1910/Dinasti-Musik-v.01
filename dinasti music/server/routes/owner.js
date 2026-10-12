/**
 * Dinasti Musik - Owner & System Telemetry Routes
 * Provides revenue stats, business metrics, and store config.
 */

const express = require('express');
const router = express.Router();
const { readDB } = require('../db');

// GET /api/owner/stats
router.get('/stats', (req, res) => {
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

module.exports = router;
