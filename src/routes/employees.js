const path = require('path');
const express = require('express');

const data_con = require('../controllers/employees');

const router = express.Router();


router.get('/',data_con.get_emp);
router.get('/:empid',data_con.get_emp);
router.post('/:empid/:did',data_con.post_emp);
module.exports = router;
