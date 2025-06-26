const express = require('express');
const router = express.Router();
const  Aibudget= require('../controllers/Aibudget');

router.post('/', Aibudget.getcitybudget);

module.exports = router;