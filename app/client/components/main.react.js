/* @flow */
var React = require('react');
var mui = require('material-ui');

var Spinner = require('./spinner.react');
var Code = require('./code.react');
var Footer = require('./footer.react');
var utils = require('../utils');
var service = require('../service'); // REWRITE WITH FLUX

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
var Snackbar = mui.Snackbar;
var Ace = require('brace');

type MainState = {
  source: string;
  loading: boolean;
  errors: Array<any>;
  target: string;
}

var Main = React.createClass({

  getInitialState(): MainState {
    return { source: '', loading: false, errors: [], target: '', error: ''};
  },

  componentDidMount() {
    this.loadByHash(this.props.hash);
  },

  loadByHash(hash) {
    service.loadByHash(hash, (err, res) => {
      if (err) {
        this.setState ({ loading: false, error: err});
        this.refs.snackbar.show();
      } else {
        this.setState ({ loading: false, source: res.source, errors: res.errors, target: res.target});
      }
    });
  },

  updateOutput(sourceCode: string) {
    if (sourceCode && sourceCode.length > 0) {
      this.setState ({ loading: true});
      service.flowCheck(sourceCode , (err, res) => {
        if (err) {
          this.setState ({ loading: false, error: err});
          this.refs.snackbar.show();
        } else {
          this.setState ({ loading: false, source: this.state.source, errors: res.errors, target: res.target});
          window.location.hash = res.hash;
        }
      });
    }
  },

  render(): any {

    //var examples = require('../examples.js');
    var examples = [
      {payload: '325911623be1511317876918418feab6', text: '01 - Hello world'},
      {payload: 'cc51170c03145c61ee2e4b21130dcc63', text: '02 - Dynamic'},
      {payload: '53f7b9797427a8d193b08565780fbb96', text: '03 - Type annotations'},
      {payload: '53f7b9797427a8d193b08565780fbb96', text: '04 - Modules'},
      {payload: '53f7b9797427a8d193b08565780fbb96', text: '05 - React.js'},
    ];
    return (
      <div>

        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <DropDownMenu menuItems={examples} onChange={this._handleExamples} />
          </ToolbarGroup>

          <ToolbarGroup key={1} float="right">
            <a href="http://flowtype.org/docs/getting-started.html"><Icon icon="social-school" /></a>
            <a href="https://github.com/unknownexception/tryflow"><Icon icon="mui-icon-github" /></a>

            <span className="mui-toolbar-separator">&nbsp;</span>
            <RaisedButton label="flow check" primary={true} onClick={this._handleTouchTap} />
          </ToolbarGroup>
        </Toolbar>

        <div className="raw-code-area">
          <Paper zDepth={5} >
            <Code ref="sourceEditor" source={this.state.source} name="source-editor" onChange={this._onSourceChange} errors={this.state.errors}/>
          </Paper>
        </div>
        <div className="output-area">
          <Paper zDepth={5} >
            <Code ref="target" source={this.state.target} name="target-editor" readOnly="true" />
          </Paper>
        </div>

        <Spinner visible={this.state.loading} />

        <Footer />

        <Snackbar ref="snackbar" message={this.state.error} action="Got it" />

      </div>
    );
  },

  _onSourceChange(value: string) {
    this.setState({source: value});
    // clearTimeout(this.timeout);
    // this.timeout = setTimeout(() => {
    //   console.log('update');
    //   this.updateOutput(value);
    // }, 2000);
  },

  _handleTouchTap() {
    this.updateOutput(this.state.source);
  },

  _handleExamples(e: any, key: any, payload: any) {
    window.location.hash = payload.payload;
    this.loadByHash(payload.payload);
  },

  _handleTest() {
    console.log('test');
  }

});

module.exports = Main;
