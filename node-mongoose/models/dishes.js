const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const dishSchema= new Schema({
    name:{
        type:String,
        required: true,
        unique:true
    },
    description:{
        type:String,
        required:true
    }
},{ timestamps:true //this can set the time stamp
});

var Dishes=mongoose.model('Dish',dishSchema);
module.exports=Dishes; //export the module called Dishes(a var defined above)