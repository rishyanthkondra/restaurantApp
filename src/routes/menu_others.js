const path = require('path');
const express = require('express');

const menu_con = require('../controllers/menu_others');

const router = express.Router();

router.get('/',menu_con.get_menu);

module.exports = router;