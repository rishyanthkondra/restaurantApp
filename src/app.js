
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const adminRo = require('./routes/admin');
const cartRo = require('./routes/cart');
const prodsRo = require('./routes/prods');
const buyRo = require('./routes/orders');
const pool =  require('./utils/database');

const data_screen = require('./routes/data_screen');
const purchases = require('./routes/purchases');
const transactions = require('./routes/transactions');
const recruit = require('./routes/recruit');
const emp = require('./routes/employees');


const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));


app.use('/admin',adminRo);
app.use('/cart',cartRo);
app.use('/orders',buyRo);
app.use('/prods',prodsRo);

app.use('/statistics',data_screen);
app.use('/purchases',purchases);
app.use('/transactions',transactions);
app.use('/recruit',recruit);
app.use('/employees',emp);

app.listen(3000);