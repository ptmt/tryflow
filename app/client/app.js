/* @flow */

var React = require('react');
var Main = require('./components/main.react.js');

//Needed for React Developer Tools
window.React = React;

var hash = window.location.hash || '325911623be1511317876918418feab6';
React.render(<Main hash={hash}/>, document.body);
