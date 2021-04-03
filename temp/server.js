require('dotenv').config();
const express = require('express');
//const http = require('http');
//const logger = require('morgan');
//const path = require('path');
//const router = require('./routes/index');
const { auth,requiresAuth } = require('express-openid-connect');


const app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());

// const config = {
//   authRequired: false,
//   auth0Logout: true
// };

// const port = process.env.PORT || 3000;
// if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
//   config.baseURL = `http://localhost:${port}`;
// }

// app.use(auth(config));

// // Middleware to make the `user` object available for all views
// app.use(function (req, res, next) {
//   res.locals.user = req.oidc.user;
//   next();
// });

// app.use('/', router);

// // Catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // Error handlers
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: process.env.NODE_ENV !== 'production' ? err : {}
//   });
// });

// http.createServer(app)
//   .listen(port, () => {
//     console.log(`Listening on ${config.baseURL}`);
//   });

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.listen(process.env.PORT, ()=>{
	console.log("hello");
})

