/* eslint-disable no-unused-vars */
'use strict';
/**
 * Module dependencies.
 */

var express = require('express');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var cors = require('cors');

var logger = require('morgan');

var parseError = require('parse-error');

var passport = require('passport');
/**
 * CONFIG Env.
 */


var CONFIG = require('./config/config');
/**
 * Import Routes.
 */


var userRouter = require('./routes/userRoutes');
/**
 * Declare/Config App.
 */


var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors());
/**
 * Initialize Database.
 */

console.log('Environment:', CONFIG.app);

var models = require('./models');

models.sequelize.authenticate().then(function () {
  console.log('Connected to SQL database:', CONFIG.db_name);
})["catch"](function (err) {
  console.error('Unable to connect to SQL database:', CONFIG.db_name, err);
});

if (CONFIG.app === 'dev') {
  models.sequelize.sync() //creates table if they do not already exist
  .then(function () {
    return console.log('Tables created successfully');
  })["catch"](function (err) {
    return console.log('oooh, did you enter wrong database credentials?');
  }); //models.sequelize.sync({ force: true })//deletes all tables then recreates them useful for testing and development purposes
  //	.then(() => console.log('User table created successfully'))
  //	.catch(err => console.log('oooh, did you enter wrong database credentials?'));
}
/**
 * Declare Routes.
 */


app.use('/user', userRouter); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
}); //This is here to handle all the uncaught promise rejections

process.on('unhandledRejection', function (error) {
  console.error('Uncaught Error', parseError(error));
});
module["export"] = app;