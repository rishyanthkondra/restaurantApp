const express = require('express');
const {requiresAuth} = require('express-openid-connect')
const bookingsController = require('../controllers/bookings');

const router = express.Router();


router.get('/',bookingsController.get_test);
router.post('/',bookingsController.post_test);



module.exports = router;
