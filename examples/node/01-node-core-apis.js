/* @flow */
var a = parseInt("100", "10")
setTimeout(() => {}, "100") /// number

var date = new Date();
var str = date.getDate() + "string"

var watman = Array(16).join(1) + 'Batman!'

var fs = require('fs');
fs.readFileSync(1)

declare module 'some' { /// any
    declare function my(s: string):string; /// any
} /// any
 /// any
var some = require('some')
 /// any
some.my(1)
