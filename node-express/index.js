// since we already installed the modules to the app, you can directly import it as you do with core modules
const express=require('express');
const http=require('http');
const morgan=require('morgan');//use morgan to log debugging messages
const bodyParser=require('body-parser');
const dishRouter=require('./routes/dishRouter');

const hostname='localhost';
const port=3000;
// create the app using express framework by using express()
const app=express();
app.use(morgan('dev'));//make it a dev version so we can see print outs
// below is to serve the app using the files under public folder
app.use(bodyParser.json());//this will parse the body in json format
app.use('/dishes',dishRouter); //this is to specify anything related to endpoint /dishes to dishRouter

// app.all('/dishes',(req,res,next)=>{
//     res.statusCode=200;
//     res.setHeader('Content-Type','text/plain');
//     next();//next function tells it to continue on to the below code and pass on the modified parameters to the below functions

// });

// app.get('/dishes',(req,res,next)=>{
//     res.end('Will send all the dishes to you!');

// });

// app.post('/dishes',(req,res,next)=>{
//     res.end('Will add the dish: '+req.body.name+ ' with details: '+req.body.description);
//     //since we parse the body of the incoming request, so we can access them via req.body.name/description
// });

// app.put('/dishes',(req,res,next)=>{
//     res.statusCode=403;//as it doesn't make sense to put on the /dishes, it's supposed to update on the server
//     res.end('PUT operation not supported on /dishes');
    
//     //since we parse the body of the incoming request, so we can access them via req.body.name/description
// });

// app.delete('/dishes',(req,res,next)=>{
//     res.end('Deleting all the dishes!');
//     //since we parse the body of the incoming request, so we can access them via req.body.name/description
// });


// ========specify dishid methods=====

app.get('/dishes/:dishId',(req,res,next)=>{
    res.end('Will send the details of the dish'+ req.params.dishId+' to you!'); //params refer to the parameters in the URL

});

app.post('/dishes/:dishId',(req,res,next)=>{
    // res.end('Will add the dish:'+req.body.name+ 'with details'+req.body.description);
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
    res.end('POST operation not supported on /dishes/:dishId');
});

app.put('/dishes/:dishId',(req,res,next)=>{
    // res.statusCode=403;//as it doesn't make sense to put on the /dishes, it's supposed to update on the server
    // res.end('PUT operation not supported on /dishes');
    res.write('Updating the dish:'+req.params.dishId);
    // provide the details which is contained in the body
    res.end('Will update the dish: '+req.body.name+'with details: '+req.body.description);
    
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
});

app.delete('/dishes/:dishId',(req,res,next)=>{
    // res.end('Deleting all the dishes!');
    //since we parse the body of the incoming request, so we can access them via req.body.name/description
    res.end('Deleting dish id'+req.params.dishId);
});

app.use(express.static(__dirname+'/public')) //'__dirname' means the root directory of this project
app.use((req,res,next)=>{
    // console.log(req.headers);
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

const server=http.createServer(app);
server.listen(port,hostname,()=>{
    console.log(`Server running in http://${hostname}:${port}`)
});