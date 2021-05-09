const checksum_lib = require("../Paytm/checksum");
const config = require("../Paytm/config");
const https = require("https");
const qs = require("querystring");

const formidable =  require('formidable');


exports.paytmcallback = (req, res) => {

    var post_data = req.body;
    var post_data = req.body;
    var checksumhash = post_data.CHECKSUMHASH;
    var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
    if (result && post_data.STATUS == "TXN_SUCCESS"){
        res.redirect('/cart');
    }
    else{
        res.redirect('/cart');
    }

    // const form = new formidable.IncomingForm();

    // form.parse(req,(err,fields,file)=>{
    //     var post_data = req.body;
    //     var checksumhash = post_data.CHECKSUMHASH;
    //     var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
    //     console.log("Checksum Result => ", result, "\n");

    //     var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};

    //     checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) { 
    //         params.CHECKSUMHASH = checksum;
    //         post_data = 'JsonData='+JSON.stringify(params);
     
    //         var options = {
    //           hostname: 'securegw-stage.paytm.in', // for staging
    //           // hostname: 'securegw.paytm.in', // for production
    //           port: 443,
    //           path: '/merchant-status/getTxnStatus',
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             'Content-Length': post_data.length
    //         }
    //     };

    //     var response = "";
    //     var post_req = https.request(options, function(post_res) {
    //         post_res.on('data', function (chunk) {
    //             response += chunk;
    //         });
  
    //         post_res.on('end', function(){
    //             console.log('S2S Response: ', response, "\n");
    //             var _result = JSON.parse(response);
    //             if(_result.STATUS == 'TXN_SUCCESS') {
    //                 res.send('payment sucess')
    //             }else {
    //                 res.send('payment failed')
    //             }
    //          });
    //      });
  
    //     //  post the data
    //      post_req.write(post_data);
    //      post_req.end();

    //     });
    // });

}
