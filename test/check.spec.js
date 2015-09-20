var assert = require('assert');
var check = require('../app/server/flow_check');
var fs = require('fs');

// TODO: replace with files

describe('Error transformer', function(){
  it('should return empty array if no errors occured', function(){
    var errors = check.transformErrors({ passed: true});
    assert.deepEqual(errors, []);
  })
  it.only('should wrap source code with 1 error', function(){
    var oneErrorJson = {errors: [{ message:
     [ { descr: 'property `length`',
         level: 'error',
         path: '-',
         line: 2,
         endline: 2,
         start: 8,
         end: 15 },
       { descr: 'Error:',
         level: 'error',
         path: '',
         line: 0,
         endline: 0,
         start: 1,
         end: 0 },
       { descr: 'property `length`',
         level: 'error',
         path: '-',
         line: 2,
         endline: 2,
         start: 10,
         end: 15 },
       { descr: 'Property not found in',
         level: 'error',
         path: '',
         line: 0,
         endline: 0,
         start: 1,
         end: 0 },
       { descr: 'Number',
         level: 'error',
         path: '/private/tmp/flow/flowlib_26511303/core.js',
         line: 70,
         endline: 87,
         start: 1,
         end: 1 } ] }]};

    var errors = check.transformErrors(oneErrorJson);
    console.log(errors);
    assert.deepEqual(errors, [{"type": "error", "row":1,"columnStart":9,"columnEnd": 14, "text":"property `length`\n\t\tProperty not found in\n\t\tNumber"}]);
  })
  it('should wrap source code with 2 errors', function(){
    var twoErrorsJson = {
      "passed":false,
      "errors":
        [{"message":[
          {"descr":"property length\nProperty not found in","code":0,"path":"-","line":2,"endline":2,"start":10,"end":17},
          {"descr":"Number","code":0,"path":"/private/var/folders/tp/ffwbqwn51dd1zgb9pb8j4g7w0000gn/T/flow_potomushto/flowlib_245e94b3/lib/core.js","line":58,"endline":69,"start":1,"end":1}]}],
          "version":" Nov 26 2014 16:57:27"
    }
    assert.deepEqual(
      check.transformErrors(twoErrorsJson),
      [{"row":1,"column":9,"text":"property length\n\t\tProperty not found in\n\t\tNumber","type":"error"}]);
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
          columnStart: 9,
          text: 'property length\nProperty not found in\n  Number',
          type: 'error' } ]);
  })
});

describe('autocomplete', function() {
  this.timeout(10000);
  it('should return suggestions', function(done){
    var errors = check.autocompleteFor(fs.readFileSync(__dirname + '/mock/autocomplete.js'), 14, 3)
      .then(function(data) {
        console.log(data);
        assert.equal(data.length > 1, true);
        done();
      }).catch(function(err) {
        done(err);
      });

  })
});

var sourceCode = "function length (a) {\n return a.length;\n}\nlength(1);\nvar c;\nlength(c);"
