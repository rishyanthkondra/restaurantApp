const Data_screen = require('../models/data_screen');

exports.get_emp = async (req,res,next) => {

    var empitem = new Data_screen();
    const emps = await empitem.get_emps();

    if(req.params.empid){
        const current_data = await empitem.get_emp(req.params.empid);
        const roles = await empitem.get_roles();
        var work_status = ['suspended','active','leave','vacation','fired','reserve'];
        const work_types = ['permanent','temporary','internship'];
        var today = current_data.rows[0].date_of_birth;
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
            dob: start_date
        });
    }
    else{
    res.render('includes/employees.ejs', {
        pageTitle: 'Employees',
        path: '/employees',
        emps: emps.rows,
        editing: false
    });
    }
};

exports.post_emp = async (req,res,next) => {
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
    await recitem.update_employee(req.params.empid,req.params.did,first_name,last_name,phone,email,dob,role,wage,gender,work_type,work_status);
    res.redirect('/employees');
};