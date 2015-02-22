var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient
var cache = module.exports;
var Promise = require("bluebird");
var moment = require('moment');

cache.hash = function(sourceCode) {
  return crypto.createHash('md5').update(sourceCode).digest('hex');
}

cache.init = function(cb) {
  var connectionString;
  if (process.env.MONGOLAB_URI) {
    connectionString = process.env.MONGOLAB_URI;
  } else {
    try {
      connectionString = require('../config').mongo
    }
    catch(e) {};
  }
  MongoClient.connect(connectionString, function(err, db) {
    if (err) {
      console.error('cannot estabilish connection to mongodb');
      process.exit();
    } else {
      console.log('connection to mongo was estabilished');
      db.checks = db.collection('checks');
      cb(db);
    }
  });
}

cache.get = function (db: any, key: string, funcToBeCached: Function) {
  return new Promise(function (resolve, reject) {
    db.checks.findOne({hash: key}, (err, foundResult) => {
      if (err) {
        reject(err);
      } else {
        console.log('foundResult for:', key, (foundResult && foundResult.version ? foundResult.version : 'without version'));
        //console.log('version', moment(foundResult.version), moment(foundResult.version).isBetween(moment().subtract('1', 'weeks'), moment()));
        if(foundResult &&
            (
              (funcToBeCached && foundResult.version && moment(foundResult.version).isBetween(moment().subtract('1', 'weeks'), moment()))
              || !funcToBeCached
            )
          ) {
          cache.addView(db, key);
          resolve(foundResult);
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
    console.log('cache.put', toCache);
    toCache.hash = key;
    db.checks.update(
      { hash: key },
      toCache,
      { upsert: true},
      (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(toCache);
      }
    });
  });
}

cache.addView = function(db, key) {
  db.checks.update({ hash: key}, {$inc: {views: 1}}, function() {});
}
