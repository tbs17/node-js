const MongoClient=require('mongodb').MongoClient;
const assert=require('assert');

const url='mongodb://localhost:27017' //27017 is the port that mongo db is running
const dbname='conFusion';

//second argument is a call-back function
MongoClient.connect(url,(err,client)=>{
    assert.equal(err,null);//assert function to check if the error is null, if not null, will show the error on the screen
    console.log('Connected correctly to the server');
    const db=client.db(dbname); //define a database connection
    const collection=db.collection('dishes');
    collection.insertOne({"name":"Uthappizza","description":"test"},(err,result)=>{
        assert.equal(err,null);
        console.log("After Insert:\n");
        console.log(result.ops);//shows how many operations have been carried out successfully
        collection.find({}).toArray((err,docs)=>{
            assert.equal(err,null);
            console.log("Found:\n");
            console.log(docs); //return all the documents 
//after returning all the documents, we want it to be deleted
            db.dropCollection('dishes',(err,result)=>{
                assert.equal(err,null);
                client.close();

            });
        });
    });

});