
module.exports=(x,y,callback)=>{

    if (x<=0||y<=0){
        // set a timeout of 2 seconds, the first arg is a callback function passed from the 3 variable (x,y,callback)
        // why we need a timeout, because the data from database will take some time to parse in
        setTimeout(()=>
        // the first arg of the callback function is error message and the 2nd arg is the passed value
        // if it's error, then passed null value
        callback(new Error("rectangle dimensions should be greater than 0:l="+x+" and b="+y),
        null),
        2000);
  
    }else{
        setTimeout(()=>
        // if passed null message meaning no error, then pass the javascript object perimeter and area within {}
        callback(null,{
            perimeter: (x,y)=>(2*(x+y)),
// exports is short for module.exports
            area:(x,y)=>(x*y)
        }),
        2000);

    }
}








