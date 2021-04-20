const path = require('path');
const express = require('express');

const orderCon = require('../controllers/orders');

const router = express.Router();

router.get('/',orderCon.get_orders);
router.post('/',orderCon.order);



module.exports = router;
