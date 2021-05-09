const path = require('path');
const express = require('express');

const data_con = require('../controllers/allot_order');

const router = express.Router();


router.get('/',data_con.select_order);
module.exports = router;
