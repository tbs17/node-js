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

// below is to define the router using router files
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
// below is to use mongoose schema ile
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
// '12345-67890-09876-54321' secret key, is random here
// comment out if using express-session
// app.use(cookieParser('12345-67890-09876-54321'));//middleware 2 parsing the cookie and other things
app.use(session({
  name:'session-id',
  secret:'12345-67890-09876-54321',
  'saveUninitialized':false,
  resave:false,
  store:new FileStore()
}));
// =====passport authentication====
// initialize the passport authentication step which is included in the router/users.js:passport.authenticate('local')
app.use(passport.initialize());
// once initialized, it will attach the 'user' property to the req
app.use(passport.session());

// moved up from bottom to before the authentication step as the home page and signup doesn't need authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);
// =======passport-local AUTHORIZATION=======
// much simpler than the basic authorization strategy
function auth(req,res,next) {
  if(!req.user){
    var err=new Error('You are not authenticated!');
    err.status=403;
    return next(err); 
  }else{
    next();
  }
};
app.use(auth); 
// ====basic authentication with sesion cookie===
// function auth(req,res,next) {
  // console.log(req.signedCookies);
  // console.log(req.session);
    // if(!req.session.user){
    // if(!req.signedCookies.user){
// if the signedCookies named as 'user' is not done, then we will go through the basic authentication process

  // create a variable called authHeader that's from the authorization header which can be included in the request
    // var authHeader=req.headers.authorization;

    // if (!authHeader){ //if user didn't provide authorization header
    // var err=new Error('You are not authenticated!'); //then create an error message telling the client that he's not authorized
// responde with a header information of WWW-Authenticate and ask the client to provide basic authentication
    // res.setHeader('WWW-Authenticate','Basic');//prompt user to do basic authentication
    // err.status=401; //the err status will be 401(unautherized), if it's a response status, we will statusCode
    // return next(err); //redirect the user to the error handling mechanism
    // }
    // new buffer.from() is more secure than new buffer()
    // var auth=new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    // //the authHeader will contain 'Basic' and the encrypted string'QWSH...', that's why [1]
    // // we will use base64 protocol to descrpt it, extract the username and password
    // var username=auth[0];
    // var password=auth[1];

    // if(username==='admin' && password==='password'){ //here is the username is 'admin' and the password is 'password', note '==='
    //   // res.cookie('user','admin',{signed:true}); //if basic authentication is successful, then server will set up a cookie 
    //   req.session.user='admin';
    //   next();//next means the authentication part is done and the user can move on to the next stage

    // } else {
    //   var err=new Error('You are not authenticated!'); 
    //   res.setHeader('WWW-Authenticate','Basic');
    //   err.status=401; 
    //   return next(err); 
    // }
  // } else {
    // if(req.session.user==='authenticated'){
    //   // if(req.signedCookies.user=='admin'){
    //   // if the signedCookies named as user with the username as 'admin' exist, then bypass the basic authentication
    //   next();
    // }else{
    //   // if the cookie doesn't exist nor finish the basic authenticaiton, then pass it to the error handling
    //   var err=new Error('You are not authenticated!'); 
    //   err.status=403; 
    //   return next(err); 
    // }
  // }
// }
// app.use(auth); 
// ====Authorization and cookie Parsing middelware is done===



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
