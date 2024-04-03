var MongoClient = require('mongodb').MongoClient
var GridFSBucket = require('mongodb').GridFSBucket
var fs = require('fs')
var test = require('assert');

const url = 'mongodb://0.0.0.0:27017'
// Database Name
const dbName = 'myProject';

const client = new MongoClient(url);

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);

  var bucket = new GridFSBucket(db);
  // create readstream
  var readStream = fs.createReadStream('./file.pdf');
  var uploadStream = bucket.openUploadStream('test.dat');

  var license = fs.readFileSync('./file.pdf');
  var id = uploadStream.id;

  // Wait for stream to finish
  uploadStream.once('finish', function() {
    console.log('upload finished')
  });
  	
  uploadStream.on('data', data => { console.log('data', data) });

  //const collection = db.collection('documents');

  // the following code examples can be pasted here...

  console.log('piping stream')
  readStream.pipe(uploadStream);

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());/*

MongoClient.connect(url, function(err, db) {
	  console.log('this callback ran')

  db.dropDatabase(function(error) {
    test.equal(error, null);

    var bucket = new GridFSBucket(db);
    var readStream = fs.createReadStream('./file.pdf');

    var uploadStream = bucket.openUploadStream('test.dat');

    var license = fs.readFileSync('./file.pdf');
    var id = uploadStream.id;

    // Wait for stream to finish
    uploadStream.once('finish', function() {
      console.log('upload finished')
      var chunksColl = db.collection('fs.chunks');
      var chunksQuery = chunksColl.find({ files_id: id });

      // Get all the chunks
      chunksQuery.toArray(function(error, docs) {
        test.equal(error, null);
        test.equal(docs.length, 1);
        test.equal(docs[0].data.toString('hex'), license.toString('hex'));

        var filesColl = db.collection('fs.files');
        var filesQuery = filesColl.find({ _id: id });
        filesQuery.toArray(function(error, docs) {
          test.equal(error, null);
          test.equal(docs.length, 1);

          var hash = crypto.createHash('md5');
          hash.update(license);
          test.equal(docs[0].md5, hash.digest('hex'));

          // make sure we created indexes
          filesColl.listIndexes().toArray(function(error, indexes) {
            test.equal(error, null);
            test.equal(indexes.length, 2);
            test.equal(indexes[1].name, 'filename_1_uploadDate_1');

            chunksColl.listIndexes().toArray(function(error, indexes) {
              test.equal(error, null);
              test.equal(indexes.length, 2);
              test.equal(indexes[1].name, 'files_id_1_n_1');
            });
          });
        });
      });
    });
    console.log('piping stream')
    readStream.pipe(uploadStream);
  });
});
*/
