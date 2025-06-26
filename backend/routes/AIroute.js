const express = require('express');
const router = express.Router();
const  Aichat= require('../controllers/AIchat');

router.post('/', Aichat.getcitydoubt);

module.exports = router;