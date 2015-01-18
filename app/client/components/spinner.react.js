/* @flow */
var React = require('react');

var Spinner = React.createClass({
  render: function() {
    var style = {};
    if (!this.props.visible) {
      style.display = 'none'
    }

    return(
      <div className="loader" style={style}>
        <svg className="circular">
        <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" stroke-miterlimit="10"/>
        </svg>
      </div>
    );
  }
});
module.exports = Spinner;
