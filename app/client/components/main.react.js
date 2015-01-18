/* @flow */
var React = require('react');
var mui = require('material-ui');
var request = require('../request');
var Spinner = require('./spinner.react');
var Code = require('./code.react');

var Input = mui.Input;
var Paper = mui.Paper;
var DropDownMenu = mui.DropDownMenu;
var IconButton = mui.IconButton;
var Icon = mui.Icon;
var RaisedButton = mui.RaisedButton;
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var Toggle = mui.Toggle;

var Main = React.createClass({

  getInitialState: function() {
    return { source: '', loading: false, target: ''};
  },

  updateOutput: function(sourceCode) {
    this.setState ({ loading: true, target: this.state.target});
    request.post('/flow_check', {source: sourceCode }, (err, res) => {
      this.setState ({ loading: false, target: res});
      console.log(err);
    });
  },

  render: function() {
    var filterOptions = [
      { payload: '1', text: 'Strict mode' },
      { payload: '2', text: 'Weak mode' },
      { payload: '3', text: 'Typescript converter' }];

    var defaultValue = "function length (a) {\n  return a.length;\n}\na(1);"

    return (
      <div>

        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <DropDownMenu menuItems={filterOptions} />
          </ToolbarGroup>

          <ToolbarGroup key={1} float="right">
            <a href="https://github.com/unknownexception/tryflow"><Icon icon="mui-icon-github" /></a>
            <span className="mui-toolbar-separator">&nbsp;</span>
            <RaisedButton label="flow check" primary={true} onClick={this._handleTouchTap} />
          </ToolbarGroup>
        </Toolbar>

        <div className="raw-code-area">
          <Paper zDepth={5} >
            <Input className="textarea" ref="source" multiline={true}
              type="text" name="source" placeholder="Javascript" onChange={this._onChange}
              onKeyDown={this._onKeyDown} defaultValue={defaultValue} description="start writing javascript code here" />
          </Paper>
        </div>
        <div className="output-area">
          <Paper zDepth={5} >
            <Code html={this.state.target} placeholder="Compiled Javascript"/>
          </Paper>
        </div>

        <Spinner visible={this.state.loading} />

      </div>
    );
  },

  _onChange: function(event) {
    var value = event.target.value;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.updateOutput(value);
    }, 3000);
  },

  _handleTouchTap: function() {
    this.updateOutput(this.refs.source.getValue());
  }

});

module.exports = Main;
