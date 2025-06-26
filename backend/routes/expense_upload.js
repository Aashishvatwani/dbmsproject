const express = require('express');
const router = express.Router();
const  expense= require('../controllers/expense_upload.js');

router.post('/', expense.expenseUser);

module.exports = router;