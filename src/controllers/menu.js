const Menu = require('../models/menu');
const Item = require('../models/item');
const Ing = require('../models/ingredients');
exports.get_menu = async (req,res,next) => {

    const dishlist = await Menu.get_dishes();
    res.render('includes/menu.ejs', {
        pageTitle: 'Menu',
        path: '/menu',
        dishes: dishlist.rows
    });
};


exports.get_dishcart = async (req,res,next) => {
    var dish_id = req.params.dish_id;
    var currdish = await Menu.get_cartdish(dish_id,1); //// change this using user_id
    // console.log(currdish);
    if (currdish.rows.length == 0){
        currdish = await Menu.get_dish(dish_id);
    }
    // console.log(currdish);
    res.render('includes/dish.ejs', {
        pageTitle: 'Dish',
        path: '/menu/'+dish_id,
        dishes: currdish.rows
    });
};

exports.post_dishcart = async (req,res,next) => {
    const item_id = req.body.dish_id
    res.redirect('/menu/'+item_id);
};

exports.post_increment = async (req,res,next) => {
    var dish_id = req.body.dish_id;
    var currdish = await Menu.get_cartdish(dish_id,1); //// change this using user_id
    // console.log(currdish);
    if (currdish.rows.length == 0){
        await Menu.add_to_cart(dish_id,1,1);//// change this using user_id
    }
    else{
        await Menu.cart_inc(dish_id,1); //// change this using user_id
    }
    res.redirect('/menu/'+dish_id);
};

exports.post_decrement = async (req,res,next) => {
    var dish_id = req.body.dish_id;
    var currdish = await Menu.get_cartdish(dish_id,1); //// change this using user_id
    // console.log(currdish);
    if (currdish.rows.length == 0){
        
    }
    else{
        var thedish = currdish.rows;
        if(thedish[0].quantity>1){
            await Menu.cart_dec(dish_id,1); //// change this using user_id
        }
        else{
            await Menu.delete_from_cart(dish_id,1);//// change this using user_id
        }
    }
    res.redirect('/menu/'+dish_id);
};

exports.post_update = async (req,res,next) => {
    
    const dish_id = req.body.dish_id
    // console.log(dish_id)
    // res.redirect('/menu/'+dish_id);
    res.render('includes/dish_uform.ejs', {
        pageTitle: 'DishUpdate',
        path: '/menu/update_form',
        myid : dish_id
    });
};

exports.post_updateit = async (req,res,next) => {
    var price = req.body.price;
    const id = req.body.dish_id;
    const dish = new Menu(id);
    dish
        .updatedish(price)
        .then(() => {
            res.redirect('/menu');
        })
        .catch(err => console.log(err));
};

exports.post_delete = async (req,res,next) => {
    const dish_id = req.body.dish_id;
    const dish = new Menu(dish_id);
    dish
        .deletedish()
        .then(() => {
            res.redirect('/menu');
        })
        .catch(err => console.log(err));
};

exports.post_add = async(req,res,next) => {
    res.render('includes/dish_aform1.ejs', {
        pageTitle: 'dishAddForm1',
        path: '/menu'
    })
};

exports.post_addit = async(req,res,next) => {
    const dish_name = req.body.dish_name;
    const image_url = req.body.image_url;
    const cost_per_unit = req.body.cost_per_unit;
    const dish_description = req.body.dish_description;
    const nutritional_info = req.body.nutritional_info;
    const health_info = req.body.health_info;
    const cusine = req.body.cusine;
    const dish_type = req.body.dish_type;
    const sub_type = req.body.sub_type;

    const dish = new Item(dish_name,cost_per_unit,image_url,dish_description,nutritional_info,health_info,cusine,dish_type,sub_type);
    const insertion = await dish.add_dish();
    const myres = await Menu.getlatest();
    const tempid = myres.rows[0].dish_id;
    // console.log(tempid);
    const inglist = await Ing.get_all();
    // console.log(inglist);
    res.render('includes/dish_aform2.ejs', {
        pageTitle: 'dishAddForm2',
        path: '/menu',
        dish_id : tempid,
        ilist : inglist.rows
    })
};

exports.post_addit2 = async(req,res,next) => {
    const quantity = req.body.ilist.i;
    const inglist = await Ing.get_all();
    const ingrows = inglist.rows;
    const dish_id = req.body.dish_id;
    for(var i=0;i<ingrows.length;i++){
        await Ing.add_dish_has_ing(dish_id,ingrows[i].ingredient_id,quantity[i]);
        // console.log(ingrows[i].ingredient_id);
        // console.log(dish_id);
        // console.log(quantity[i]);
    }
    res.redirect('/menu');
};

exports.post_ingadd = async(req,res,next) => {
    res.render('includes/ing_aform.ejs', {
        pageTitle: 'ingAddForm',
        path: '/menu'
    })
};

exports.post_ingadd1 = async(req,res,next) => {
    const ingredient_name = req.body.ingredient_name;
    const image_url = req.body.image_url;
    const cost_per_unit = req.body.cost_per_unit;
    const ingredient_description = req.body.ingredient_description;
    const unit = req.body.unit;
    // console.log(req.body)
    const insertion = await Ing.add_ing(ingredient_name,ingredient_description,image_url,cost_per_unit,unit);
    const ingid = await Ing.getlatest();
    const tempid = ingid.rows[0].ingredient_id;
    // console.log(tempid);
    const dish_ids = await Menu.get_all_dishes();
    const dish_id = dish_ids.rows;
    // console.log(dish_id);
    for(var i=0;i<dish_id.length;i++){
        await Ing.add_dish_has_ing(dish_id[i].dish_id,tempid,0);
    }
    res.redirect('/menu');
};

exports.post_recipe = async(req,res,next) =>{
    const dish_id = req.body.dish_id;
    const inglist = await Ing.get_dish_has_ing(dish_id);
    // console.log(inglist);
    res.render('includes/recipe_form.ejs', {
        pageTitle: 'Recipe',
        path: '/menu',
        dish_id : dish_id,
        ilist : inglist.rows
    })
};

exports.post_recipeout = async(req,res,next) =>{
    const quantity =req.body.ilist.i;
    const dish_id = req.body.dish_id;
    const inglist = await Ing.get_dish_has_ing1(dish_id);
    const ilist = inglist.rows;
    console.log(ilist);
    console.log(quantity);
    for(var i = 0;i<ilist.length;i++){
        if(ilist[i].quantity == -1){
            await Ing.add_dish_has_ing(dish_id,ilist[i].ingredient_id,quantity[i]);
        }
        else{
            if(ilist[i].quantity != quantity[i]){
                console.log(ilist[i]);
                console.log(quantity[i]);
                await Ing.update_dish_has_ing(dish_id,ilist[i].ingredient_id,quantity[i]);
            }
        }
    }
    res.redirect('/menu');
};

// done:  menu screen + dish add form1 + dish add form2 + dish update + add ingredient + recipe + dish ingredient update + dish ingredient add +  dish to cart