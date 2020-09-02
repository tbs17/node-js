const express=require('express');
const cors=require('cors');
const app=express();

// specify a whitelist on the server to allow what orign requests are allowed
// below we only allow the 3000 and 3443 ports with the locahost as hostname
// 'http://localhost:4200' is all the requests from angular client
const whitelist=['http://localhost:3000','https://localhost:3443','http://localhost:4200','http://tshen.k12.com:3001'];
var corsOptionsDelegate=(req,callback)=>{
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin'))!==-1){
        // if return -1, then that origin doesn't exists
        corsOptions={origin:true};

    }
    else{
        corsOptions={origin:false};
    }
    callback(null,corsOptions);
};

exports.cors=cors(); //simple cors
exports.corsWithOptions=cors(corsOptionsDelegate);