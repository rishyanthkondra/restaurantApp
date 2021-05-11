const path = require('path');
const express = require('express');

const data_con = require('../controllers/allot_order');

const router = express.Router();

router.get('/',data_con.get_porder);
router.get('/confirmed',data_con.acc_ord);
router.get('/rejected',data_con.rej_ord);

module.exports = router;
