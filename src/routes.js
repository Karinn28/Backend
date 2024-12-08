const express = require('express');
const { loginHandler, carbonEmissionHandler, getCarbonEmissionHandler, createNewUser, getUser, updateUser, deleteUser } = require('./handler');
const router = express.Router();

// Route untuk login
router.post('/login', loginHandler);

// Route untuk menambah emisi karbon
router.post('/carbon-emission', carbonEmissionHandler);

// Route untuk menampilkan data emisi karbon berdasarkan user_id
router.get('/carbon-emission/:user_id', getCarbonEmissionHandler);

// CREATE - POST 
router.post('/register', createNewUser);

// READ - GET
router.get('/user', getUser);

// UPDATE - PATCH
router.patch('/user/:id', updateUser);

// DELETE - DELETE
router.delete('/user/:id', deleteUser);

module.exports = router;