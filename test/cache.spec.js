var assert = require('assert');
var cache = require('../app/server/cache');

describe('Cache', function(){
  it('should be able to hash text', function(){
    this.timeout(15000);
    var hash = cache.hash('test code')
    assert.equal(hash, '23c532e733119087de256a1e8b519853');
    var hash = cache.hash('function withNumber(a: number) {\n\
      return a;\n\
    }\n\
    \n\
    withNumber(new Date());\n\
    function withMaybeNumber(a: ?number) {\n\
      return a;\n\
    }\n\
    \n\
    var b = null;\n\
    withMaybeNumber(b); // no errors\n\
    withMaybeNumber(); // error\n\
    \n\
    function withOptionalNumber(a?: number) {\n\
      return a\n\
    }\n\
    withOptionalNumber();\n\
    withOptionalNumber(1);\n\
    \n\
    type typeExample = {\n\
      a: string;\n\
      b: number;\n\
      c(arg: number): string;\n\
    }\n\
    // ECMAScript 6 Destructing assigment\n\
    function destructing({a, b, c}: typeExample) {\n\
      c(b);\n\
    }\n\
    \n\
    destructing({a: \'string\', b: \'1\', c: () => \'callback here\' });\n\
    ')
    assert.equal(hash, '3c27f96f2a09a1b3e13f08e29f743738');
  })
});
