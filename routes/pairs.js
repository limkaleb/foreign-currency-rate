const express = require('express');
const router = express.Router();
const pairController = require('../controllers/pairController');

router.post('/', pairController.inputPair);

router.get('/', pairController.getPairs);

router.delete('/:pairId', pairController.deletePair);

router.delete('/', pairController.deletePairs);

module.exports = router;