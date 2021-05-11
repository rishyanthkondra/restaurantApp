const Menu = require('../models/menu');
const Item = require('../models/item');
const Ing = require('../models/ingredients');
const User = require("../models/user");

exports.get_menu = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(isEmp){
            res.redirect('/home');
        }
        else{
            const dishlist = await Menu.get_dishes();
            res.render('includes/menu_customer.ejs', {
                pageTitle: 'Menu',
                path: '/menu_customer',
                dishes: dishlist.rows
            });
        }
    }
    else{
        res.redirect('/home');
    }
};


exports.get_dishcart = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(!isEmp){
            var dish_id = req.params.dish_id;
            var details_id = await user.getDetailsId();
            var currdish = await Menu.get_cartdish(dish_id,details_id); //// change this using user_id
            // console.log(currdish);
            if (currdish.rows.length == 0){
                currdish = await Menu.get_dish(dish_id);
            }
            // console.log(currdish);
            res.render('includes/dish.ejs', {
                pageTitle: 'Dish',
                path: '/menu_customer/'+dish_id,
                dishes: currdish.rows
            });
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_dishcart = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(!isEmp){
            const item_id = req.body.dish_id
            res.redirect('/menu_customer/'+item_id);
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_increment = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(!isEmp){
            var dish_id = req.body.dish_id;
            var details_id = await user.getDetailsId();
            var currdish = await Menu.get_cartdish(dish_id,details_id); //// change this using user_id
            // console.log(currdish);
            if (currdish.rows.length == 0){
                await Menu.add_to_cart(dish_id,details_id,1);//// change this using user_id
            }
            else{
                await Menu.cart_inc(dish_id,details_id); //// change this using user_id
            }
            res.redirect('/menu_customer/'+dish_id);
        }
        else{
            res.redirect('/home');
        }
    }
    else{
        res.redirect('/home');
    }
};

exports.post_decrement = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(!isEmp){
            var dish_id = req.body.dish_id;
            var details_id = await user.getDetailsId();
            var currdish = await Menu.get_cartdish(dish_id,details_id); //// change this using user_id
            // console.log(currdish);
            if (currdish.rows.length == 0){
                
            }
            else{
                var thedish = currdish.rows;
                if(thedish[0].quantity>1){
                    await Menu.cart_dec(dish_id,details_id); //// change this using user_id
                }
                else{
                    await Menu.delete_from_cart(dish_id,details_id);//// change this using user_id
                }
            }
            res.redirect('/menu_customer/'+dish_id);
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