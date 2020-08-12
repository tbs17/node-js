const mongoose=require('mongoose');

const Dishes=require('./models/dishes');
const url='mongodb://0.0.0.0:27017/conFusion';
const connect=mongoose.connect(url);

connect.then((db)=>{
    console.log("Connected correctly to server");
    // using the Dishes schema to make a new document
    // var newDish=Dishes({
    //     name:'Uthappizza',
    //     description:'test'
    // });
    // newDish.save()

    // below using the create method and can omit the save step
    Dishes.create({
        name:'Uthappizza',
        description:'test'
    })
    .then((dish)=>{
        console.log(dish);
// return all the dishes found
        return Dishes.find({}).exec();
    })
    .then((dishes)=>{
        console.log(dishes);
        return Dishes.remove({});
    })
    .then(()=>{
        return mongoose.connection.close();
    })
    .catch((err)=>{
        console.log(err);
    });
});