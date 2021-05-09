const Allot_order = require('../models/allot_order');

exports.select_order = async (req,res,next) => {

    var orditem = new Allot_order();
    const ord_details = await orditem.get_orders();

    res.render('includes/allot.ejs', {
        pageTitle: 'Allot Orders',
        path: '/current_orders',
        orders: ord_details.rows
    });
};

exports.get_porder = async (req,res,next) => {

    var orditem = new Allot_order();
    const ord_details = await orditem.get_porders();

    res.render('includes/confirm.ejs', {
        pageTitle: 'Confirm Orders',
        path: '/pending_orders',
        orders: ord_details.rows,
        dishes: [],
        servings: []
    });
};

exports.acc_ord = async (req,res,next) => {

    var orditem = new Allot_order();
    const ord_details = await orditem.get_acc(req.params.order_id,'confirmed');

    res.redirect('/pending_orders');
};

exports.rej_ord = async (req,res,next) => {

    var orditem = new Allot_order();
    const ord_details = await orditem.get_acc(req.params.order_id,'rejected');

    res.redirect('/pending_orders');
};