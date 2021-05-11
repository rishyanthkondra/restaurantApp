const Data_screen = require("../models/data_screen");
const User = require("../models/user");

exports.get_form = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsRequiredRole('Manager').catch(err=> console.log(err));

        if(isEmp){

    const recitem = new Data_screen();
    const roles = await recitem.get_roles();
    const work_types = ['permanent','temporary','internship'];

    res.render('includes/recruit.ejs', {
        pageTitle: 'New recruit',
        path: '/recruit',
        roles: roles.rows,
        work_types: work_types,
        isEmployee : isEmp,
        userImage : req.oidc.user.picture,
        email : req.oidc.user.email,
        displayName : details.first_name,
        editing: false
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

exports.post_form = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsRequiredRole('Manager').catch(err=> console.log(err));

        if(isEmp){

    const recitem = new Data_screen();
    var email = req.body.email;
    var role = req.body.role;
    var wage = req.body.wage;
    var work_type = req.body.work_type;
    const new_emp = new User(email);
    var checks = await new_emp.inDb();
    var check2 = await new_emp.checkIsEmployee();
    if(checks && !check2){
        var details_id = await new_emp.getDetailsId();
        await recitem.new_employee(details_id,role,wage,work_type);
        res.redirect('/employees');
    }
    else{
        res.redirect('/recruit');
    }
    
}
else{
    res.redirect('/home');
}
}
else{
    res.redirect('/home');
}
    
};