const path = require('path');
const express = require('express');

const menu_con = require('../controllers/menu_chef');

const router = express.Router();

router.get('/',menu_con.get_menu);
// router.get('/:dish_id',menu_con.get_dishcart);
// router.get('/update_form',menu_con.get_dishcart);
// router.post('/atc',menu_con.post_dishcart);
router.post('/delete',menu_con.post_delete);
router.post('/update',menu_con.post_update);
router.post('/updateit',menu_con.post_updateit);
router.post('/dish_add',menu_con.post_add);
router.post('/addit',menu_con.post_addit);
router.post('/addit2',menu_con.post_addit2);
router.post('/ing_add',menu_con.post_ingadd);
router.post('/ing_addit',menu_con.post_ingadd1);
router.post('/recipe',menu_con.post_recipe);
router.post('/recipeout',menu_con.post_recipeout);
// router.post('/increment',menu_con.post_increment);
// router.post('/decrement',menu_con.post_decrement);

module.exports = router;