const express = require('express');
const router = express.Router();

const rates = require('./rates');
const pairs = require('./pairs');

router.use('/rates', rates);
router.use('/pairs', pairs);

module.exports = router;
