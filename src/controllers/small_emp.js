const User = require("../models/user");
const Bookings = require("../models/bookings");
const url = require('url');
const querystring = require('querystring');
const { stat } = require("fs");

exports.get_all_bookings = async (req,res,next)=>{
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsRequiredRole('Receptionist').catch(err=>console.log(err));
        // check for active bookings,send it if present
        const x = new Bookings(null,null,null,null);
        const bookings = await x.getallActiveBooking().catch(err=>console.log(err));
        const hasActive = (bookings.rows.length > 0);
        var tables = [];

        for(var i=0;i<bookings.rows.length;i++){
            var booked = await x.getTables(bookings.rows[i].booking_id);
            tables.push(booked.rows);
        }

        result ={
            pageTitle:'Bookings',
            isEmployee : isEmp,
            userImage : req.oidc.user.picture,
            displayName : details.first_name,
            hasAct : hasActive,
            todayBooked: bookings.rows,
            Bookedtables: tables
        };
        //console.log(result);
        res.render('includes/all_book.ejs',result);
    }else{
        res.redirect('/home');
    }
}

exports.get_all_orders= async (req,res,next)=>{

    if (req.oidc.isAuthenticated()){

        var order_id = req._parsedOriginalUrl.query;

        const user = new User(req.oidc.user.email);
        
        if(order_id){
        
        order_id = parseInt(order_id.split("=")[1]);
        const x = user.update_order_status('delivered');
        res.redirect('/del_orders');
        
    }

    else{
       
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsRequiredRole('Delivery').catch(err=>console.log(err));

        if(isEmp){

            const orders = await user.getDeliveries(details.details_id);
            result ={
                pageTitle:'Orders',
                isEmployee : isEmp,
                userImage : req.oidc.user.picture,
                displayName : details.first_name,
                orders: orders.rows
            };
            //console.log(result);
            res.render('includes/del_orders.ejs',result);
        }
    }
        
    }else{
        res.redirect('/home');
    }
}
