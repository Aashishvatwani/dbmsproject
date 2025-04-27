const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Route: GET /api/cities
router.get('/restaurants', restaurantController.getrestaurants);

module.exports = router;
