const Data_screen = require('../models/data_screen');
const User = require("../models/user");

exports.get_trans = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsRequiredRole('Manager').catch(err=> console.log(err));

        if(isEmp){

    var start_date = req._parsedOriginalUrl.query;
    var end_date = req._parsedOriginalUrl.query;

    if(!start_date){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        start_date = yyyy + '-' + mm + '-' + dd;
    }
    else{
        start_date = (start_date.split('&')[0]).split('=')[1];
    }

    if(!end_date){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        end_date = yyyy + '-' + mm + '-' + dd;
    }
    else{
        end_date = (end_date.split('&')[1]).split('=')[1];
    }

    const tranitem = new Data_screen();
    const tran = await tranitem.get_trans(start_date,end_date);
    var s_tran = [];
    var p_tran = [];
    var f_tran = [];
    for(var i=0;i<tran.rows.length;i++){
        if(tran.rows[i].trans_status == 'successful'){
            s_tran.push(tran.rows[i]);
        }
        else if(tran.rows[i].trans_status == 'pending'){
            p_tran.push(tran.rows[i]);
        }
        else if(tran.rows[i].trans_status == 'failed'){
            f_tran.push(tran.rows[i]);
        }
    }
    var total_pur = 0;

    res.render('includes/transactions.ejs', {
        pageTitle: 'Transactions',
        path: '/transactions',
        s_trans: s_tran,
        p_trans: p_tran,
        f_trans: f_tran,
        start_date: start_date,
        end_date: end_date,
        isEmployee : isEmp,
        userImage : req.oidc.user.picture,
        email : req.oidc.user.email,
        displayName : details.first_name,
        total: total_pur
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

exports.get_new_trans = async (req,res,next) => {
    res.redirect('/transactions?start_date='+req.body.start_date+'&end_date='+req.body.end_date);
};