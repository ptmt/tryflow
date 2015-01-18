/* @flow */
type Callback <T> = (err: ?string, data? : T) => void;

module.exports.post = function<T>(url: string, data: string, callback: Callback<T> ) {
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  request.onload = function() {
    if (request.status === 200) {
      var json = JSON.parse(request.responseText);
      if (json.error) {
        return callback(json.error);
      }
      callback(null, json);
    } else {
      // We reached our target server, but it returned an error
      callback('error:' + request.responseText);
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    callback('error');
  };

  request.send(JSON.stringify(data));
}
