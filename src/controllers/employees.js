const Data_screen = require('../models/data_screen');
const User = require("../models/user");

exports.get_emp = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsRequiredRole('Manager').catch(err=> console.log(err));

        if(isEmp){

    var empitem = new Data_screen();
    const emps = await empitem.get_emps();

    if(req._parsedOriginalUrl.query){
        const emp_id = parseInt((req._parsedOriginalUrl.query).split('=')[1]);
        const current_data = await empitem.get_emp(emp_id);
        const roles = await empitem.get_roles();
        var work_status = ['suspended','active','leave','vacation','fired','reserve'];
        const work_types = ['permanent','temporary','internship'];
        var today = current_data.rows[0].date_of_birth;
        if(today == null){
            today = new Date();
        }
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        start_date = yyyy + '-' + mm + '-' + dd;

        res.render('includes/recruit.ejs', {
            pageTitle: 'Edit Employee',
            path: '/employees',
            emps: emps.rows,
            editing: true,
            work_status: work_status,
            emp_data: current_data.rows[0],
            roles: roles.rows,
            work_types: work_types,
            isEmployee : isEmp,
            userImage : req.oidc.user.picture,
            email : req.oidc.user.email,
            displayName : details.first_name,
            dob: start_date
        });
    }
    else{
    res.render('includes/employees.ejs', {
        pageTitle: 'Employees',
        path: '/employees',
        emps: emps.rows,
        isEmployee : isEmp,
        userImage : req.oidc.user.picture,
        email : req.oidc.user.email,
        displayName : details.first_name,
        editing: false
    });
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

exports.post_emp = async (req,res,next) => {

    if (req.oidc.isAuthenticated()){

        var user = new User(req.oidc.user.email);
        const isEmp = await user.checkIsRequiredRole('Manager').catch(err=> console.log(err));

        if(isEmp){

    const recitem = new Data_screen();
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var phone = req.body.phone;
    var email = req.body.email;
    var dob = req.body.dob;
    var role = req.body.role;
    var wage = req.body.wage;
    var gender = req.body.gender;
    var work_type = req.body.work_type;
    var work_status = req.body.work_status;
    if(!email){
        email = null;
    }
    const emp_id = parseInt(req.query.emp_id);
    user = new User(req.body.email);
    const isdel = await user.checkIsRequiredRole('Delivery').catch(err=> console.log(err));
    await recitem.update_employee(emp_id,first_name,last_name,phone,email,dob,role,wage,gender,work_type,work_status);
    if(parseInt(role)==4&&!isdel){
        await recitem.updatedel(emp_id,true);
    }
    if(parseInt(role)!=4&&isdel){
        await recitem.updatedel(emp_id,false);
    }
    res.redirect('/employees');
}
else{
    res.redirect('/home');
}
}
else{
    res.redirect('/home');
}

};