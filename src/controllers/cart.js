const Cart = require('../models/cart');
const Prod = require('../models/prod');


exports.get_cart = async (req,res,next) => {

    const cartitem = new Cart();
    const credits = await cartitem.get_credits();
    const cartitems = await cartitem.get_all();

    res.render('includes/cart.ejs', {
        pageTitle: 'Cart',
        path: '/cart',
        editing: false,
        credits: credits.rows[0].credit,
        items: cartitems.rows
    });
};

exports.post_cart = async (req,res,next) => {
    const prodId = req.body.product_id;
    const proditem = new Prod();
    const cartitem = new Cart();
    const available = await proditem.check(prodId).catch(err => console.log(err));
    const present = await cartitem.check(prodId).catch(err => console.log(err));
    if(!available){
        res.redirect('/prods');
    }else if(present){
        await cartitem.update_cart(prodId,1).catch(err => console.log(err));
        await proditem.update_count(prodId).catch(err => console.log(err));
        res.redirect('/cart');
    }else{
        await cartitem.add_to_cart(prodId,1).catch(err => console.log(err));
        await proditem.update_count(prodId).catch(err => console.log(err));
        res.redirect('/cart');
    }
};