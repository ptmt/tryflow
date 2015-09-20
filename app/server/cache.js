/* @flow */
var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient
var cache = module.exports;
var Promise = require("bluebird");
var moment = require('moment');

cache.hash = function(sourceCode: string) {
  return crypto.createHash('md5').update(sourceCode).digest('hex');
}

cache.init = function(cb: Function) {
  var connectionString;
  if (process.env.MONGOLAB_URI) {
    connectionString = process.env.MONGOLAB_URI;
  } else {
    throw new Error('Please set MONGOLAB_URI')
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
        if(foundResult &&
            (
              (funcToBeCached && foundResult.version && moment(foundResult.version, "YYYY MM DD HH:MM:SS").isBetween(moment().subtract('1', 'weeks'), moment()))
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

cache.put = function(db: any, key: string, toCache: any) {
  return new Promise(function (resolve, reject) {
    //console.log('cache.put', toCache);
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

cache.addView = function(db: any, key: string) {
  db.checks.update({ hash: key}, {$inc: {views: 1}}, function() {});
}
