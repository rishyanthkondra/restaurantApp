const e = require('express');
const Cart = require('../models/cart');
const User = require("../models/user");
const Menu = require('../models/menu');
// const Prod = require('../models/prod');


exports.get_cart = async (req,res,next) => {

    if(req.oidc.isAuthenticated()){
        const cartitem = new Cart();
        const email = req.oidc.user.email;
        const usr = new User(email);
        const details_id = await usr.getDetailsId().catch(err=>console.log(err));
        const detailRows = await usr.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await usr.checkIsEmployee().catch(err=>console.log(err));


        const cartitems = await cartitem.get_all(details_id);
        const addritems = await usr.getAddressesUsingDetailsId(details_id);
        // console.log(cartitems.rows);
        // console.log(req.details_id);
        if(addritems.rowCount == 0){
            res.redirect('/userDetails?status=noaddress');
        }
        // console.log(addritems);
        res.render('includes/cart.ejs', {
            pageTitle: 'Cart',
            path: '/cart',
            editing: false,
            userImage: req.oidc.user.picture,
            isEmployee : isEmp,
            userImage : req.oidc.user.picture,
            displayName : details.first_name,items: cartitems.rows,
            addrs: addritems.rows
        });
    }
    else{
        //unauthenticated  home page
        res.send(JSON.stringify({
            pageTitle:'Home',
            alertMessage:false,
            debugString : 'In get_home,unauthenticated'
        }));
    }
};

exports.delete_dish = async (req,res,next) => {
    if(req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        var dish_id = req.body.dish_id;
        var details_id = await user.getDetailsId();
        // console.log(currdish);
        await Menu.delete_from_cart(dish_id,details_id).catch(err=>console.log(err));
        res.redirect('/cart');
    }
    else{
        //unauthenticated  home page
        res.send(JSON.stringify({
            pageTitle:'Home',
            alertMessage:false,
            debugString : 'In get_home,unauthenticated'
        }));
    }
};