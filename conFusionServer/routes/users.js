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

  User.register(new User({username: req.body.username}),//1st parameter, if the value is a dictionary, then you will need to use {}
  req.body.password,//2nd parameter
  (err,user)=>{ //3rd parameter is the resulting call-back function with err and user

    if(err) {

      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err});
    }
    else {
  
      passport.authenticate('local')(req,res,()=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success:true, status: 'Registration Successful!'});//add a success field in the output json file
      });
    }
  });

});


// ====='/login' page will go through passport.authenticate('local') strategy first followed by a call-back function 
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success:true, status: 'You are successfully logged in!'});

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