const User = require("../models/user");
const url = require('url');
const querystring = require('querystring');

exports.post_review = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsEmployee().catch(err=>console.log(err));
        //console.log(`Authenticated in user home : ${req.details_id}`);
        
        // get order_id details
        // get order_id dishes and their details
        // rated = true then update dishes things
        const editedOrder = req.query.editedOrder;
        const editedDish = req.query.editedDish;
        const order_id = req.body.order_id;
        //var alert = false;
        //var msg = '';
        if(editedOrder){
            const rate = req.body.rating;
            const rev = req.body.review;
            if(rate!=null){
                const y = await user.updateOrderReview(order_id,rate,rev);
            }
            const order = await user.getOrderDetails(order_id).catch(err=>console.log(err));
            const dishes = await user.getDishesAndRatings(order_id).catch(err=>console.log(err));
            res.render('reviewOrder.ejs',{
                pageTitle:'Rating Orders',
                isEmployee : isEmp,
                userImage : req.oidc.user.picture,
                displayName  : details.first_name,
                order : order.rows[0],
                dishes: dishes
            });
        }else if(editedDish){
            const dish_id = req.body.dish_id;
            const rate = req.body.rating;
            const rev = req.body.review;
            user.insertDishRating(dish_id,rate,rev).then(()=>{
                const order = user.getOrderDetails(order_id).catch(err=>console.log(err));
                const dishes = user.getDishesAndRatings(order_id).catch(err=>console.log(err));
                res.render('reviewOrder.ejs',{
                    pageTitle:'Rating Orders',
                    isEmployee : isEmp,
                    userImage : req.oidc.user.picture,
                    displayName  : details.first_name,
                    order : order,
                    dishes: dishes
                });
            }).catch(err=>{
                console.log(err);
                res.redirect('/prevOrders?status=invalid');
            });
        }else{
            res.redirect('/prevOrders?status=invalid');
        }
        /*const result = {
            pageTitle:'Rating Orders',
            isEmployee : isEmp,
            userImage : req.oidc.user.picture,
            displayName : details.first_name,
            pop : alert,
            message: msg
        };
        // console.log(result);
        res.render('reviewOrder.ejs',result);*/
    }else{
        res.redirect('/home');
    }
};

