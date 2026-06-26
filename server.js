// backend/server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối Supabase Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Điền URL kết nối Database Supabase vào file .env
  ssl: { rejectUnauthorized: false }
});

// 1. Lấy danh sách sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Thêm sản phẩm
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, desc } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, price, "desc", is_visible) VALUES ($1, $2, $3, true) RETURNING *',
      [name, price, desc]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Sửa sản phẩm
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, price, desc } = req.body;
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, "desc" = $3 WHERE id = $4 RETURNING *',
      [name, price, desc, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Ẩn/Hiện sản phẩm
app.patch('/api/products/:id/visibility', async (req, res) => {
  try {
    const { is_visible } = req.body;
    await pool.query('UPDATE products SET is_visible = $1 WHERE id = $2', [is_visible, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend chạy tại http://localhost:${PORT}`));