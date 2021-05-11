const Menu = require('../models/menu');
const Item = require('../models/item');
const Ing = require('../models/ingredients');
const User = require("../models/user");

exports.get_menu = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            const dishlist = await Menu.get_dishes();
            if(isChef){
                res.render('includes/menu_chef.ejs', {
                    pageTitle: 'Menu',
                    path: '/menu_chef',
                    isEmployee : isEmp,
                    userImage : req.oidc.user.picture,
                    displayName : details.first_name,
                    dishes: dishlist.rows
                });
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_update = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            if(isChef){
                const dish_id = req.body.dish_id
                // console.log(dish_id)
                // res.redirect('/menu/'+dish_id);
                res.render('includes/dish_uform.ejs', {
                    pageTitle: 'DishUpdate',
                    path: '/menu_chef',
                    isEmployee : isEmp,
                    userImage : req.oidc.user.picture,
                    displayName : details.first_name,
                    myid : dish_id
                });
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_updateit = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            if(isChef){
                var price = req.body.price;
                const id = req.body.dish_id;
                const dish = new Menu(id);
                dish
                    .updatedish(price)
                    .then(() => {
                        res.redirect('/menu_chef');
                    })
                    .catch(err => console.log(err));
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_delete = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            if(isChef){
                const dish_id = req.body.dish_id;
                const dish = new Menu(dish_id);
                dish
                    .deletedish()
                    .then(() => {
                        res.redirect('/menu_chef');
                    })
                    .catch(err => console.log(err));
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_add = async(req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            if(isChef){
                res.render('includes/dish_aform1.ejs', {
                    pageTitle: 'dishAddForm1',
                    path: '/menu_chef',
                    isEmployee : isEmp,
                    userImage : req.oidc.user.picture,
                    displayName : details.first_name,
                })
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_addit = async(req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            if(isChef){
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
                    path: '/menu_chef',
                    dish_id : tempid,
                    isEmployee : isEmp,
                    userImage : req.oidc.user.picture,
                    displayName : details.first_name,
                    ilist : inglist.rows
                })
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_addit2 = async(req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            if(isChef){
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
                res.redirect('/menu_chef');
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_ingadd = async(req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            if(isChef){
                res.render('includes/ing_aform.ejs', {
                    pageTitle: 'ingAddForm',
                    path: '/menu_chef',
                    isEmployee : isEmp,
                    userImage : req.oidc.user.picture,
                    displayName : details.first_name,
                })
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_ingadd1 = async(req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            if(isChef){
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
                res.redirect('/menu_chef');
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_recipe = async(req,res,next) =>{
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            if(isChef){
                const dish_id = req.body.dish_id;
                const inglist = await Ing.get_dish_has_ing(dish_id);
                // console.log(inglist);
                res.render('includes/recipe_form.ejs', {
                    pageTitle: 'Recipe',
                    path: '/menu_chef',
                    dish_id : dish_id,
                    isEmployee : isEmp,
                    userImage : req.oidc.user.picture,
                    displayName : details.first_name,
                    ilist : inglist.rows
                })
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_recipeout = async(req,res,next) =>{
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            if(isChef){
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
                res.redirect('/menu_chef');
            }
            else{
                res.redirect('/home');
            }
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

// done:  menu screen + dish add form1 + dish add form2 + dish update + add ingredient + recipe + dish ingredient update + dish ingredient add +  dish to cart

// insert into employee(employee_id,joined_on,work_status,work_type,current_wage,role_id) values (4,'2009-12-07 06:42:00+05:30','active','permanent',1000,2)