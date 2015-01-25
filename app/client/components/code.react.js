var ace = require('brace');
var React = require('react');
require('brace/theme/github');
require('brace/mode/typescript');

module.exports = React.createClass({
  componentDidMount: function() {
    this.editor = ace.edit(this.props.name);
    this.editor.getSession().setMode('ace/mode/typescript');
    this.editor.setTheme('ace/theme/github');
    this.editor.setValue(this.props.source);
    this.editor.clearSelection();
  },
  render: function() {
    return (<div id={this.props.name} className="codearea"></div>);
  },
  componentWillReceiveProps: function (p) {
    this.editor.setValue(p.source);
  }
});
