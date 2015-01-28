var express = require('express');
var app = express();
var check = require('./flow_check');
var bodyParser = require('body-parser');
var beautify = require('js-beautify').js_beautify;
var reactTools = require('react-tools');

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function flowES6toES5 (code) {
  return beautify(
    reactTools.transform(code, {
      harmony: true,
      stripTypes: true
    }), {
      indent_size: 4
  });
}

app.use(express.static('./dist', {}));
app.use(bodyParser.json());
app.use(clientErrorHandler);
app.use(errorHandler);

app.post('/flow_check', function (req, res) {
  check(req.body.source, (errors) => {
    res.json({
      target: flowES6toES5(req.body.source),
      errors: check.transformErrors(errors)
    });
  });
});

// var exec = require('child_process').exec;
// exec('flow server');

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('app listening at http://%s:%s', host, port)

});
