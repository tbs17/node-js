// var rect= {
//     perimeter:(x,y)=>(2*(x+y)),
//     // above is using ES2015 javascript, you can also use typescript dvped by MicroSoft, and you will have to transcribed to javascript later
//     // the => is to define a function
//     area:(x,y)=>(x*y),
// };

var rect=require ('./rectangle');
const rectangle = require('./rectangle');

function solveRect(l,b){
    console.log("Solving for rectangle with l=" + l+" and b="+b);
    // (err,rectangle) is the callback function and you can specify what happens if err and what happens if retangle
    rect(l,b,(err,rectangle)=>{
        if (err){
            console.log('ERROR:',err.message);

        }else{
            // retangle.area() is to access the area function in the rectangle.js
            console.log('The area of the rectangle of dimensions l='+l+" and b="+b+" is "+rectangle.area(l,b));
            console.log('The perimeter of the rectangle of dimensions l='+l+" and b="+b+" is "+rectangle.perimeter(l,b));
        }
    });
    console.log("This statement is after the call to rect() ")
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);