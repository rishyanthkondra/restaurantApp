const express = require('express');
const userHomeController = require('../controllers/userHome');
const router = express.Router();


router.param('details_id',userHomeController.param_details_id_handler);
router.get('/:details_id',userHomeController.get_user_home);

module.exports = router;