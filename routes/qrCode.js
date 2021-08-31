const express = require('express');
const qrCodeController = require('../controllers/qrCode');

const router = express.Router();

router.post('/', qrCodeController.postGenerateQR);

module.exports = router;