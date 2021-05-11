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

    var order_id = req._parsedOriginalUrl.query;
    var delid = req._parsedOriginalUrl.query;
    var check = (order_id.split('&')[0]).split('=')[0];

    if(check == 'emp_id'){
        order_id = (order_id.split('&')[1]).split('=')[1];
        delid = (delid.split('&')[0]).split('=')[1];
        var deli = new Allot_order();
       const update_deli = await deli.update_status(order_id, delid);

    res.redirect('/current_orders');
    }

    else{
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        var deli = new Allot_order();
        order_id = (order_id.split('&')[0]).split('=')[1];
        const del_details = await deli.get_dels();

    res.render('includes/dels.ejs', {
        pageTitle: 'Delivery Boys',
        path: '/delboys',
        orders: del_details.rows,
        isEmployee : isEmp,
        userImage : req.oidc.user.picture,
        email : req.oidc.user.email,
        displayName : details.first_name,
        order_id: order_id
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