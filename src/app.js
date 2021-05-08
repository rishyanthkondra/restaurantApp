
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

const {auth} = require('express-openid-connect');

<<<<<<< HEAD
const menu = require('./routes/menu');
=======
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
};
>>>>>>> 41697d0ed520491ae48887a26efc15923d9901b7

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
const data_screen = require('./routes/data_screen');
const purchases = require('./routes/purchases');
const transactions = require('./routes/transactions');
const recruit = require('./routes/recruit');
const emp = require('./routes/employees');

//---------------------- Endpoint Baseurls ---------------------//

app.use('/home',homeRoute);

// customer related : 
app.use('/userHome',userHomeRoute);
app.use('/userDetails',userDetailsRoute);


app.use('/statistics',data_screen);
app.use('/purchases',purchases);
app.use('/transactions',transactions);
app.use('/recruit',recruit);
app.use('/employees',emp);

<<<<<<< HEAD
app.use('/menu',menu);

app.listen(3000);
=======
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









  
>>>>>>> 41697d0ed520491ae48887a26efc15923d9901b7
