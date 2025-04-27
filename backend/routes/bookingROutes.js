const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Route: GET /api/cities
router.get('/', bookingController.getBookings);

module.exports = router;
