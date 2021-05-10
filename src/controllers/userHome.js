const User = require("../models/user");

exports.param_details_id_handler = (req,res,next,details_id)=>{
    req.details_id = details_id;//can handle any other useful info here
    next();
};
exports.get_user_home = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsEmployee().catch(err=>console.log(err));
        //console.log(`Authenticated in user home : ${req.details_id}`);
        res.render('home.ejs',{
            pageTitle:'Home',
            alertMessage:false,
            debugString : 'In get_home,unauthenticated'
        });
    }else{
        res.redirect('/home');
    }
};

