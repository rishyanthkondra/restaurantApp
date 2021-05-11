const User = require("../models/user");

exports.get_user_home = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsEmployee().catch(err=>console.log(err));
        //console.log(`Authenticated in user home : ${req.details_id}`);
        res.render('userHome.ejs',{
            pageTitle:'User Home',
            path : '/userHome',
            alertMessage:false,
            isEmployee : isEmp,
            userImage : req.oidc.user.picture,
            displayName : details.first_name,
            debugString : 'In get_home,unauthenticated'
        });
    }else{
        res.redirect('/home');
    }
};

