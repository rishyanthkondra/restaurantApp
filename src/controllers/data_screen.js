const Data_screen = require('../models/data_screen');
const User = require("../models/user");

exports.get_stats = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsRequiredRole('Manager').catch(err=> console.log(err));

        if(isEmp){

    var start_date = req.params.start_date;
    var end_date = req.params.end_date;

    if(!start_date){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        start_date = yyyy + '-' + mm + '-' + dd;
    }

    if(!end_date){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        end_date = yyyy + '-' + mm + '-' + dd;
    }

    const dataitem = new Data_screen();
    const dish_stats = await dataitem.get_dish_stats(start_date,end_date);
    const ing_stats = await dataitem.get_ingredient_stats(start_date,end_date);

    console.log(start_date);
    console.log(end_date);

    res.render('includes/data_screen.ejs', {
        pageTitle: 'Data',
        path: '/statistics',
        dishes: dish_stats.rows,
        ings: ing_stats.rows,
        start_date: start_date,
        end_date: end_date
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

exports.get_new_stats = async (req,res,next) => {
    res.redirect('/statistics/'+req.body.start_date+'/'+req.body.end_date);
};