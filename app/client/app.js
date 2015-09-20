/* @flow */

var React = require('react');
var Main = require('./components/main.react.js');
var injectTapEventPlugin = require("react-tap-event-plugin")

// needed for React Developer Tools
window.React = React;
// needed before React 1.0
injectTapEventPlugin();

var hash = window.location.hash || 'b4b8d8e1a254ebfc2bd5b5d7af4a8ac6';
React.render(<Main hash={hash}/>, document.querySelector('.body'));
