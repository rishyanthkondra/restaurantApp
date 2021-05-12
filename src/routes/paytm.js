const path = require('path');
const express = require('express');

const paytm = require('../controllers/paytm');

const router = express.Router();

router.post('/callback/:did/:trans_id',paytm.paytmcallback);
router.post('/paynow',paytm.paytmpaynow);

module.exports = router;