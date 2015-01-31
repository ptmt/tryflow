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
      db.checks = db.collection('checks');
      cb(db);
    }
  });
}

cache.get = function (db     , key        , funcToBeCached          ) {
  return new Promise(function (resolve, reject) {
    db.checks.findOne({hash: key}, function(err, result)  {
      console.log(err, result);
      if (err) {
        reject(err);
      } else {
        if(result) {
          cache.addView(db, key);
          resolve(result);
        } else {
          if (funcToBeCached) {
            funcToBeCached()
              .then(function(toCache)  {return cache.put(db, key, toCache);})
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
    toCache.hash = key;
    db.checks.insert(toCache, function(err)  {
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
