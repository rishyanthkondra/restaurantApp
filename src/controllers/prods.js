const Prod = require('../models/prod');


exports.get_prods = async (req,res,next) => {
    const prods = await Prod.get_all();

    res.render('includes/prods.ejs', {
        pageTitle: 'All Products',
        path: '/prods',
        editing: false,
        items: prods.rows
    });
};