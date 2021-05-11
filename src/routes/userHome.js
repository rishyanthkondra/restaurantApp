const express = require('express');
const userHomeController = require('../controllers/userHome');
const router = express.Router();


router.get('/',userHomeController.get_user_home);

module.exports = router;