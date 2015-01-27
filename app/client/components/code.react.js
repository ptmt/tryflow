var ace = require('brace');
var React = require('react');
require('brace/theme/github');
require('brace/mode/typescript');

module.exports = React.createClass({
  componentDidMount() {
    this.editor = ace.edit(this.props.name);
    this.editor.getSession().setMode('ace/mode/typescript');
    this.editor.setTheme('ace/theme/github');
    this.editor.setValue(this.props.source);
    this.editor.clearSelection();
    this.editor.on('change', (e) => {
      if (this.editor.curOp && this.editor.curOp.command.name) {
        this.props.onChange(this.editor.getValue());
        console.log(e, "user change");
      }
    });
    this.editor.setReadOnly(this.props.readOnly);

    window.editor = this.editor;
  },
  render() {
    return (<div id={this.props.name} className="codearea"></div>);
  },
  componentWillReceiveProps(p) {
    if (p.source != this.props.source) {
      this.editor.setValue(p.source);
      this.props.onChange(p.source);
    }
    this.setErrors(p.errors);
  },

  setErrors(errors) {
    // tupes = info, warning, error
    this.editor.getSession().setAnnotations(errors);
  }
});
