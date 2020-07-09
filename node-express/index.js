// since we already installed the modules to the app, you can directly import it as you do with core modules
const express=require('express');
const http=require('http');
const morgan=require('morgan');//use morgan to log debugging messages
const hostname='localhost';
const port=3000;
// create the app using express framework by using express()
const app=express();
app.use(morgan('dev'));//make it a dev version so we can see print outs
// below is to serve the app using the files under public folder
app.use(express.static(__dirname+'/public')) //'__dirname' means the root directory of this project
app.use((req,res,next)=>{
    console.log(req.headers);
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

const server=http.createServer(app);
server.listen(port,hostname,()=>{
    console.log(`Server running in http://${hostname}:${port}`)
});