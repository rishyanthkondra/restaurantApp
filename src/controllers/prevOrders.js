const User = require("../models/user");
const PO = require("../models/prevOrders");

exports.get_previous_orders = async (req,res,next) => {
    if (req.oidc.isAuthenticated()){
        const user = new User(req.oidc.user.email);
        const detailRows = await user.getDetails().catch(err=>console.log(err));
        const details = detailRows.rows[0];
        const isEmp = await user.checkIsEmployee().catch(err=>console.log(err));
        //console.log(`Authenticated in user home : ${req.details_id}`);
        //get on_way orders
        const onWay = await user.getOnWayOrders().catch(err=>console.log(err));
        //get confirmed orders (to be paid)
        const confm = await user.getConfirmedOrders().catch(err=>console.log(err));
        //get pending orders
        const pend = await user.getPendingOrders().catch(err=>console.log(err));
        //get previous 5 orders (delivered and rejected)
        const comp = await user.getCompletedOrders().catch(err=>console.log(err));
        const onWayPresent = onWay.rowCount > 0;
        const confmPresent = confm.rowCount > 0;
        const pendPresent = pend.rowCount > 0;
        const compPresent = comp.rowCount > 0;
        const result = {
            pageTitle:'Previous Orders',
            alertMessage:false,
            isEmployee : isEmp,
            userImage : req.oidc.user.picture,
            displayName : details.first_name,
            onWayPresent : onWayPresent,
            onWay : onWay,
            confmPresent : confmPresent,
            confm : confm,
            pendPresent : pendPresent,
            pend : pend,
            compPresent : compPresent,
            comp : comp,
            debugString : 'In get_home,unauthenticated'
        };
        //console.log(result);
        res.render('prevOrders.ejs',result);
    }else{
        res.redirect('/home');
    }
};

