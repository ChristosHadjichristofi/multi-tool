const express = require('express');
const rootController = require('../controllers/root');

const router = express.Router();

router.get('/', rootController.getLanding);
router.get('/:code', rootController.getLongURL);

module.exports = router;