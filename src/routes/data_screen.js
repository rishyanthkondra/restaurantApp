const path = require('path');
const express = require('express');

const data_con = require('../controllers/data_screen');

const router = express.Router();


router.get('/',data_con.get_stats);
router.post('/',data_con.get_new_stats);


module.exports = router;
