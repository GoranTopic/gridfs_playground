const mongodb = require('mongodb');
const Grid = require('gridfs-stream');

class GridFSStorage {
    constructor(db, collectionName = 'fs') {
        this.db = db;
        this.collectionName = collectionName;
        this.grid = Grid(this.db, mongodb);
    }

    storeFile(filePath, fileName, callback) {
        const readStream = require('fs').createReadStream(filePath);
        const writeStream = this.grid.createWriteStream({
            filename: fileName
        });

        readStream.pipe(writeStream);

        writeStream.on('close', file => {
            callback(null, file);
        });

        writeStream.on('error', err => {
            callback(err);
        });
    }

    readFile(fileName, callback) {
        const readStream = this.grid.createReadStream({ filename: fileName });

        readStream.on('error', err => {
            callback(err);
        });

        readStream.pipe(require('fs').createWriteStream(fileName)).on('close', () => {
            callback(null, fileName);
        });
    }
}

module.exports = GridFSStorage;

