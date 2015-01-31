var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient
var cache = module.exports;
var Promise = require("bluebird");

cache.hash = function(sourceCode) {
  return crypto.createHash('md5').update(sourceCode).digest('hex');
}

cache.init = function(cb) {
  var connectionString = process.env.MONGOLAB_URI || require('../config').mongo;
  MongoClient.connect(connectionString, function(err, db) {
    if (err) {
      console.error('cannot estabilish connection to mongodb');
      process.exit();
    } else {
      console.log('connection to mongo was estabilished');
      cb(db);
    }
  });
}

cache.get = function (db: any, key: string, funcToBeCached: Function) {
  return new Promise(function (resolve, reject) {
    var collection = db.collection('checks');
    collection.findOne({hash: key}, (err, result) => {
      console.log(err, result);
      if (err) {
        reject(err);
      } else {
        if(result) {
          resolve(result);
        } else {
          if (funcToBeCached) {
            funcToBeCached()
              .then(toCache => cache.put(db, key, toCache))
              .then(resolve);
          } else {
            resolve ({source: 'Not found'});
          }
        }
      }
    });
  });
}

cache.put = function(db, key, toCache) {
  return new Promise(function (resolve, reject) {
    var collection = db.collection('checks');
    toCache.hash = key;
    collection.insert(toCache, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(toCache);
      }
    });
  });
}
