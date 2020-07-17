const MongoClient=require('mongodb').MongoClient;
const assert=require('assert');
const dboper=require('./operations'); //import the operations module from local using ./

const url='mongodb://localhost:27017' //27017 is the port that mongo db is running
const dbname='conFusion';

//second argument is a call-back function
MongoClient.connect(url).then((client)=>{
    // assert.equal(err,null);//assert function to check if the error is null, if not null, will show the error on the screen
    console.log('Connected correctly to the server');
    const db=client.db(dbname); //define a database connection
    dboper.insertDocument(db,{name:"Vadonut",description:'Test'},'dishes')

    // the way promises works is to close the part before the callback function and chained with .then().then().then().then().then(), 
    // in the end, you add .catch((err)=>consold.log(err)) to catch the errors 
    .then((result)=>{
        console.log('Insert Document:\n',result.ops);
        // use return to return the promise
        return dboper.findDocuments(db,'dishes')
    })

    .then((docs)=>{
        console.log('Found Documents:\n',docs);
            // the second argument-document doesn't need to be the full document, using name to identify it and the third arg-update parameter
            // will take the part that you need to update on and use callback function to pass back the parameter for the later use
        return dboper.updateDocument(db,{name:"Vadonut"},{description:'Updated Test'},'dishes')
    })
    .then((result)=>{
        console.log("Updated Document:\n",result.result);
        return dboper.findDocuments(db,'dishes')
    })
    .then((docs)=>{
            console.log("Found documents:\n",docs);//found all the documents again after updating
            return db.dropCollection('dishes')
    })
    .then((result)=>{
            console.log('Dropped Collection: ',result);
            client.close();
    })
    // this last promise needs a catch error 
    .catch((err)=>console.log(err));
    
    })
 
// below is chained for the error handling promise after the overarching .then()
.catch((err)=>console.log(err));
//====below is using the call back function===

// dboper.insertDocument(db,{name:"Vadonut",description:'Test'},'dishes',(result)=>{
//     console.log('Insert Document:\n',result.ops);
//     // inside the insertDocument function, we do findDocuments and others
//     dboper.findDocuments(db,'dishes',(docs)=>{
//         console.log('Found Documents:\n',docs);
//         // the second argument-document doesn't need to be the full document, using name to identify it and the third arg-update parameter
//         // will take the part that you need to update on and use callback function to pass back the parameter for the later use
//         dboper.updateDocument(db,{name:"Vadonut"},{description:'Updated Test'},'dishes',(result)=>{
//             console.log("Updated Document:\n",result.result);
//             dboper.findDocuments(db,'dishes',(docs)=>{
//                 console.log("Found documents:\n",docs);//found all the documents again after updating
//                 db.dropCollection('dishes',(result)=>{
//                     console.log('Dropped Collection: ',result);
//                     client.close();
//                 });
//             });
//         });
//     });

// });
// });

// =====below is without separate module import====
//     const collection=db.collection('dishes');
//     collection.insertOne({"name":"Uthappizza","description":"test"},(err,result)=>{
//         assert.equal(err,null);
//         console.log("After Insert:\n");
//         console.log(result.ops);//shows how many operations have been carried out successfully
//         collection.find({}).toArray((err,docs)=>{
//             assert.equal(err,null);
//             console.log("Found:\n");
//             console.log(docs); //return all the documents 
// //after returning all the documents, we want it to be deleted
//             db.dropCollection('dishes',(err,result)=>{
//                 assert.equal(err,null);
//                 client.close();

//             });
//         });
    // });

// });