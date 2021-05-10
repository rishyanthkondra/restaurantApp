const e = require('express');
const Cart = require('../models/cart');
const User = require("../models/user");
// const Prod = require('../models/prod');


exports.get_cart = async (req,res,next) => {

    if(req.oidc.isAuthenticated()){
        const cartitem = new Cart();
        const email = req.oidc.user.email;
        const usr = new User(email);
        const details_id = await usr.getDetailsId().catch(err=>console.log(err));

        const cartitems = await cartitem.get_all(details_id);
        const addritems = await usr.getAddressesUsingDetailsId(details_id);
        // console.log(cartitems.rows);
        // console.log(req.details_id);
        // console.log(addritems);
        res.render('includes/cart.ejs', {
            pageTitle: 'Cart',
            path: '/cart',
            editing: false,
            items: cartitems.rows,
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

// exports.post_cart = async (req,res,next) => {
//     const prodId = req.body.product_id;
//     const proditem = new Prod();
//     const cartitem = new Cart();
//     const available = await proditem.check(prodId).catch(err => console.log(err));
//     const present = await cartitem.check(prodId).catch(err => console.log(err));
//     if(!available){
//         res.redirect('/prods');
//     }else if(present){
//         await cartitem.update_cart(prodId,1).catch(err => console.log(err));
//         await proditem.update_count(prodId).catch(err => console.log(err));
//         res.redirect('/cart');
//     }else{
//         await cartitem.add_to_cart(prodId,1).catch(err => console.log(err));
//         await proditem.update_count(prodId).catch(err => console.log(err));
//         res.redirect('/cart');
//     }
// };