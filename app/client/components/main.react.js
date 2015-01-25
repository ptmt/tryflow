/* @flow */
var React = require('react');
var mui = require('material-ui');
var request = require('../request');
var Spinner = require('./spinner.react');
var Code = require('./code.react');
var utils = require('../utils');

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

  getInitialState: function() {
    return { source: 'function length (a) {\n  return a.length;\n}\na(1);', loading: false, target: ''};
  },

  updateOutput: function(sourceCode) {
    this.setState ({ loading: true, target: this.state.target});
    request.post('/flow_check', {source: utils.escape(sourceCode) }, (err, res) => {
      this.setState ({ loading: false, target: res});
    });
  },

  render: function() {

    var filterOptions = [
      { payload: '1', text: 'Strict mode' },
      { payload: '2', text: 'Weak mode' },
      { payload: '3', text: 'Typescript converter' }];

    var examples = require('../examples.js');

    return (
      <div>

        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <DropDownMenu menuItems={filterOptions} />
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
            <Code ref="source" source={this.state.source} name="source-editor"/>
          </Paper>
        </div>
        <div className="output-area">
          <Paper zDepth={5} >

          </Paper>
        </div>

        <Spinner visible={this.state.loading} />

      </div>
    );
  },

  componentDidMount: function() {
    //this.updateOutput(this.refs.source.getValue());
  },

  _onChange: function(event) {
    var value = event.target.value;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.updateOutput(value);
    }, 2000);
  },

  _handleTouchTap: function() {
    this.updateOutput(this.refs.source.getValue());
  },

  _handleExamples: function(e, key, payload) {
    this.setState({source: payload.payload});
    // THIS IS ANTIPATTERN
  //  this.refs.source.setValue(payload.payload);
  //  this.updateOutput(payload.payload);
  }

});

module.exports = Main;
