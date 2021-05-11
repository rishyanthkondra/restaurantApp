const Allot_order = require('../models/allot_order');
const User = require("../models/user");

exports.route_emp = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const role = await user.getRole().catch(err=> console.log(err));

    if(role.length > 0){
    
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];

    if(role[0].role_name == 'Chef'){
        res.render('chef_home.ejs', {
            pageTitle: 'Chef home',
            path: '/emp_home',
            isEmployee : true,
            userImage : req.oidc.user.picture,
            email : req.oidc.user.email,
            displayName : details.first_name
        });
    }

    if(role[0].role_name == 'Manager'){
        res.render('man_home.ejs', {
            pageTitle: 'Manager home',
            path: '/emp_home',
            isEmployee : true,
            userImage : req.oidc.user.picture,
            email : req.oidc.user.email,
            displayName : details.first_name
        });
    }

    if(role[0].role_name == 'Delivery'){
        res.render('del_home.ejs', {
            pageTitle: 'Delivery boy home',
            path: '/emp_home',
            isEmployee : true,
            userImage : req.oidc.user.picture,
            email : req.oidc.user.email,
            displayName : details.first_name
        });
    }

    }

    else{
        res.redirect('/userHome');
    }
}
else{
    res.redirect('/home');
}
    
};