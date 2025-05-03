const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const restaurantController = require('../controllers/restraurantController');
const weatherController = require('../controllers/weatherController');
const mapsController = require('../controllers/mapsController');

// Route: Get list of cities
router.get('/', cityController.getCities);
router.get('/search-cities/:name', cityController.searchCities);
// Route: Get restaurants in a city
router.get('/:city/details', restaurantController.getCityDetails);


// Route: Get weather of a city
router.get('/:city/weather', weatherController.getWeather);

// Route: Get map of a city
router.get('/:city/map', mapsController.getMap);

module.exports = router;
