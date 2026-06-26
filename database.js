// database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Bắt buộc phải có để Supabase chấp nhận kết nối bảo mật SSL
  }
});

// Kiểm tra kết nối thử khi khởi động backend
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Kết nối tới Supabase thất bại:', err.stack);
  }
  console.log('✅ Kết nối database Supabase thành công!');
  release();
});

module.exports = pool;