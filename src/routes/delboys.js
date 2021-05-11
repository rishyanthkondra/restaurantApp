const path = require('path');
const express = require('express');

const data_con = require('../controllers/delboys');

const router = express.Router();

router.get('/',data_con.get_order);
module.exports = router;
