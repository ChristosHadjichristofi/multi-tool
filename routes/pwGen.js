const express = require('express');
const pwGenController = require('../controllers/pwGen');

const router = express.Router();

router.post('/', pwGenController.postGeneratePassword);

module.exports = router;