var assert = require('assert');
var check = require('../app/server.compiled/flow_check');

describe('Version', function(){
  it('should return version', function(done){
    check.version().then(function(version) {
      var ver = new RegExp("\d*\.\d*\.\d*")
      assert.equal(ver.test(version), true);
      done();
    })
  })
});
