const express = require('express');
const router = express.Router();
const userdetail = require('../controllers/userdetail');

// Route: GET /api/cities
router.post('/', userdetail.createUser);

module.exports = router;
