const express = require('express');
const userDetailsController = require('../controllers/userDetails');
const router = express.Router();


router.get('/',userDetailsController.get_user_details);
router.post('/edit-details',userDetailsController.post_user_details);
router.post('/edit-address',userDetailsController.post_address_details);
router.post('/delete-address',userDetailsController.delete_address);
router.post('/add-address',userDetailsController.put_address);

module.exports = router;