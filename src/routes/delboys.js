const path = require('path');
const express = require('express');

const data_con = require('../controllers/delboys');

const router = express.Router();

router.get('/:order_id',data_con.get_order);
router.get('/:order_id/:delid',data_con.allotdel);
module.exports = router;
