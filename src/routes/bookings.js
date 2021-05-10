const express = require('express');
const {requiresAuth} = require('express-openid-connect')
const bookingsController = require('../controllers/bookings');

const router = express.Router();

router.get('/',bookingsController.get_bookings);
//router.get('/:date/:start_time',bookingsController.get_bookings_with_time);
//router.post('/:details_id/book',bookingsController.book_tables);



module.exports = router;
