const express = require('express');
const bookingsController = require('../controllers/small_emp');

const router = express.Router();

router.get('/',bookingsController.get_all_bookings);


module.exports = router;
