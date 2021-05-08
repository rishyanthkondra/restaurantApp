const User = require("../models/user");

exports.param_details_id_handler = (req,res,next,details_id)=>{
    req.details_id = details_id;//can handle any other useful info here
    next();
};
exports.get_user_home = (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        console.log(`Authenticated in user home : ${req.details_id}`);
        res.send(JSON.stringify({
            pageTitle : 'User Home',
            isEmployee : false,//user.checkIsEmployee(),
            favDishes : 'favdishes',//user.getFavouriteDishes().rows,
            freqDishes : 'freqdishes',//user.getFrequenDishes().rows,
            //recommender_dishes
            bestSellers : 'bestSellers',//user.getBestSellers()
        }));
    }else{
        res.redirect('/home');
    }
};

