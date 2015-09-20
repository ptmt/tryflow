/* @flow */
//
// It's lint-free on http://jshint.com,
// http://eslint.org/demo/ and TypeScript Playground
// Type inference helps Flow to show this error
// without additional type annotations
//

function length(x) {
  return x.length;
}

let a = '10';
var b = '10'
if (10 > 7) {
    let a = 'anotherString';
    b = 'anotherString'
}
length(a)
length(b)
