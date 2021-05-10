const Address = require("../models/address");
const User = require("../models/user");
const UserDetails = require("../models/userDetails");
const url = require('url');
const querystring = require('querystring');

exports.get_user_details = async (req,res,next) => { // get details and addresses
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        console.log(`Authenticated, in user details : ${req.oidc.user.email}`);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsEmployee().catch(err=> console.log(err));
        var resDate = new Date();
        if (details.date_of_birth){
            resDate = new Date(details.date_of_birth);
        }
        var dd = String(resDate.getDate()).padStart(2, '0');
        var mm = String(resDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = resDate.getFullYear();
        const dob= yyyy + '-' + mm + '-' + dd;
        const all_adresses = await user.getAddresses().catch(err => console.log(err));
        const result  = {
            pageTitle : 'User Details',
            isEmployee : isEmp,
            email : req.oidc.user.email,
            first_name :details.first_name,
            last_name : details.last_name,
            image : req.oidc.user.picture,
            details_id : req.details_id,
            date_of_birth : dob,
            phone_number : (details.phone_number)? details.phone_number : '0000000000',
            gender : (details.gender)? details.gender : 'male',
            addresses : all_adresses.rows
        };
        //console.log(JSON.stringify(result));
        res.render('userDetails.ejs',result);
    }else{
        res.redirect('/home');
    }
};

exports.post_user_details = async (req,res,next) => { // update details
    if (req.oidc.isAuthenticated()){
        //const user = new User(req.oidc.user.email);
        //console.log(`Authenticated, posting user details : ${req.details_id}`);
        const updatedDetails = new UserDetails(req.body.first_name,
                                               req.body.last_name,
                                               req.body.email,
                                               req.body.phone_number,
                                               req.body.date_of_birth,
                                               req.body.gender);
        //console.log(JSON.stringify(updatedDetails));
        await updatedDetails.updateDetails().
                        then(()=>{
                            console.log('Update successful');
                            res.redirect('/userDetails');
                        }).catch(err => console.log(err));
    }else{
        res.redirect('/home');
    }
}

exports.post_address_details = async (req,res,next) => { //update single address
    if (req.oidc.isAuthenticated()){
        console.log('reached here');
        const address = req.query.address_id;
        console.log('reached here');
        if(!address){
            res.redirect('/userDetails');
        }
        const updatedAddress = new Address( req.oidc.user.email,
                                            address,
                                            req.body.house_num,
                                            req.body.region,
                                            req.body.alias,
                                            req.body.symbol);
        updatedAddress.updateAddress().
                        then(()=>{
                            console.log(`Updated address : ${address}`);
                            res.redirect('/userDetails');
                        }).catch(err => console.log(err));
    }else{
        res.redirect('/home');
    }
}

exports.delete_address = async (req,res,next) => { // delete exsting address 
    if (req.oidc.isAuthenticated()){
        //console.log(`Authenticated, posting delete address : ${req.address_id}`);
        const address = req.query.address_id;
        if(!address){
            res.redirect('/userDetails');
        }
        Address.deleteAddress(address).then(()=>{
            console.log(`deleted address : ${address}`);
            res.redirect('/userDetails');
        }).catch(err=> console.log(err));
    }else{
        res.redirect('/home');
    }
}

exports.put_address = async (req,res,next) => { // add new address
    if (req.oidc.isAuthenticated()){
        //console.log(`Authenticated, adding user address details : ${req.details_id}`);
        const newAddress = new Address( req.oidc.user.email,
                                        -1,
                                        req.body.house_num,
                                        req.body.region,
                                        req.body.alias,
                                        req.body.symbol);
        newAddress.addAddress().
                        then(()=>{
                            res.redirect('/userDetails');
                        }).catch(err => console.log(err));
    }else{
        res.redirect('/home');
    }
}
