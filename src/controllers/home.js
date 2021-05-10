const User = require("../models/user");

exports.get_home = async (req,res,next) => {
    if(req.oidc.isAuthenticated()){
        const email = req.oidc.user.email;
        const usr = new User(email);
        const inDb = await usr.inDb().catch(err=> console.log(err));
        console.log(`In database? : ${inDb}`);
        //console.log(JSON.stringify(req.oidc.user));
        if (!inDb){
            console.log('Doing first time things');
            await usr.doFirstTimeThings(req.oidc.user).catch(err=>console.log(err));
        }
        res.redirect('/userHome');
    }else{
        //unauthenticated  home page
        res.render('home.ejs',{
            pageTitle:'Home',
            alertMessage:false,
            debugString : 'In get_home,unauthenticated'
        });
    }
}

/*exports.post_home = (req,res,next) => {
    if(req.oidc.isAuthenticated()){
        res.send(JSON.stringify(req.oidc.user));
        //res.redirect('/home');
    }else{
        res.send("Not Authenticated yet.");
    }
}*/