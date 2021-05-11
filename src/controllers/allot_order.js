const Allot_order = require('../models/allot_order');
const User = require("../models/user");

exports.select_order = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));

        if(isEmp){

    var orditem = new Allot_order();
    const ord_details = await orditem.get_orders();

    res.render('includes/allot.ejs', {
        pageTitle: 'Allot Orders',
        isEmployee : isEmp,
        image : req.oidc.user.picture,
        email : req.oidc.user.email,
        path: '/current_orders',
        orders: ord_details.rows
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

exports.get_porder = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));

        if(isEmp){

    var orditem = new Allot_order();
    const ord_details = await orditem.get_porders();

    res.render('includes/confirm.ejs', {
        pageTitle: 'Confirm Orders',
        path: '/pending_orders',
        orders: ord_details.rows,
        dishes: [],
        servings: []
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

exports.acc_ord = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));

        if(isEmp){

    var orditem = new Allot_order();
    const ord_details = await orditem.get_acc(req.params.order_id,'confirmed');

    res.redirect('/pending_orders');

}
else{
    res.redirect('/home');
}
}
else{
    res.redirect('/home');
}
};

exports.rej_ord = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsRequiredRole('Chef').catch(err=> console.log(err));

        if(isEmp){

    var orditem = new Allot_order();
    const ord_details = await orditem.get_acc(req.params.order_id,'rejected');

    res.redirect('/pending_orders');

}
else{
    res.redirect('/home');
}
}
else{
    res.redirect('/home');
}
};