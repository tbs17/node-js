var createError = require('http-errors');
var express = require('express');
var path = require('path');
// the cookie-parser is already included in the express module
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var FileStore=require('session-file-store')(session);
var passport=require('passport');
var authenticate=require('./authenticate');//import the authenticate module
var config=require('./config');

// below is to define the router using router files
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
// below is to use mongoose schema ile
const mongoose=require('mongoose');
const Dishes=require('./models/dishes');
const { countDocuments } = require('./models/dishes');

// set up the server
const url=config.mongoUrl;
// 'mongodb://0.0.0.0:27017/conFusion';
const connect=mongoose.connect(url);

connect.then((db)=>{
  console.log('Connected correctly to server');
},(err)=>{console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));//middleware 1
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
// once initialized, it will attach the 'user' property to the req
// will use whatever passport strategy it defines in the authenticate.js file

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/dishes', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',dishRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));//404 not found
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
