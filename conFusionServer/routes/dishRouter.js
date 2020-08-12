const express=require('express')
const bodyParser=require('body-parser')


// use the disehs schema via mongoose
const mongoose=require('mongoose');
const Dishes=require('./models/dishes');

const dishRouter=express.Router() //use the Router method of express to create a Router
dishRouter.use(bodyParser.json())//convert all the parsed info to json format for easy access
//use the route attribute of the created router and you can chain all the method upon it

dishRouter.route('/')
// as long as there's no semi-colon in between, it's chaining, you don't need the /dishes any more
.get((req,res,next)=>{
    // res.end('Will send all the dishes to you!')
    // .find/create/findByID/findByIDAndUpdate/findByIDAndRemove are all methods from mongoose
    Dishes.find({})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        // the below will conver all the info about dishes into json format
        res.json(dishes);

// below error handling and pass to the next parameter
    },(err)=>next(err))
    .catch((err)=>next(err));

})

.post((req,res,next)=>{
    // res.end('Will add the dish: '+req.body.name+ ' with details: '+req.body.description)
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
    Dishes.create(req.body)
    .then((dish)=>{
        // console log is like alert in javascript
        console.log('Dish Created',dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        // the below will conver all the info about dishes into json format
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));

})

.put((req,res,next)=>{
    res.statusCode=403//as it doesn't make sense to put on the /dishes, it's supposed to update on the server
    res.end('PUT operation not supported on /dishes')
    
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
})

.delete((req,res,next)=>{
    // res.end('Deleting all the dishes!')
    Dishes.remove({}) //using promise chaining
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        // the below will conver all the info about dishes into json format
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
   
});
//the chaining finish here


//========starting the dishId endpoints actions=======
dishRouter.route('/dishId')
.get((req,res,next)=>{
    // res.end('Will send the details of the dish '+ req.params.dishId+' to you!') //params refer to the parameters in the URL
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        // console log is like alert in javascript
        console.log('Dish Created',dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        // the below will conver all the info about dishes into json format
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post((req,res,next)=>{
    // res.end('Will add the dish:'+req.body.name+ 'with details'+req.body.description)
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
    res.end('POST operation not supported on /dishes/:dishId')
})

.put((req,res,next)=>{
    // res.statusCode=403//as it doesn't make sense to put on the /dishes, it's supposed to update on the server
    // res.end('PUT operation not supported on /dishes')
    // res.write('Updating the dish: '+req.params.dishId)
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{new:true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        // the below will conver all the info about dishes into json format
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
    // provide the details which is contained in the body
    // res.end('Will update the dish: '+req.body.name+' with details: '+req.body.description)
    
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
})

.delete((req,res,next)=>{
    // res.end('Deleting all the dishes!')
    // res.end('Deleting dish id'+req.params.dishId)
    
    Dishes.findByIdAndRemove(req.params.dishId)
    Dishes.remove({})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        // the below will conver all the info about dishes into json format
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
});



module.exports=dishRouter //to export this module to the bigger 
