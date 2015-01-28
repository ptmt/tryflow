var assert = require('assert');
var check = require('../app/server/flow_check');

// TODO: replace with files

describe('Error transformer', function(){
    it('should return empty array if no errors occured', function(){
      var errors = check.transformErrors({ passed: true});
      assert.equal(errors.length, 0);
    })
    it('should wrap source code with 1 error', function(){
      var oneErrorJson = {"passed":false,"errors":
      [{"message":[{"descr":"identifier a\nUnknown global name","code":0,"path":"-","line":4,"endline":4,"start":1,"end":1}]}]
      ,"version":" Nov 26 2014 16:57:27"}

      var errors = check.transformErrors(oneErrorJson);
      assert.deepEqual(errors, [{"row":3,"column":0,"text":"identifier a\nUnknown global name","type":"error"}]);
    })
    it('should wrap source code with 2 errors', function(){
      var twoErrorsJson = {"passed":false,
      "errors":
          [{"message":[
            {"descr":"property length\nProperty not found in","code":0,"path":"-","line":2,"endline":2,"start":10,"end":17},
            {"descr":"Number","code":0,"path":"/private/var/folders/tp/ffwbqwn51dd1zgb9pb8j4g7w0000gn/T/flow_potomushto/flowlib_245e94b3/lib/core.js","line":58,"endline":69,"start":1,"end":1}]}],
      "version":" Nov 26 2014 16:57:27"}
      assert.deepEqual(
        check.transformErrors(twoErrorsJson),
        [{"row":1,"column":9,"text":"property length\nProperty not found in\n  Number","type":"error"}]);
    })
    it('should wrap source code with 2 united errors', function(){
      var twoErrorsJson = {"passed":false,
        "errors":
          [{"message":[
            {"descr":"property length\nProperty cannot be accessed on possibly undefined value","code":0,"path":"-","line":2,"endline":2,"start":10,"end":17},
            {"descr":"undefined","code":0,"path":"-","line":6,"endline":6,"start":8,"end":8}]},
          {"message":[
            {"descr":"property length\nProperty not found in","code":0,"path":"-","line":2,"endline":2,"start":10,"end":17},
            {"descr":"Number","code":0,"path":"/private/var/folders/tp/ffwbqwn51dd1zgb9pb8j4g7w0000gn/T/flow_potomushto/flowlib_2b52d733/lib/core.js","line":58,"endline":69,"start":1,"end":1}
          ]}],"version":" Nov 26 2014 16:57:27"}

        assert.deepEqual(check.transformErrors(twoErrorsJson), [ { row: 1,
          column: 9,
          text: 'property length\nProperty cannot be accessed on possibly undefined value\n  undefined',
          type: 'error' },
          { row: 1,
            column: 9,
            text: 'property length\nProperty not found in\n  Number',
            type: 'error' } ]);
    })
})

var sourceCode = "function length (a) {\n return a.length;\n}\nlength(1);\nvar c;\nlength(c);"
