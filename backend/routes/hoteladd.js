const express = require('express');
const router = express.Router();
const  hotel= require('../controllers/hoteladd');

router.post('/', hotel.saveCityAndHotel);

module.exports = router;
