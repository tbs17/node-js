const express=require('express')
const bodyParser=require('body-parser')
const dishRouter=express.Router() //use the Router method of express to create a Router
dishRouter.use(bodyParser.json())
//use the route attribute of the created router and you can chain all the method upon it

dishRouter.route('/')
// as long as there's no semi-colon in between, it's chaining, you don't need the /dishes any more
.get((req,res,next)=>{
    res.end('Will send all the dishes to you!')

})

.post((req,res,next)=>{
    res.end('Will add the dish: '+req.body.name+ ' with details: '+req.body.description)
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
})

.put((req,res,next)=>{
    res.statusCode=403//as it doesn't make sense to put on the /dishes, it's supposed to update on the server
    res.end('PUT operation not supported on /dishes')
    
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
})

.delete((req,res,next)=>{
    res.end('Deleting all the dishes!')
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
});
//the chaining finish here


//========starting the dishId endpoints actions=======
dishRouter.route('/dishId')
.get((req,res,next)=>{
    res.end('Will send the details of the dish '+ req.params.dishId+' to you!') //params refer to the parameters in the URL

})

.post((req,res,next)=>{
    // res.end('Will add the dish:'+req.body.name+ 'with details'+req.body.description)
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
    res.end('POST operation not supported on /dishes/:dishId')
})

.put((req,res,next)=>{
    // res.statusCode=403//as it doesn't make sense to put on the /dishes, it's supposed to update on the server
    // res.end('PUT operation not supported on /dishes')
    res.write('Updating the dish: '+req.params.dishId)
    // provide the details which is contained in the body
    res.end('Will update the dish: '+req.body.name+' with details: '+req.body.description)
    
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
})

.delete((req,res,next)=>{
    // res.end('Deleting all the dishes!')
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
    res.end('Deleting dish id'+req.params.dishId)
});



module.exports=dishRouter //to export this module to the bigger 
