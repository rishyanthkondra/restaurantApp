const path = require('path');
const express = require('express');

const paytm_callback = require('../controllers/paytm');

const router = express.Router();

router.post('/callback/:did',paytm_callback.paytmcallback);

module.exports = router;