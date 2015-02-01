var assert = require('assert');
var check = require('../app/server.compiled/flow_check');

describe('Version', function(){
  it('should return version', function(done){
    check.version(function(err, version) {
      assert.equal(version.indexOf('version') > -1, true);
      done();
    })
  })
});
