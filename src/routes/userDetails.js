const express = require('express');
const userDetailsController = require('../controllers/userDetails');
const router = express.Router();


router.param('details_id',userDetailsController.param_details_id_handler);
router.param('address_id',userDetailsController.param_address_id_handler);
router.get('/:details_id',userDetailsController.get_user_details);
router.post('/:details_id/edit-details',userDetailsController.post_user_details);
router.post('/:details_id/edit-address/:address_id',userDetailsController.post_address_details);
router.post('/:details_id/delete-address/:address_id',userDetailsController.delete_address);
router.post('/:details_id/add-address',userDetailsController.put_address);

module.exports = router;