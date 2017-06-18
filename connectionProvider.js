const MongoClient = require('mongodb').MongoClient;
const connectionUrl = 'mongodb://localhost:27017/Statistics';

exports.insertOneInCollection = function(collection, data) {
    const clientPromise = MongoClient.connect(connectionUrl);
    clientPromise.then(db => {
        db.collection(collection).insertOne(data);
        db.close();
    });
};