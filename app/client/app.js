/* @flow */

var React = require('react');
var Main = require('./components/main.react.js'); // Our custom react component

//Needed for React Developer Tools
window.React = React;

React.render(<Main />, document.body);
