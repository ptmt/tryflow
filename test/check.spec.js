var assert = require('assert');
var check = require('../app/server/flow_check');

// TODO: replace with files

describe('Wrapper', function(){
    it('should return source code as is if no errors occured', function(){
      var sourceCode = "function length (a) {\n  return a.length;\n}\na(1);";
      var wrappedCode = check.wrap(sourceCode, { passed: true});
      assert.equal(wrappedCode, sourceCode);
    })
    it('should wrap source code with 1 error', function(){
      var sourceCode = "function length (a) {\n  return a.length;\n}\na(1);";
      var oneErrorJson = {"passed":false,"errors":
      [{"message":[{"descr":"identifier a\nUnknown global name","code":0,"path":"-","line":4,"endline":4,"start":1,"end":1}]}]
      ,"version":" Nov 26 2014 16:57:27"}

      var wrappedCode = check.wrap(sourceCode, oneErrorJson);
      assert.equal(wrappedCode, 'function length (a) {\n  return a.length;\n}\n<span class=\"error\"><span class="tip">identifier a\nUnknown global name</span>a</span>(1);');
    })
    it('should wrap source code with 2 errors', function(){
      var sourceCode2 = "function length (a) {\n  return a.length;\n}\nlength(1);";
      var twoErrorsJson = {"passed":false,"errors":
      [{"message":[
    {"descr":"property length\nProperty not found in","code":0,"path":"-","line":2,"endline":2,"start":10,"end":17},
  {"descr":"Number","code":0,"path":"/private/var/folders/tp/ffwbqwn51dd1zgb9pb8j4g7w0000gn/T/flow_potomushto/flowlib_245e94b3/lib/core.js","line":58,"endline":69,"start":1,"end":1}]}],"version":" Nov 26 2014 16:57:27"}

      var wrappedCode = check.wrap(sourceCode2, twoErrorsJson);
      assert.equal(wrappedCode, 'function length (a) {\n  return <span class="error"><span class="tip">property length\nProperty not found in\n<strong>Number</strong></span>a.length</span>;\n}\nlength(1);');
    })
    it('should wrap source code with 2 united errors', function(){
      var sourceCode = "function length (a) {\n return a.length;\n}\nlength(1);\nvar c;\nlength(c);";
      var twoErrorsJson = {"passed":false,"errors":[{"message":[{"descr":"property length\nProperty cannot be accessed on possibly undefined value","code":0,"path":"-","line":2,"endline":2,"start":10,"end":17},{"descr":"undefined","code":0,"path":"-","line":6,"endline":6,"start":8,"end":8}]},{"message":[{"descr":"property length\nProperty not found in","code":0,"path":"-","line":2,"endline":2,"start":10,"end":17},{"descr":"Number","code":0,"path":"/private/var/folders/tp/ffwbqwn51dd1zgb9pb8j4g7w0000gn/T/flow_potomushto/flowlib_2b52d733/lib/core.js","line":58,"endline":69,"start":1,"end":1}]}],"version":" Nov 26 2014 16:57:27"}
        var wrappedCode = check.wrap(sourceCode, twoErrorsJson);
        assert.equal(wrappedCode, 'function length (a) {\n return a<span class="error"><span class="tip">property length\nProperty cannot be accessed on possibly undefined value\n<strong>undefined</strong>\nproperty length\nProperty not found in\n<strong>Number</strong></span>.length;\n}\nlength(1);\nvar c;\nlength(c);');
      })
})

var sourceCode = "function length (a) {\n return a.length;\n}\nlength(1);\nvar c;\nlength(c);"
