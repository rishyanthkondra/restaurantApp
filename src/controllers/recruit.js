const Data_screen = require("../models/data_screen");
const Users = require("../models/user");

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
    var email = req.body.email;
    var role = req.body.role;
    var wage = req.body.wage;
    var work_type = req.body.work_type;
    const new_emp = new Users(email);
    var checks = await new_emp.inDb();
    if(checks){
        console.log("hello");
        var details_id = await new_emp.getDetailsId();
        await recitem.new_employee(details_id,role,wage,work_type);
        res.redirect('/employees');
    }
    else{
        res.redirect('/recruit');
    }
    
    
};