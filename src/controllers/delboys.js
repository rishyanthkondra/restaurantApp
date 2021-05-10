const Allot_order = require('../models/allot_order');
const User = require("../models/user");

exports.allotdel = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));

        if(isEmp){

    var deli = new Allot_order();
    const update_deli = await deli.update_status(req.params.order_id, req.params.delid);

    res.redirect('/current_orders');
        }

    else{
        res.redirect('/home');
    }
}
    else{
        res.redirect('/home');
    }
};

exports.get_order = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));

        if(isEmp){

    var deli = new Allot_order();
    const del_details = await deli.get_dels();

    res.render('includes/dels.ejs', {
        pageTitle: 'Delivery Boys',
        path: '/delboys',
        orders: del_details.rows,
        order_id: req.params.order_id
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