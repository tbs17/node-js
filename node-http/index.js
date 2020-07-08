// import http module
const http=require ('http');
// you will create a local server
const hostname='localhost';
const port=3000;//3000 is default
const server=http.createServer((req,res)=>{
    console.log(req.headers);//req is request, res is the response
    req.statusCode=200;
    res.setHeader('Content-Type','text/html');//set up the response header to inform the client that the response will be in html format
    res.end('<html><body><h1> Hello, World!</h1></body></html>') 
})

server.listen(port,hostname,()=>{
    // using back quotes to include the hostname and port variable
    console.log(`Server running at http://${hostname}:${port}`)
});