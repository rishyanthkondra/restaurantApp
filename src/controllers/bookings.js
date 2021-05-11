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
        const booking = new Bookings(req.oidc.user.email,null,null,null);
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
                alert = false;
                msg = "fetched tables succesfully!";
            }
            if(status == 'notables'){
                msg = "No tables to display at selected time";
            }
            if(status == 'notselected'){
                msg = "select atleast one";
            }
            if(status == 'failed'){
                msg = "Booking failed,check input or someone has booked in mean time";
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
            //console.log(tbls);
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
        //console.log(result);
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
            const start_date = req.body.date;
            const start_time = req.body.time;
            var table_arr = [];
            counter = 0;
            const table1 = req.body.table1;
            const table2 = req.body.table2;
            const table3 = req.body.table3;
            const table4 = req.body.table4;
            const table5 = req.body.table5;
            const table6 = req.body.table6;
            const table7 = req.body.table7;
            const table8 = req.body.table8;
            const table9 = req.body.table9;
            const table10 = req.body.table10;
            const table11 = req.body.table11;
            const table12 = req.body.table12;
            const table13 = req.body.table13;
            const table14 = req.body.table14;
            const table15 = req.body.table15;
            const table16 = req.body.table16;
            const table17 = req.body.table17;
            const table18 = req.body.table18;
            const table19 = req.body.table19;
            const table20 = req.body.table20;
            if(table1){
                table_arr[counter] = 1;
                counter++;
            }
            if(table2){
                table_arr[counter] = 2;
                counter++;
            }
            if(table3){
                table_arr[counter] = 3;
                counter++;
            }
            if(table4){
                table_arr[counter] = 4;
                counter++;
            }
            if(table5){
                table_arr[counter] = 5;
                counter++;
            }
            if(table6){
                table_arr[counter] = 6;
                counter++;
            }
            if(table7){
                table_arr[counter] = 7;
                counter++;
            }
            if(table8){
                table_arr[counter] = 8;
                counter++;
            }
            if(table9){
                table_arr[counter] = 9;
                counter++;
            }
            if(table10){
                table_arr[counter] = 10;
                counter++;
            }
            if(table11){
                table_arr[counter] = 11;
                counter++;
            }
            if(table12){
                table_arr[counter] = 12;
                counter++;
            }
            if(table13){
                table_arr[counter] = 13;
                counter++;
            }
            if(table14){
                table_arr[counter] = 14;
                counter++;
            }
            if(table15){
                table_arr[counter] = 15;
                counter++;
            }
            if(table16){
                table_arr[counter] = 16;
                counter++;
            }
            if(table17){
                table_arr[counter] = 17;
                counter++;
            }
            if(table18){
                table_arr[counter] = 18;
                counter++;
            }
            if(table19){
                table_arr[counter] = 19;
                counter++;
            }
            if(table20){
                table_arr[counter] = 20;
                counter++;
            }
            if(table_arr.length == 0){
                res.redirect("/bookings?status=notselected");
            }else{
                //console.log(table_arr);
                const booker = new Bookings(req.oidc.user.email,start_date,start_time,table_arr);
                booker.bookTables().then(()=>{
                    console.log('booked succesfully');
                    res.redirect('/bookings?status=booked');
                }).catch(err=>{
                    console.log(err);
                    res.redirect('/bookings?status=failed');
                });
            }
            //then redirect
        }else if(cancel){
            const booker = new Bookings(req.oidc.user.email,null,null,null);
            const hasActive = await booker.hasActiveBooking().catch(err=>console.log(err));
            if (hasActive){
                const actBookRes = await booker.getActiveBooking().catch(err=>console.log(err));
                bid = actBookRes.rows[0].booking_id;
                Bookings.cancelBooking(bid).then(()=>{
                    console.log(`deleted active booking ${bid}`);
                    res.redirect("/bookings?status=cancel");
                }).catch(err=>{
                    console.log(err);
                    res.redirect("/bookings?status=nocancel");
                });
            }else{
                res.redirect("/bookings?status=nocancel");
            }
        }else{
            const start_date = req.body.date;
            const start_time = req.body.time;
            const booker = new Bookings(req.oidc.user.email,start_date,start_time,null);
            const freeTabs = await booker.getFreeTables().catch(err=>console.log(err));
            if (freeTabs.rowCount > 0){
                var tblstr = "[";
                for (var i=0;i<freeTabs.rowCount;i++){
                    if(i!=0){
                        tblstr+=",";
                    }
                    tblstr += freeTabs.rows[i].table_id;
                }
                tblstr+="]";
                res.redirect(`/bookings?dateVal=${start_date}&timeVal=${start_time}&tables=${tblstr}&status=tables`);
            }else{
                res.redirect(`/bookings?dateVal=${start_date}&timeVal=${start_time}&status=notables`);
            }
        }
        // else get start date, time and 
        // return free tables
        //console.log(req);
    }else{
        res.redirect('/home');
    }
}
