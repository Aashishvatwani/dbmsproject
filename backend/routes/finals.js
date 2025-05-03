const express = require('express');
const router = express.Router();
const  final= require('../controllers/final');

router.get('/', final.getfinals);

module.exports = router;
