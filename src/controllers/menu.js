const Menu = require('../models/menu');
const Item = require('../models/item');
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
    console.log(currdish);
    if (currdish.rows.length == 0){
        currdish = await Menu.get_dish(dish_id);
    }
    console.log(currdish);
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
    console.log(tempid);
    res.render('includes/dish_uform.ejs', {
        pageTitle: 'dishAddForm2',
        path: '/menu',
        myid : tempid
    })
};

// to do: menu screen + dish add form1 + dish add form2 + recipe + dish update + dish to cart + dish ingredient update + ingredient add