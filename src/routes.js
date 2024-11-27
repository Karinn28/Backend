const express = require('express');
const { loginHandler, carbonEmissionHandler, getCarbonEmissionHandler } = require('./handler');
const router = express.Router();

// Route untuk login
router.post('/login', loginHandler);

// Route untuk menambah emisi karbon
router.post('/carbon-emission', carbonEmissionHandler);

// Route untuk menampilkan data emisi karbon berdasarkan user_id
router.get('/carbon-emission/:user_id', getCarbonEmissionHandler);

module.exports = router;