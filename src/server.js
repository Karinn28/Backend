const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 8089;

// Middleware untuk parsing JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware untuk validasi autentikasi
app.use((req, res, next) => {
  // Bypass autentikasi untuk login dan user
  if (req.path === '/login' || req.path.startsWith('/register')) return next();

  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Token not provided' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken; // Menyimpan informasi pengguna di request
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});

// Menggunakan routes untuk routing
app.use(routes);

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
