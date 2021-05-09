const Allot_order = require('../models/allot_order');

exports.allotdel = async (req,res,next) => {

    var deli = new Allot_order();
    const update_deli = await deli.update_status(req.params.order_id, req.params.delid);

    res.redirect('/current_orders');
};

exports.get_order = async (req,res,next) => {

    var deli = new Allot_order();
    const del_details = await deli.get_dels();

    res.render('includes/dels.ejs', {
        pageTitle: 'Delivery Boys',
        path: '/delboys',
        orders: del_details.rows,
        order_id: req.params.order_id
    });
};