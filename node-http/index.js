// import http module
const http=require ('http');
const path=require('path');
const fs=require('fs');

// you will create a local server
const hostname='0.0.0.0';
const port=3000;//3000 is default
const server=http.createServer((req,res)=>{
    // console.log(req.headers);//req is request, res is the response
    console.log("Request for "+req.url+" by method "+req.method);
    if (req.method=='GET'){
        var fileUrl;
        // if there's no url specified, then default to index.html
        if(req.url=='/') fileUrl='/index.html';
        else fileUrl=req.url;
        // create a variable to convert a relative path to absolute path
        var filePath=path.resolve('./public'+fileUrl);
        // create an extension
        const fileExt=path.extname(filePath);
        if (fileExt=='.html'){
            // check if it exists and do something, if not exist, return to client the error
            fs.exists(filePath,(exists)=>{
                // !exists means not exist
                if(!exists){
                    // if the file doesn't exist, then the response status code will be 404
                    res.statusCode=404;
                    res.setHeader('Content-Type','text/html');
                    res.end('<html><body><h1>Error 404:' +fileUrl+" not found </h1></body></html>");
                    return;
                } 
                res.statusCode=200;
                res.setHeader('Content-Type','text/html');
                // if exists, read the file and constructed t the response
                fs.createReadStream(filePath).pipe(res);
                
            })

        } else{
        res.statusCode=404;
        res.setHeader('Content-Type','text/html');
        res.end('<html><body><h1>Error 404:' +fileUrl+" not an html file </h1></body></html>");
        return;
        }
    }else {
        res.statusCode=404;
        res.setHeader('Content-Type','text/html');
        res.end('<html><body><h1>Error 404:' +req.method+" not supported </h1></body></html>");
        return;
    }
// // otherwise, it's correct
//     req.statusCode=200;
//     //set up the response header to inform the client that the response will be in html format
//     res.setHeader('Content-Type','text/html');
//     res.end('<html><body><h1> Hello, World!</h1></body></html>') 
})

server.listen(port,hostname,()=>{
    // using back quotes to include the hostname and port variable
    // this console is present in terminal as it's server side. won't be necessarily on browser
    console.log(`Server running at http://${hostname}:${port}`)
});