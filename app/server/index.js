var express = require('express');
var app = express();
var flowCheck = require('./flow_check');
var cache = require('./cache');
var bodyParser = require('body-parser');
var beautify = require('js-beautify').js_beautify;
var reactTools = require('react-tools');

function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(500).json('Unexpected error, please try again');
}

function flowES6toES5(code) {
  try {
    return beautify(
      reactTools.transform(code, {
        harmony: true,
        stripTypes: true
      }), {
        indent_size: 4
    });
  } catch (e) {
    console.log('transform exception:', e);
    return JSON.stringify(e);
  }
}

function fillCache(code) {
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
    .catch(err => res.status(500).json('no result, error'));
});

app.get('/flow_version', function (req, res) {
  flowCheck.version((err, version) => {
    flowCheck.availableVersion().then((availableVersion) => {
      if (availableVersion !== version) {
        flowCheck.installNewVersion();
        res.json({err: err, version: version + ' (installing ' + availableVersion + ' in background...)'})
      } else {
        res.json({err: err, version: version})
      }
    }).catch((err) => {
      res.json({err: err, version: version});
    });
  });

});

app.use(errorHandler);

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address
  var port = server.address().port
  cache.init((db) => app.db = db);
  console.log('app listening at http://%s:%s', host, port)
});
