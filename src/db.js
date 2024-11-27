const mysql = require('mysql2/promise'); // Import mysql2 dengan promises
require('dotenv').config(); // Menggunakan dotenv untuk mengelola variabel lingkungan

// Membaca konfigurasi database dari variabel lingkungan (disarankan untuk menyimpan ini di file .env)
const pool = mysql.createPool({
  host: process.env.DB_HOST,    // Contoh: 'localhost'
  user: process.env.DB_USER,    // Contoh: 'root'
  password: process.env.DB_PASS, // Contoh: 'password'
  database: process.env.DB_NAME, // Contoh: 'planetsku'
  waitForConnections: true,     // Menunggu jika ada koneksi lain yang sedang digunakan
  connectionLimit: 10,          // Batas koneksi maksimum
  queueLimit: 0                 // Tidak ada batas untuk antrean koneksi
});

// Fungsi untuk mengeksekusi query dengan parameter
async function executeQueryWithParams(query, params) {
  const [results, ] = await pool.execute(query, params);
  return results;
}

module.exports = {
  executeQueryWithParams
};