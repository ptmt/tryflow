var express = require('express')
var app = express()

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

app.use(express.static('./app/public', {}));
app.use(clientErrorHandler);
app.use(errorHandler);

app.get('/gettypes', function (req, res) {
  res.send('Hello World!')
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('app listening at http://%s:%s', host, port)

});
