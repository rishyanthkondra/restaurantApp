const path = require('path');
const express = require('express');

const pur_con = require('../controllers/purchases');

const router = express.Router();


router.get('/',pur_con.get_purs);
router.post('/',pur_con.get_new_purs);

module.exports = router;
