var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose');


var User=new Schema({
    // username:{
    //     type:String,
    //     required:true,
    //     unique:true
    // },
    // password:{
    //     type:String,
    //     required:true
    // },
    admin:{
        type:Boolean,
        default:false
    }
});

User.plugin(passportLocalMongoose); //this will automatically adding the username and hash and salt field for the password

module.exports=mongoose.model('User',User); //exports it as a 'User' name with 'User' Schema