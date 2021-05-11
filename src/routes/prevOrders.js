const express = require('express');
const prevOrderController = require('../controllers/prevOrders');
const router = express.Router();


router.get('/',prevOrderController.get_previous_orders);

module.exports = router;