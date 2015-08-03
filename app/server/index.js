/* @flow */
var express = require('express');
var morgan = require('morgan');
var app = express();
var flowCheck = require('./flow_check');
var cache = require('./cache');
var bodyParser = require('body-parser');
var beautify = require('js-beautify').js_beautify;
var babel = require("babel-core");
//var reactTools = require('react-tools');

function errorHandler(err, req, res, next) {
  res.status(500).json('Unexpected error, please try again');
}

function flowES6toES5(code: string) {
  try {
    return beautify(
      babel.transform(code, {
      }).code, {
        indent_size: 4
    });
  } catch (e) {
    console.log('transform exception:', e);
    return JSON.stringify(e);
  }
}

function fillCache(code: string) {
  return flowCheck(code)
    .then((gotErrors) => {
      return {
        views: 1,
        source: code,
        target: flowES6toES5(code),
        errors: flowCheck.transformErrors(gotErrors),
        version: gotErrors.version,
        created_at: new Date(),
        updated_at: new Date()
      }
  });
}

app.use(morgan('dev'));

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  var devServer = require('./webpack');
  // use webpack dev server for serving js files
  app.use('/scripts', function (req, res) {
    res.redirect = function(to) {
      res.writeHead(302, {
        'Location': to,
        'Content-Length': '0'
      });
      res.end();
    }
    res.redirect('http://localhost:3001' + req._parsedUrl.path);
  });
}
app.use(express.static('./dist', {}));



app.use(bodyParser.json());

app.post('/load_code', function (req, res) {
  cache
  .get(app.db, req.body.hash)
  .then((fromCache) => {
    if (fromCache.source !== 'Not found') {
      cache.get(app.db, req.body.hash, () => fillCache(fromCache.source))
      .then((fromCache) => res.json(fromCache));
    } else {
      res.json(fromCache)
    }
  });
});

app.post('/flow_check', function (req, res) {
  cache
    .get(app.db, cache.hash(req.body.source), () => fillCache (req.body.source))
    .then((fromCache) => res.json(fromCache));
});

app.post('/autocomplete', function (req, res) {
  flowCheck
    .autocompleteFor(req.body.source, req.body.row, req.body.col)
    .then(suggestions => res.json(suggestions))
    .catch(err => res.status(500).json('no result, error' + JSON.stringify(err)));
});

app.get('/flow_version', function (req, res) {
  flowCheck.version()
//  .then(version => flowCheck.reactVersion(version))
  .then((version) => {
    flowCheck.availableVersion().then((availableVersion) => {
      if (availableVersion !== version) {
        flowCheck.installNewVersion();
        res.json({version: version + ' (installing ' + availableVersion + ' in background...)', react: versions[0]})
      } else {
        res.json({version: version})
      }
    })
  })

});

app.use(errorHandler);

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address
  var port = server.address().port
  cache.init((db) => app.db = db);
  console.log('app listening at http://%s:%s', host, port)
});
