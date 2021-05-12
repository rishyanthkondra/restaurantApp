const express = require('express');
const reviewOrderController = require('../controllers/reviewOrder');
const router = express.Router();


router.post('/',reviewOrderController.post_review);

module.exports = router;