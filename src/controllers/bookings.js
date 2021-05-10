const User = require("../models/user");
const UserDetails = require("../models/userDetails");


exports.get_bookings = async (req,res,next)=>{
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsEmployee().catch(err=>console.log(err));
        //console.log(`Authenticated in user home : ${req.details_id}`);
        res.render('bookings.ejs',{
            pageTitle:'Bookings',
            isEmployee : isEmp,
            userImage : req.oidc.user.picture,
            displayName : details.first_name
        });
    }else{
        res.redirect('/home');
    }
}

exports.get_bookings_with_time= async (req,res,next)=>{
    res.render('bookings.ejs',{pageTitle: 'Bookings'});
}

exports.book_tables = async (req,res,next)=>{
    res.render('bookings.ejs',{pageTitle: 'Bookings'});
}