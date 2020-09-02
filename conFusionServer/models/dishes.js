const mongoose=require('mongoose');
const Schema=mongoose.Schema;

// inject the currency element into the mongoose package
require('mongoose-currency').loadType(mongoose);
// create a currency constant by accessing mongoose's Types which has added currency type
const Currency=mongoose.Types.Currency;

// // make the sub-documents commentSchema
// const commentSchema=new Schema({
//     rating:{
//         type:Number,
//         min:1,
//         max:5,
//         required:true
//     },
//     comment:{
//         type:String,
//         required:true
//     },
//     author:{
//         type: mongoose.Schema.Types.ObjectId, //change from the string to the objectId
//         ref:'User' //refer to the 'User' document
//     }
// },{
//     timestamps:true
// });


const dishSchema= new Schema({
    name:{
        type:String,
        required: true,
        unique:true
    },
    image:{
        type:String,
        required: true
      
    },
    category:{
        type:String,
        required: true
      
    },
    label:{
        type:String,
        // you can specify default value
        default: ''
      
    },
    price:{
        // use the currency constant created above 
        type: Currency,
        required: true,
        min:0
      
    },
    featured:{
        type:Boolean,
        default:false
    
    },
    description:{
        type:String,
        required:true
    },
    // here we insert the sub-document for each dish
    // it's an array of the commentSchema
    // comments:[commentSchema]
},{ timestamps:true //this can set the time
});

var Dishes=mongoose.model('Dish',dishSchema);
module.exports=Dishes; //export the module called Dishes(a var defined above)