/* @flow */

var React = require('react');
var Main = require('./components/main.react.js');

//Needed for React Developer Tools
window.React = React;

var hash = window.location.hash || '53f7b9797427a8d193b08565780fbb96';
console.log(hash);
React.render(<Main hash={hash}/>, document.body);
