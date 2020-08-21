const express=require('express');
const cors=require('cors');
const app=express();

const whitelist=['http://localhost:3000','https://localhost:3443'];
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