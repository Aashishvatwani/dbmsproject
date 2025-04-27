const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// Route: Create Package
router.post('/', packageController.createPackage);

module.exports = router;
