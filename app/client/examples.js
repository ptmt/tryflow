// TODO: add caching, add storing in keyvalue storage
module.exports = [
  { payload: 'function length (a) {\n  return a.length;\n}\na(1);', text: '01 - Hello world' },
{ payload:
'function length(x) {\n\
  if (x) {\n\
    if (typeof x === \'string\')\n\
    {\n\
      return x.length;\n\
    }\n\
    return x\n\
  } else {\n\
    return 0;\n\
  }\n\
}\n\
  \n\
var a, b = 10;\n\
var total = length("Hello") + length(a) + length(b);', text: '02 - Dynamic' },
  { payload:
'function withNumber(a: number) {\n\
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
', text: '03 - Type Annotations' },
{ payload:
'var exec = require(\'child_process\').exec;\n\
exec(1);\n\
exec(\'command\');\n\
exec(\'command\', {}, (err, stdout, stderr) => {\n\
  stdout.read();\n\
});', text: '04 - Modules'
}
]
