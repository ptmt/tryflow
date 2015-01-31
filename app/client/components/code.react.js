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
    this.editor.blur()
    this.editor.clearSelection();
    this.editor.on('change', (e) => {
      if (this.editor.getValue() != this.props.source && this.props.onChange) {
        this.props.onChange(this.editor.getValue());
      }
    });
    if (this.props.readOnly) {
      this.editor.setReadOnly(true);
      this.editor.setHighlightActiveLine(false);
    }

    window.editor = this.editor;
  },
  render() {
    return (<div id={this.props.name} className="codearea"></div>);
  },
  componentWillReceiveProps(p) {
    if (p.source != this.editor.getValue()) {
      this.editor.setValue(p.source, 1);
      this.editor.blur();
    }
    this.setErrors(p.errors);
  },

  setErrors(errors) {
    // types = info, warning, error
    this.editor.getSession().setAnnotations(errors);
  }
});
