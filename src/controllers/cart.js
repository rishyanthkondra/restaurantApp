const Cart = require('../models/cart');
const User = require("../models/user");
// const Prod = require('../models/prod');


exports.get_cart = async (req,res,next) => {

    const cartitem = new Cart();
    const email = req.oidc.user.email;
    const usr = new User(email);
    const details_id = await usr.getDetailsId().catch(err=>console.log(err));

    const cartitems = await cartitem.get_all(details_id);
    // console.log(cartitems.rows);
    // console.log(req.details_id)
    res.render('includes/cart.ejs', {
        pageTitle: 'Cart',
        path: '/cart',
        editing: false,
        items: cartitems.rows
    });
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