const express = require('express');
const router = express.Router();
const  expenses= require('../controllers/addexpensedata');

router.get('/', expenses.expenditure);

module.exports = router;
