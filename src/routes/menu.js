const path = require('path');
const express = require('express');

const menu_con = require('../controllers/menu');

const router = express.Router();

router.get('/',menu_con.get_menu);
router.get('/:dish_id',menu_con.get_dishcart);
router.get('/update_form',menu_con.get_dishcart);
router.post('/atc',menu_con.post_dishcart);
router.post('/delete',menu_con.post_delete);
router.post('/update',menu_con.post_update);
router.post('/updateit',menu_con.post_updateit);
router.post('/dish_add',menu_con.post_add);
router.post('/addit',menu_con.post_addit);

module.exports = router;