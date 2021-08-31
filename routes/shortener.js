const express = require('express');
const shortenerController = require('../controllers/shortener');

const router = express.Router();

router.post('/shorten', shortenerController.postShortURL);
router.post('/expire', shortenerController.getExpiration);


module.exports = router;