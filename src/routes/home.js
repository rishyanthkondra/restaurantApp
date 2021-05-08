const express = require('express');
const homeController = require('../controllers/home');

const router = express.Router();


//router.get('/',rebookingsController.get_test);
//router.post('/',bookingsController.post_test);
router.get('/',homeController.get_home);

router.post('/',homeController.get_home);



module.exports = router;
