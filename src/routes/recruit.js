const path = require('path');
const express = require('express');

const tran_con = require('../controllers/recruit');

const router = express.Router();


router.get('/',tran_con.get_form);
router.post('/',tran_con.post_form);

module.exports = router;
