var ace = require('brace');
var React = require('react');
var service = require('../service');
require('brace/theme/xcode');
require('brace/mode/jsx');

module.exports = React.createClass({
  componentDidMount() {
    this.editor = ace.edit(this.props.name);
    this.editor.getSession().setMode('ace/mode/jsx');
    this.editor.setTheme('ace/theme/xcode');
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
    } else {
      this.autocompleteEnable();
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
    if (!errors) {
      return false;
    }
    const session = this.editor.getSession();
    session.setAnnotations(errors);
    Object.keys(session.$backMarkers).forEach(r => session.removeMarker(r))
    //console.log(this.editor.getSession().$backMarkers);
    var Range =  ace.acequire("ace/range").Range
    errors.forEach(error => {
      session.addMarker(
        new Range(error.row, error.column, error.row, error.columnEnd + 1), 'ace_highlight-marker', 'background'
      );
    })
  },

  hideErrors() {
    this.editor.getSession().clearAnnotations();
  },

  autocompleteEnable() {
    require("brace/ext/language_tools");
    var langTools = ace.acequire("ace/ext/language_tools");
    this.editor.setOptions({
      enableBasicAutocompletion: false,
      //enableSnippets: true,
      enableLiveAutocompletion: true
    });

    var flowCompleter = {
        getCompletions: function(editor, session, pos, prefix, callback) {
            if (prefix.length === 0) { callback(null, []); return }
            service.getAutocompletion(editor.getValue(), pos.row, pos.column, function(err, data) {
                if (err || data.length === 0) {
                  callback(null, []); return;
                }
                callback(null, data.map(function(ea) {
                  if (ea.func_details) {
                    ea.func_details.p = ea.func_details.params.map(p => p.name + ' : ' + (p.type || 'any')).join(', ');
                  }
                  var typeSignature = ea.type ? ea.type : (ea.func_details ? '(' + ea.func_details.p + ') => ' + (ea.func_details.return_type || 'any') : '');
                  return {caption: ea.name, value: ea.name, meta: typeSignature}
                }));
              });
        }
    }
    this.editor.completers = [flowCompleter];
  }
});
