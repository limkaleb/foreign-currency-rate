const express = require('express');
const router = express.Router();
const rateController = require('../controllers/rateController');

router.post('/', rateController.inputData);

router.get('/', rateController.getData);

router.get('/average', rateController.getAverage);

// update by providing rate id
router.put('/update/:rateId', rateController.changeRate);

// delete all (for developer)
router.delete('/', rateController.deleteAll);

module.exports = router;
