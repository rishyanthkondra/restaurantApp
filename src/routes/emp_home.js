const path = require('path');
const express = require('express');

const data_con = require('../controllers/emp_home');

const router = express.Router();


router.get('/',data_con.route_emp);
module.exports = router;
