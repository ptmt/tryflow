var assert = require('assert');
var check = require('../app/server/flow_check');

describe('Version', function(){
  it('should return version', function(done){
    check.version().then(function(version) {
      var ver = new RegExp("\d*\.\d*\.\d*")
      assert.equal(ver.test(version), true);
      done();
    })
  })
});


describe('Flow check', function(){
  it('should return json output for simple code', function(done) {
    var sourceCode = [
      'function test(a) {',
      'return a.length',
      '}',
      'test(1)',
      'test()'
    ].join('\n');

    check(sourceCode).then(res => {
      var totalMessages = 0;

      res.errors.forEach(error => {
        console.log('ERROR', error);
      })

      const messages = res.errors.map(error => error.message.length);

      assert.equal(JSON.stringify(messages), '[5,5]');
      done();
    })
  })
});
