const User = require("../models/user");
const Bookings = require("../models/bookings");
const url = require('url');
const querystring = require('querystring');
const { stat } = require("fs");

exports.get_bookings = async (req,res,next)=>{
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsEmployee().catch(err=>console.log(err));
        const today = new Date();
        const tomorrow = new Date(today);
        const booking = new Bookings(req.oidc.user.email,null,null);
        tomorrow.setDate(tomorrow.getDate() + 1);
        var dd = String(tomorrow.getDate()).padStart(2, '0');
        var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = tomorrow.getFullYear();
        const tomorrowDate= yyyy + '-' + mm + '-' + dd;
        //console.log(`Authenticated in user home : ${req.details_id}`);
        const status = req.query.status;
        var alert = false;
        var msg = '';
        if(status){
            alert = true;
            if(status == 'booked'){
                msg = "Booked succesfully!";
            }
            if(status == 'tables'){
                msg = "fetched tables succesfully!";
            }
            if(status == 'notables'){
                msg = "No tables to display at selected time";
            }
            if(status == 'failed'){
                msg = "Booking failed";
            }
            if(status == 'cancel'){
                msg = 'Cancelled Succesfully';
            }
            if(status == 'nocancel'){
                msg = 'Couldnot cancel, illegal acesss';
            }
        }
        var dtVal = req.query.dateVal;
        if (!dtVal){
            dtVal = tomorrowDate;
        }
        var tmVal = req.query.timeVal;
        if (!tmVal){
            tmVal = "11:00";
        }
        // check for active bookings,send it if present
        const hasActive = await booking.hasActiveBooking().catch(err=>console.log(err));
        var activeBooking;
        if (hasActive){
            const actBookRes = await booking.getActiveBooking().catch(err=>console.log(err));
            activeBooking = actBookRes.rows[0];
            const tbls = await booking.getTables(activeBooking.booking_id)
                                         .catch(err=>console.log(err));
            console.log(tbls);
            activeBooking.tables = tbls;
        }else{
            activeBooking = null;
        }
        var freeTables = req.query.tables;
        var hasFreeTables = true;
        if(!freeTables){
            hasFreeTables = false;
        }else{
            freeTables = JSON.parse(freeTables);
        }
        result ={
            pageTitle:'Bookings',
            isEmployee : isEmp,
            userImage : req.oidc.user.picture,
            displayName : details.first_name,
            dateVal : dtVal,
            timeVal : tmVal,
            minDate : tomorrowDate,
            minTime : "11:00",
            maxTime : "21:00",
            hasAct : hasActive,
            actBook : activeBooking,
            hasFree : hasFreeTables,
            tables : freeTables,
            pop : alert,
            message : msg
        };
        console.log(result);
        res.render('bookings.ejs',result);
    }else{
        res.redirect('/home');
    }
}

exports.book_tables= async (req,res,next)=>{
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        //console.log(`Authenticated in user home : ${req.details_id}`);
        // if query has book=True, then do bookinh
        //res.redirect('/booking');
        const book = req.query.book;
        const cancel = req.query.cancel;
        if(book){
            //do booking first
            //then redirect
        }else if(cancel){
            const booker = new Bookings(req.oidc.user.email,null,null);
            const hasActive = await booker.hasActiveBooking().catch(err=>console.log(err));
            if (hasActive){
                const actBookRes = await booker.getActiveBooking().catch(err=>console.log(err));
                bid = actBookRes.rows[0].booking_id;
                Bookings.cancelBooking(bid).then(()=>{
                    console.log(`deleted active booking ${bid}`);
                    res.redirect("/bookings?status='cancel'");
                }).catch(err=>{
                    console.log(err);
                    res.redirect("/bookings?status='nocancel'");
                });
            }else{
                res.redirect("/bookings?status='nocancel'");
            }
        }else{
            const start_date = req.body.date;
            const start_time = req.booking_id.time;
            const booker = new Bookings(req.oidc.user.email,start_date,start_time);
        }
        // else get start date, time and 
        // return free tables
        //console.log(req);
        //post with book=true
        //post without booking (request for tables)
    }else{
        res.redirect('/home');
    }
}
