var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');

const mongoose=require('mongoose');
const Dishes=require('./models/dishes');
const { countDocuments } = require('./models/dishes');

// set up the server
const url='mongodb://0.0.0.0:27017/conFusion';
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
app.use(cookieParser());//middleware 2 parsing the cookie and other things

// =======BASIC AUTHORIZATION=======
// write a function auth

function auth(req,res,next) {
  console.log(req.headers);
// create a variable called authHeader that's from the authorization header which can be included in the request
  var authHeader=req.headers.authorization;

  if (!authHeader){ //if user didn't provide authorization header
    var err=new Error('You are not authenticated!'); //then create an error message telling the client that he's not authorized
// responde with a header information of WWW-Authenticate and ask the client to provide basic authentication
    res.setHeader('WWW-Authenticate','Basic');
    err.status=401; //the err status will be 401(unautherized), if it's a response status, we will statusCode
    return next(err); //redirect the user to the error handling mechanism
  }
  var auth=new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
  //the authHeader will contain 'Basic' and the encrypted string'QWSH...', that's why [1]
  // we will use base64 protocol to descrpt it

  // extract the username and password
  var username=auth[0];
  var password=auth[1];

  if(username==='admin' && password==='password'){ //here is the username is 'admin' and the password is 'password', note '==='
    next();//next means the authentication part is done and the user can move on to the next stage

  } else {
    var err=new Error('You are not authenticated!'); 
    res.setHeader('WWW-Authenticate','Basic');
    err.status=401; 
    return next(err); 
  }
}
// ====Authorization middelware is done===


app.use(auth); 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',dishRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
