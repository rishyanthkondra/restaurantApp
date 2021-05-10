const express = require('express');
const {requiresAuth} = require('express-openid-connect')
const bookingsController = require('../controllers/bookings');

const router = express.Router();

router.param('details_id',bookingsController.param_details_id_handler);
router.param('date',bookingsController.param_date_handler);
router.param('start_time',bookingsController.param_start_time_handler);


router.get('/:details_id',bookingsController.get_bookings);
router.get('/:date/:start_time',bookingsController.get_bookings_with_time);
//router.post('/:details_id/book',bookingsController.book_tables);



module.exports = router;
