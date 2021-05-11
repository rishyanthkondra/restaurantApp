
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

const {auth} = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
};

const app = express();
app.use(auth(config));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));
// for user object too
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    next();
});

//////////////////////////////////////////////////////////////////
///////////////////// ROUTES /////////////////////////////////////
//////////////////////////////////////////////////////////////////

const homeRoute = require('./routes/home');
const userHomeRoute = require('./routes/userHome');
const userDetailsRoute = require('./routes/userDetails');
const bookingsRoute = require('./routes/bookings');
const prevOrdersRoute = require('./routes/prevOrders');
const data_screen = require('./routes/data_screen');
const purchases = require('./routes/purchases');
const transactions = require('./routes/transactions');
const recruit = require('./routes/recruit');
const emp = require('./routes/employees');
const paytm = require('./routes/paytm');
const menu_customer = require('./routes/menu_customer');
const menu_chef = require('./routes/menu_chef');
const menu_others = require('./routes/menu_others');
const cart = require('./routes/cart');
const orders = require('./routes/orders');
const allot = require('./routes/allot_order');
const deli = require('./routes/delboys');
const conf = require('./routes/confirm');

//---------------------- Endpoint Baseurls ---------------------//

app.use('/home',homeRoute);

// customer related : 
app.use('/userHome',userHomeRoute);
app.use('/userDetails',userDetailsRoute);
app.use('/bookings',bookingsRoute);
app.use('/prevOrders',prevOrdersRoute);

app.use('/statistics',data_screen);
app.use('/purchases',purchases);
app.use('/transactions',transactions);
app.use('/recruit',recruit);
app.use('/employees',emp);
app.use('/paytm',paytm);
app.use('/menu_customer',menu_customer);
app.use('/menu_chef',menu_chef);
app.use('/menu_others',menu_others);
app.use('/cart',cart);
app.use('/orders',orders);
app.use('/current_orders',allot);
app.use('/delboys',deli);
app.use('/pending_orders',conf);

//////////////////////////////////////////////////////////////////
///////////////////// SERVING ////////////////////////////////////
//////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    console.log('This page is non existent please go to ~/home!!');
    res.redirect('/home');
});
  
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`listening on port ${port} ...`);
})









  
