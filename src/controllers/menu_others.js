const Menu = require('../models/menu');
const Item = require('../models/item');
const Ing = require('../models/ingredients');
const User = require("../models/user");

exports.get_menu = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        if(isEmp){
            const isChef = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));
            const dishlist = await Menu.get_dishes();
            if(isChef){
                res.redirect('/home');
            }
            else{
                res.render('includes/menu_others.ejs', {
                    pageTitle: 'Menu',
                    path: '/menu_others',
                    isEmployee : isEmp,
                    userImage : req.oidc.user.picture,
                    displayName : details.first_name,
                    dishes: dishlist.rows
                });
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