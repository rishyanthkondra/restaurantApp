const path = require('path');
const express = require('express');

const tran_con = require('../controllers/transactions');

const router = express.Router();


router.get('/',tran_con.get_trans);
router.get('/:start_date/:end_date',tran_con.get_trans);
router.post('/',tran_con.get_new_trans);

module.exports = router;
