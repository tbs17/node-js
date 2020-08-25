var passport=require('passport');
//import the strategy constructor from passport-local
// it's like from sklearn import LabelEncoder
var LocalStrategy=require('passport-local').Strategy; 
var User=require('./models/user');
var JwtStrategy=require('passport-jwt').Strategy; //import the jwt strategy for further use
var ExtractJwt=require('passport-jwt').ExtractJwt; //use this contructor to extract jwt tokens
var jwt=require('jsonwebtoken');
var FacebookTokenStrategy=require('passport-facebook-token');
var config=require('./config');

// user exports.local to export this as a module
exports.local=passport.use(new LocalStrategy(User.authenticate()));
// supports the session part of functionality
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));


exports.verifyUser=passport.authenticate('jwt',{session:false});

exports.verifyAdmin=(req,res,next)=>{
    if(req.user.admin)
    next();
    else{
        var err=new Error('You are not authorized to perform deletion');
        err.status=403;
        return next(err);
    }
};

exports.facebookPassport=passport.use(new 
    FacebookTokenStrategy({
        clientID:config.facebook.clientId,
        clientSecret:config.facebook.clientSecret
    },(accessToken,refreshToken,profile, done)=>{
        User.findOne({facebookId:profile.id},(err,user)=>{ //you can't move the '=>' in the first of the line,will cause an error of running the script
            if(err){
                return done(err,false);
            }
            if(!err && user!==null){
                return done(null, user);//if the user has already logged in and not null, then return the user
            }
            else {
                user=new User({username:profile.displayName
                }); //anything related to the profile, is returned from the facebook
                user.facebookId=profile.id;
                user.firstname=profile.name.givenName;
                user.lastname=profile.name.familyname;
                user.save((err,user)=>{
                    if (err)
                        return done(err,false);
                    else
                        return done(null,user);
                })
            }
        });
    }
));