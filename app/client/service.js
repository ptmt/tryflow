/* @flow */

var Request = require('./request');

type FlowCheckResult = {
  errors: Array<any>;
  target: string;
  hash: string;
}

class FlowRequest extends Request<FlowCheckResult> {};

class VersionRequest extends Request<string> {};

// TODO: rewrite with promises?
module.exports.flowCheck = function(sourceCode, callback) {
  FlowRequest.post('/flow_check', { source: sourceCode }, callback);
}

module.exports.loadByHash = function(hash, callback) {
  FlowRequest.post('/load_code', { hash: hash.replace('#','') }, callback);
}


module.exports.getVersion = function(callback) {
  VersionRequest.getJson('/flow_version', callback);
}
