/* @flow */
var React = require('react');
var mui = require('material-ui');
var request = require('../request');
var Spinner = require('./spinner.react');
var Code = require('./code.react');
var utils = require('../utils');

/// WOW, that's a lot of stuff!
var Input = mui.Input;
var Paper = mui.Paper;
var DropDownMenu = mui.DropDownMenu;
var IconButton = mui.IconButton;
var Icon = mui.Icon;
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var Toggle = mui.Toggle;
var Ace = require('brace');


var Main = React.createClass({

  getInitialState() {
    return { source: 'function length (a) {\n  return a.length;\n}\na(1);', loading: false, errors: [], target: ''};
  },

  updateOutput(sourceCode) {
    var startTime = new Date();
    this.setState ({ loading: true});
    request.post('/flow_check', {source: sourceCode }, (err, res) => {
      if (err) {
        this.setState ({ loading: false, target: err});
      } else {
        this.setState ({ loading: false, source: this.state.source, errors: res.errors, target: res.target});
      }
    });
  },

  render() {

    var examples = require('../examples.js');
    return (
      <div>

        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <DropDownMenu menuItems={examples} onChange={this._handleExamples}/>
          </ToolbarGroup>

          <ToolbarGroup key={1} float="right">
            <a href="https://github.com/unknownexception/tryflow"><Icon icon="mui-icon-github" /></a>
            <span className="mui-toolbar-separator">&nbsp;</span>
            <RaisedButton label="flow check" primary={true} onClick={this._handleTouchTap} />
          </ToolbarGroup>
        </Toolbar>

        <div className="raw-code-area">
          <Paper zDepth={5} >
            <Code ref="sourceEditor" source={this.state.source} name="source-editor" onChange={this._onChange} errors={this.state.errors}/>
          </Paper>
        </div>
        <div className="output-area">
          <Paper zDepth={5} >
            <Code ref="target" source={this.state.target} name="target-editor" readOnly="true" />
          </Paper>
        </div>

        <Spinner visible={this.state.loading} />

      </div>
    );
  },

  componentDidMount() {
    this.updateOutput(this.state.source);
  },

  _onChange(value) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.updateOutput(value);
    }, 2000);
  },

  _handleTouchTap() {
    this.updateOutput(this.state.source);
  },

  _handleExamples(e, key, payload) {
    this.setState({source: payload.payload, loading: true});
  }

});

module.exports = Main;
