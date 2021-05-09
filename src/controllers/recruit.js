const Data_screen = require("../models/data_screen");

exports.get_form = async (req,res,next) => {

    const recitem = new Data_screen();
    const roles = await recitem.get_roles();
    const work_types = ['permanent','temporary','internship'];

    res.render('includes/recruit.ejs', {
        pageTitle: 'New recruit',
        path: '/recruit',
        roles: roles.rows,
        work_types: work_types,
        editing: false
    });
};

exports.post_form = async (req,res,next) => {
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
    if(!email){
        email = null;
    }
    await recitem.new_employee(first_name,last_name,phone,email,dob,role,wage,gender,work_type);
    res.redirect('/employees');
};