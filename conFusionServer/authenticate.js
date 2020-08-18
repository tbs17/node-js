var passport=require('passport');
//import the strategy constructor from passport-local
// it's like from sklearn import LabelEncoder
var LocalStrategy=require('passport-local').Strategy; 
var User=require('./models/user');
var JwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var jwt=require('jsonwebtoken');
var config=require('./config');



// User.authenticate() is from mongoose built-in function, 
// you can also write your own authentication function like before
// user exports.local to export this as a module
exports.local=passport.use(new LocalStrategy(User.authenticate()));
// supports the session part of functionality
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken=function(user){
    return jwt.sign(user,config.secretKey,{
        expiresIn:3600 //user is the payload, 2nd param is secretkey
    });
}

var opts={};
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrkey=config.secretKey;
exports.jwtPassport=passport.use( new JwtStrategy(opts, (jwt_payload,done) =>{
    console.log('JWT payload: ',jwt_payload);
    // search the user based on the payload _id
    User.findOne({_id:jwt_payload._id},(err,user)=>{
        if(err){
            return done(err,false);//the auto complete will show you the parameters

        } else if(user) {
            return done(null,user);//no errror but has user info

        } else{
            return done(null, false);//no error, no other info
        }
    });
}));


exports.verifyUser=passport.authenticate('jwt',{session:false});
