var express = require('express');

const bodyParser=require('body-parser');
var User=require('../models/user');//use the user schema whenever '/user' get hits
var passport=require('passport');

const { unsubscribe } = require('../app');
var router = express.Router();
router.use(bodyParser.json());//parse everything and turn them into json
/* GET users listing. */
router.get('/', function(req, res, next) {
  //function(){} is the same as ()=>{}
  res.send('respond with a resource');
});
// in the request, it will be 'user/signup'
// passport based authentication

router.post('/signup', (req, res, next) => {
  // find the username from request body and do checking against the server store
  // User.findOne({username: req.body.username})
  User.register(new User({username: req.body.username}),//1st parameter, if the value is a dictionary, then you will need to use {}
  req.body.password,//2nd parameter
  (err,user)=>{ //3rd parameter is the resulting call-back function with err and user

  // })
  // .then((user) => {
    if(err) {
      // var err = new Error('User ' + req.body.username + ' already exists!');
      // err.status = 403;
      // next(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err});
    }
    else {
      // return User.create({
      //   username: req.body.username,
      //   password: req.body.password});
      // use the passport method authenticate and the strategy we specified in the authenticate.js file as below:
      // exports.local=passport.use(new LocalStrategy(User.authenticate()));
      passport.authenticate('local')(req,res,()=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success:true, status: 'Registration Successful!'});//add a success field in the output json file
      });
    }
  });
  // .then((user) => {
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type', 'application/json');
  //   res.json({status: 'Registration Successful!', user: user});
  // }, (err) => next(err))
  // .catch((err) => next(err));
});


// ====='/login' page will go through passport.authenticate('local') strategy first followed by a call-back function 
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success:true, status: 'You are successfully logged in!'});
//   if(!req.session.user) {
//     var authHeader = req.headers.authorization;
    
//     if (!authHeader) {
//       var err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     }
  
//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     var username = auth[0];
//     var password = auth[1];
  
//     User.findOne({username: username})
//     .then((user) => {
//       if (user === null) {
//         var err = new Error('User ' + username + ' does not exist!');
//         err.status = 403;
//         return next(err);
//       }
//       else if (user.password !== password) {
//         var err = new Error('Your password is incorrect!');
//         err.status = 403;
//         return next(err);
//       }
//       else if (user.username === username && user.password === password) {
//         req.session.user = 'authenticated';
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/plain');
//         res.end('You are authenticated!')
//       }
//     })
//     .catch((err) => next(err));
//   }
//   else {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('You are already authenticated!');
//   }
})

router.get('/logout', (req, res) => {
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

module.exports = router;