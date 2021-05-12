const checksum_lib = require("../Paytm/checksum");
const config = require("../Paytm/config");
const https = require("https");
const qs = require("querystring");
// const formidable =  require('formidable');

const Cart = require('../models/cart');
const User = require("../models/user");
const Onlineorders = require('../models/onlineorder');
const Transaction = require("../models/transactions"); 
const Allot_order = require("../models/allot_order");


exports.paytmpaynow = async (req,res) => {
    const email = req.oidc.user.email;
    const usr = new User(email);
    const details_id = await usr.getDetailsId().catch(err=>console.log(err));
    const details = await usr.getDetailsUsingDetailsId(details_id);

    if(details.rows[0].phone_number==null){
        res.redirect('/userDetails?status=phone');
    }
    else{

    var paymentDetails = {
        amount: req.body.trans_cost.toString(),
        customerId:  details_id.toString(),
        customerEmail:  email,
        customerPhone: details.rows[0].phone_number
    }

    if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
        res.status(400).send('Payment failed')
    } else {
        var params = {};
        params['MID'] = config.PaytmConfig.mid;
        params['WEBSITE'] = config.PaytmConfig.website;
        params['CHANNEL_ID'] = 'WEB';
        params['INDUSTRY_TYPE_ID'] = 'Retail';
        params['ORDER_ID'] = req.body.order_id;
        params['CUST_ID'] = paymentDetails.customerId;
        params['TXN_AMOUNT'] = paymentDetails.amount;
        params['CALLBACK_URL'] = 'http://localhost:3000/paytm/callback/'+details_id.toString()+'/'+req.body.trans_id.toString();
        params['EMAIL'] = paymentDetails.customerEmail;
        params['MOBILE_NO'] = paymentDetails.customerPhone;
    
    
        checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
            var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
            // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
    
            var form_fields = "";
            for (var x in params) {
                form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
            }
            form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
    
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
            res.end();
        });
    }
}

}








exports.paytmcallback = async (req, res) => {

    // console.log(req);
    var post_data = req.body;
    var post_data = req.body;
    var checksumhash = post_data.CHECKSUMHASH;
    var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
     console.log(req);
    if (result && post_data.STATUS == "TXN_SUCCESS"){
        var details_id = req.params.did;
        var trans_id = req.params.trans_id;
        
        transactions = new Transaction();
        await transactions.update_paid_status(trans_id);

        await Onlineorders.update_paid_status(req.body.ORDERID);

        res.redirect('/cart');
        
    }
    else{
        var allot_order = new Allot_order();
        var x = await allot_order.get_acc(req.body.ORDERID,'rejected');
        x = await allot_order.update_trans(req.body.ORDERID);
        res.redirect('/prevOrders?status=payment');
    }
}
