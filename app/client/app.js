/* @flow */

var React = require('react');
var Main = require('./components/main.react.js');
var injectTapEventPlugin = require("react-tap-event-plugin")

// needed for React Developer Tools
window.React = React;
// needed before React 1.0
injectTapEventPlugin();

var hash = window.location.hash || '325911623be1511317876918418feab6';
React.render(<Main hash={hash}/>, document.body);
