/* @flow */

var Request = require('./request');

type FlowCheckResult = {
  errors: Array<any>;
  target: string;
  hash: string;
}

class FlowRequest extends Request<FlowCheckResult> {};

class VersionRequest extends Request<string> {};

class AutocompletionRequest extends Request<Array<any>> {};

// TODO: rewrite with promises?
module.exports = {
  flowCheck: function(sourceCode: string, callback: Function) {
    Request.post('/flow_check', { source: sourceCode }, callback);
  },
  loadByHash: function(hash: string, callback: Function) {
    Request.post('/load_code', { hash: hash.replace('#','') }, callback);
  },
  getVersion: function(callback: Function) {
    Request.getJson('/flow_version', callback);
  },
  getAutocompletion: function(source:string, row:number, col:number, callback:Function) {
    Request.post('/autocomplete', { source: source, row: row, col: col}, callback)
  }
}
