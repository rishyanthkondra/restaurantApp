const User = require("../models/user");
const UserDetails = require("../models/userDetails");

exports.param_details_id_handler = (req,res,next,details_id)=>{
    req.details_id = details_id;//can handle any other useful info here
    next();
};
exports.param_date_handler = (req,res,next,date)=>{
    req.date = date;//can handle any other useful info here
    next();
};
exports.param_start_time_handler = (req,res,next,start_time)=>{
    req.start_time = start_time;//can handle any other useful info here
    next();
};

exports.get_bookings = async (req,res,next)=>{
    res.render('bookings.ejs',{pageTitle: 'Bookings'});
}

exports.get_bookings_with_time= async (req,res,next)=>{
    res.render('bookings.ejs',{pageTitle: 'Bookings'});
}

exports.book_tables = async (req,res,next)=>{
    res.render('bookings.ejs',{pageTitle: 'Bookings'});
}