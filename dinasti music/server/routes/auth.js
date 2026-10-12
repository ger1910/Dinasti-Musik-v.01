/**
 * Dinasti Musik - Auth Routes
 * Handles user login and customer registration.
 */

const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' });
  }

  const db = readDB();
  const user = (db.users || []).find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Email atau password tidak ditemukan.' });
  }

  if (role && user.role !== role) {
    return res.status(403).json({ error: `Akun ini tidak memiliki hak akses sebagai ${role}.` });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    message: 'Login berhasil',
    user: userWithoutPassword
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nama, email, dan password wajib diisi.' });
  }

  const db = readDB();
  const existing = (db.users || []).find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Email sudah terdaftar dalam sistem.' });
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

module.exports = router;
