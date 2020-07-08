// since we already installed the modules to the app, you can directly import it as you do with core modules
const express=require('express');
const http=require('http');
const hostname='localhost';
const port=3000;
// create the app using express framework by using express()
const app=express();
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