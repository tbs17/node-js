var express = require('express');
const cors=require('./cors');



const bodyParser=require('body-parser');
var User=require('../models/user');//use the user schema whenever '/user' get hits
var passport=require('passport');
var authenticate=require('../authenticate');

const { unsubscribe } = require('../app');
var router = express.Router();
router.use(bodyParser.json());//parse everything and turn them into json
/* GET users listing. */
router.options('*',cors.corsWithOptions,(req,res)=>{res.sendStatus(200);});
router.get('/', cors.cors,function(req, res, next) {
  //function(){} is the same as ()=>{}
  res.send('respond with a resource');
});
// in the request, it will be 'user/signup'
// passport based authentication

router.post('/signup',cors.corsWithOptions, (req, res, next) => {

  User.register(new User({username: req.body.username}),//1st parameter, if the value is a dictionary, then you will need to use {}
  req.body.password,//2nd parameter
  (err,user)=>{ //3rd parameter is the resulting call-back function with err and user

    if(err) {

      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err});
    }
    else {
      if(req.body.firstname){
        user.firstname=req.body.firstname;
      }
      if(req.body.lastname){
        user.lastname=req.body.lastname;
      }
      // after documenting the first and last name of the user, save the user
      user.save((err,user)=>{
        // you can just do user.save() or user.save((err,user)=>{}) including the error handling and successful response
        if(err){
          // if there's an error of saving the error
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err:err});
          return ;
        }
        // if there's no error saving the user
        passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success:true, status: 'Registration Successful!'});//add a success field in the output json file
        });
      });
      
    }
  });

});


// ====='/login' page will go through passport.authenticate('local') strategy first followed by a call-back function 
router.post('/login',cors.corsWithOptions,(req,res,next)=>{

 passport.authenticate('local',(err,user,info)=>{//supply a callback fn to return either errr, user or info
  if(err) //this is a pure error not caused by incorrest username or password
  return next(err);
  // if there's no error, but no user found
  if(!user){
    res.statusCode=401;//unauthorized
    res.setHeader('Content-Type','application/json');
    res.json({success:false, status: 'Login Unsuccessful!',err:info}); 

  }
  // if authenticated and proceed to login 
  req.logIn(user,(err)=>{
    if(err){
      res.statusCode=401;//unauthorized
      res.setHeader('Content-Type','application/json');
      res.json({success:false, status: 'Login Unsuccessful!',err:'Could not log in user!'});
    }
  })
    var token=authenticate.getToken({_id:req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success:true, token: token, status: 'You are successfully logged in!'});
}) (req,res,next);


});

router.get('/logout',cors.cors, (req, res) => {
    // if the user is logged in, meaning req.session.user is true 
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');//clear the cookie on the client side
    res.redirect('/');//redirect to the home page

  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;//403 forbidden
    next(err);
  }
});

// create a facebook token route
router.get('/facebook/token',passport.authenticate
('facebook-token'),(req,res)=>{
  if (req.user) {
    var token=authenticate.getToken({_id:req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success:true, token: token, status: 'You are successfully logged in!'});
  }
});

router.get('/checkJWTToken',cors.corsWithOptions,(req,res)=>{
  passport.authenticate('jwt',{session:false},(err,user,info)=>{
    if(err)
    return next(err);
    if (!user){
      res.statusCode=401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status:'JWT invalid',success:false,err:info});

    }
    else{
      res.statusCode=200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status:'JWT valid',success:true,user:user});//send user info and return success message

    }
  }) (req,res);//whenever passport authenticator is created,you will have to attach the (req,res) at the end
})
module.exports = router;