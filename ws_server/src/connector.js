'use strict'

//Import the mongoose module
var mongoose = require('mongoose');

class MongoEndpoint {

    constructor(options) {
        if (options) {
            this._options = options;
        } else {
            this.setHostname('localhost');
            this.setPort('27017');
            this.setCollection('nodejs');
        }
    }

    buildOptions() {
        if (this._options == undefined) {
            this._options = {}
        }
    }

    setPersistenceEnabled(status) {
        this.buildOptions();
        this._options.persistence = status;
    }

    setHostname(name) {
        this.buildOptions();
        this._options.hostname = name;
    }

    setPort(port) {
        this.buildOptions();
        this._options.port = port;
    }

    setCollection(name) {
        this.buildOptions();
        this._options.collectionName = name;
    }

    start() {
        if (this._options.persistence) {
            console.log("Persistence enabled!");
            //persistence enabled
            //Set up default mongoose connection
            var mongoDB = 'mongodb://' + this._options.hostname + ':' + this._options.port + '/' + this._options.collection;
            mongoose.connect(mongoDB, {
                useMongoClient: true
            });
            mongoose.Promise = global.Promise;
            //Get the default connection
            var db = mongoose.connection;

            //Bind connection to error event (to get notification of connection errors)
            db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        }
        else{
            console.log("Persistence disabled!");
        }
    }
}

exports.MongoEndpoint = MongoEndpoint;