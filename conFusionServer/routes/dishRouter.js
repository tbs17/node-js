const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose');
const authenticate=require('../authenticate');
const Dishes=require('../models/dishes');

const dishRouter=express.Router() //use the Router method of express to create a Router
dishRouter.use(bodyParser.json())//convert all the parsed info to json format for easy access
//use the route attribute of the created router and you can chain all the method upon it

dishRouter.route('/')
.get((req,res,next)=>{
    // res.end('Will send all the dishes to you!')
    // .find/create/findByID/findByIDAndUpdate/findByIDAndRemove are all methods from mongoose
    Dishes.find({})
    .populate('comments.author') //populate the author informationwhen searching for comments
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        // the below will conver all the info about dishes into json format
        res.json(dishes);

// below error handling and pass to the next parameter
    },(err)=>next(err))
    .catch((err)=>next(err));

})
// first verify the user via authenticate.verifyUser  and then do the call-back function
.post(authenticate.verifyUser,(req,res,next)=>{
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

.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403//as it doesn't make sense to put on the /dishes, it's supposed to update on the server
    res.end('PUT operation not supported on /dishes')
    
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
})

.delete(authenticate.verifyUser,(req,res,next)=>{

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
dishRouter.route('/:dishId')
.get((req,res,next)=>{
    // res.end('Will send the details of the dish '+ req.params.dishId+' to you!') //params refer to the parameters in the URL
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
  
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        // the below will conver all the info about dishes into json format
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    // res.end('Will add the dish:'+req.body.name+ 'with details'+req.body.description)
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
})

.put(authenticate.verifyUser,(req,res,next)=>{
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

.delete(authenticate.verifyUser,(req,res,next)=>{
    // res.end('Deleting all the dishes!')
    // res.end('Deleting dish id'+req.params.dishId)
    
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        // the below will conver all the info about dishes into json format
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});
// ======================================================
// ================handling comments=====================
dishRouter.route('/:dishId/comments')
// as long as there's no semi-colon in between, it's chaining, you don't need the /dishes any more
.get((req,res,next)=>{
    // res.end('Will send all the dishes to you!')
    // .find/create/findByID/findByIDAndUpdate/findByIDAndRemove are all methods from mongoose
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if (dish!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            // the below will conver all the info about dishes into json format
            res.json(dish.comments);//only return comments
        } else {
            // Error() is a constructor that can take string or variables
            err=new Error('Dish '+req.params.dishId+' not found');
            err.status=404;
            return next(err);//next() is to forward something
        }
// below error handling and pass to the next parameter
    },(err)=>next(err))
    .catch((err)=>next(err));

})

.post(authenticate.verifyUser,(req,res,next)=>{
    // res.end('Will add the dish: '+req.body.name+ ' with details: '+req.body.description)
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish!=null){
            //author is set to be an objectId referencing the user who logged in
            // therefore, the author info is the user._id from request 'req.user._id'
            req.body.author=req.user._id;
            // push the new comments to the data table comments
            dish.comments.push(req.body); //add the posted value
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);//return the dish comments
                })

            },(err)=>next(err)); //set up an error handling
            //only return comments
        } else {
            // Error() is a constructor that can take string or variables
            err=new Error('Dish '+req.params.dishId+' not found');
            err.status=404;
            return next(err);//next() is to forward something
        }

    },(err)=>next(err))
    .catch((err)=>next(err));

})

.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403//as it doesn't make sense to put on the /dishes, it's supposed to update on the server
    res.end('PUT operation not supported on /dishes/'+req.params.dishId+'/comments!')
    
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    // res.end('Deleting all the dishes!')

    Dishes.findById(req.params.dishId) //using promise chaining
    .then((dish)=>{
        // res.statusCode=200;
        // res.setHeader('Content-Type','application/json');
        // // the below will conver all the info about dishes into json format
        // res.json(resp);
        if (dish!=null){
            // delete the dishes one by one using i-- and 
            for (var i=(dish.comments.length-1); i>=0;i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save() //save the dish which is decreasing one by one
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);//return the remaining dishes
            },(err)=>next(err));
            //only return comments
        } else {
            // Error() is a constructor that can take string or variables
            err=new Error('Dish '+req.params.dishId+' not found');
            err.status=404;
            return next(err);//next() is to forward something
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
   
});
//the chaining finish here

// ===================================================
//========Handling commentId endpoints actions=======
dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>{
    // res.end('Will send the details of the dish '+ req.params.dishId+' to you!') //params refer to the parameters in the URL
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        // check the dish itself and comment id exist, 'dish.comments.id(req.params.commentId) is to 
        // find the comment based on the commentId
        if (dish!=null && dish.comments.id(req.params.commentId) !=null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            // the below will conver all the info about dishes into json format
            res.json(dish.comments.id(req.params.commentId));//only return comments
        } else if (dish==null) {
            // Error() is a constructor that can take string or variables
            err=new Error('Dish '+req.params.dishId+' not found');
            err.status=404;
            return next(err);//next() is to forward something
        } else{ //dish exists but comment doesn't exist
            err=new Error('Comment '+req.params.commentId+' not found');
            err.status=404;
            return next(err);//next() is to forward something
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    // res.end('Will add the dish:'+req.body.name+ 'with details'+req.body.description)
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
    res.end('POST operation not supported on /dishes/'+req.params.dishId+'/comments/'+req.params.commentId);
})

.put(authenticate.verifyUser,(req,res,next)=>{

    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        // check the dish itself and comment id exist, 'dish.comments.id(req.params.commentId) is to 
        // find the comment based on the commentId, then we can update
        if (dish!=null && dish.comments.id(req.params.commentId) !=null){
            // we will update the comment by its rating and then comment
            if(req.body.rating){ //if the rating is valid
                dish.comments.id(req.params.commentId).rating=req.body.rating;
                //we updated the comment rating to be req.body.rating
            }
            if(req.body.comment){//if the comment from the body is valid
                dish.comments.id(req.params.commentId).comment=req.body.comment;
                // we will update the comment to be the body comment
            }

            dish.save()
            // once saved, we send back to the user
            .then((dish)=>{
                Dishes.findById(dishId)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);//return the dish comments
                    })
            },(err)=>next(err))
        } else if (dish==null) {
            // Error() is a constructor that can take string or variables
            err=new Error('Dish '+req.params.dishId+' not found');
            err.status=404;
            return next(err);//next() is to forward something
        } else{ //dish exists but comment doesn't exist
            err=new Error('Comment '+req.params.commentId+' not found');
            err.status=404;
            return next(err);//next() is to forward something
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
    
  

})

.delete(authenticate.verifyUser,(req,res,next)=>{
    // res.end('Deleting all the dishes!')
    // res.end('Deleting dish id'+req.params.dishId)
    Dishes.findById(req.params.dishId) //using promise chaining
    .then((dish)=>{
        // check if the dish and comment are both not null
        if (dish!=null && dish.comments.id(req.params.commentId) !=null){
            // delete the comment one by one using i-- and 
          
            dish.comments.id(req.params.commentId).remove();
            
            dish.save() //save the changes to the dish
            .then((dish)=>{
                Dishes.findById(dishId)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);//return the dish comments
                })
            },(err)=>next(err));
            //only return comments
        }  else if (dish==null) {
            // Error() is a constructor that can take string or variables
            err=new Error('Dish '+req.params.dishId+' not found');
            err.status=404;
            return next(err);//next() is to forward something
        } else{ //dish exists but comment doesn't exist
            err=new Error('Comment '+req.params.commentId+' not found');
            err.status=404;
            return next(err);//next() is to forward something
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});


module.exports=dishRouter; //to export this module to the bigger 
