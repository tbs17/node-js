// you don't have to write this oeprations.js, but it's clearer
const assert=require('assert');

// below write 4 functions:insert/find/remove/update documents
// =====below code is using promise mechanism ====:you can delete the call back function part
exports.insertDocument=(db,document,collection,callback)=>{
    const coll=db.collection(collection);//collect all the collections
    // insert method is supported by mongodb connector
    return coll.insertOne(document);

};

exports.findDocuments=(db,collection,callback)=>{
    const coll=db.collection(collection);
    return coll.find({}).toArray();
};

exports.removeDocument=(db,document,collection,callback)=>{
    const coll=db.collection(collection);
    return coll.deleteOne(document);
};

exports.updateDocument=(db,document,update,collection,callback)=>{
    const coll=db.collection(collection);
    return coll.updateOne(document,{$set:update},null);
};


// =====below code is with call back functions====
// exports.insertDocument=(db,document,collection,callback)=>{
//     const coll=db.collection(collection);//collect all the collections
//     // insert method is supported by mongodb connector
//     coll.insert(document,(err,result)=>{
//         assert.equal(err,null);
//         console.log("Inserted "+result.result.n+" documents into the collection"+collection);
//         callback(result); //pass all the parameters to the call back function

//     });

// };

// exports.findDocuments=(db,collection,callback)=>{
//     const coll=db.collection(collection);
//     coll.find({}).toArray((err,docs)=>{
//         assert.equal(err,null);
//         callback(docs);//simply pass back the retrieved documents
//     });
// };

// exports.removeDocument=(db,document,collection,callback)=>{
//     const coll=db.collection(collection);
//     coll.deleteOne(document,(err,result)=>{
//         assert.equal(err,null);
//         console.log("Removed the document ", document);
//         callback(result);

//     });
// };

// exports.updateDocument=(db,document,update,collection,callback)=>{
//     const coll=db.collection(collection);
//     coll.updateOne(document,{$set:update},null,(err,result)=>{
//         assert.equal(err,null);
//         console.log('Updated the document with ',update);///in the production server, you won't have console.log
//         callback(result);
//     });
// };