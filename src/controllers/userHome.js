const User = require("../models/user");
const Menu = require('../models/menu');

exports.get_user_home = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsEmployee().catch(err=>console.log(err));
       // const dishes = new Menu(1);
        var orders = await Menu.get_all_total_dishes();
        orders = orders.rows;
        var class1 = [];
        var class2 = [];
        var class3 = [];
        for(var i=0;i<orders.length;i++){
            if(i%3==0){
                class1.push(orders[i]);
            }
            if(i%3==1){
                class2.push(orders[i]);
            }
            if(i%3==2){
                class3.push(orders[i]);
            }
        }
        var prevord = await Menu.get_prev_orders(details.details_id);
        prevord = prevord.rows;
        for(var i=0;i<prevord.length;i++){
            class1 = class1.filter(x => {
                return x.dish_id != prevord[i].dish_id;
              });

              class2 = class1.filter(x => {
                return x.dish_id != prevord[i].dish_id;
              });

              class3 = class1.filter(x => {
                return x.dish_id != prevord[i].dish_id;
              });
        }

        var recommend = [];

        if(Math.min(class1.length,class2.length,class3.length) == class1.length && class1.length >=3){
            recommend = class1;
        }
        else if(Math.min(class1.length,class2.length,class3.length) == class2.length && class2.length >=3){
            recommend = class2;
        }
        else if(Math.min(class1.length,class2.length,class3.length) == class3.length && class3.length >=3){
            recommend = class3;
        }
        else{
            recommend.push(class1[0]);
            recommend.push(class2[0]);
            recommend.push(class3[0]);
        }

        //console.log(`Authenticated in user home : ${req.details_id}`);
        res.render('userHome.ejs',{
            pageTitle:'User Home',
            path : '/userHome',
            alertMessage:false,
            isEmployee : isEmp,
            userImage : req.oidc.user.picture,
            displayName : details.first_name,
            debugString : 'In get_home,unauthenticated',
            recommend: recommend
        });
    }else{
        res.redirect('/home');
    }
};

