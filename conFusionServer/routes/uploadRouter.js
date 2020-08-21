const express=require('express')
const bodyParser=require('body-parser')
const authenticate=require('../authenticate');
const multer=require('multer');
const cors=require('./cors');
// configure/declare multer storage and imageFileFilter
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images'); //the 1st parameter is the error, defining as null here

    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname); 
        //originalname means the name when the user uploads and i insists to use the same name
    }
});

const imageFileFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files!'),false); //because we had the error message, so we don't need 2nd param
    }
    cb(null,true);
};

// define the upload with the specific configurations
const upload=multer({storage:storage,fileFilter:imageFileFilter});


const uploadRouter=express.Router() //use the Router method of express to create a Router
uploadRouter.use(bodyParser.json())//convert all the parsed info to json format for easy access
//use the route attribute of the created router and you can chain all the method upon it

uploadRouter.route('/') //specify method support below:Only POST method is supported
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403
    res.end('PUT operation not supported on /dishes')
    
})

.post(cors.corsWithOptions,authenticate.verifyUser,upload.single('imageFile'),(req,res)=>{ //'imageFile' is the key on the request header 'form-data'
    //the single method is to tell it only allows one single file
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(req.file);//parse the file uploaded from request into json

})

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403
    res.end('PUT operation not supported on /dishes')
    
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403
    res.end('PUT operation not supported on /dishes')
    
})

module.exports=uploadRouter;