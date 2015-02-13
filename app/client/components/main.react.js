/* @flow */
var React = require('react');
var mui = require('material-ui');

var Spinner = require('./spinner.react');
var Code = require('./code.react');
var Footer = require('./footer.react');
var utils = require('../utils');
var service = require('../service'); // REWRITE WITH FLUX

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
      this.refs.snackbar.show();
      this.setState ({ loading: true});
      service.flowCheck(sourceCode , (err, res) => {
        if (err) {
          this.setState ({ loading: false, error: err});
          this.refs.snackbar.show();
        } else {
          this.refs.snackbar.dismiss();
          this.setState ({ loading: false, source: this.state.source, errors: res.errors, target: res.target});
          window.location.hash = res.hash;
        }
      });
    }
  },

  render(): any {

    //var examples = require('../examples.js');
    var examples = [
      {payload: 'fa7d16b9ce86fa42c8cb7a89d01ce9fb', text: '01 - Hello world'},
      {payload: '16703f86fe7507a5145d9e87006eeddd', text: '02 - Dynamic'},
      {payload: '3b135a42a7710d2ee0135885ebcab752', text: '03 - Type annotations'},
      {payload: '524323e2bf98148b667b0f8e72e28f2c', text: '04 - Modules'},
      {payload: 'bc1f559bbf4cf06ad317673e3f39dea1', text: '05 - React.js'},
    ];
    return (
      <div>

        <mui.Toolbar>
          <mui.ToolbarGroup key={0} float="left">
            <mui.DropDownMenu menuItems={examples} onChange={this._handleExamples} />
            <a href="http://flowtype.org/docs/getting-started.html"><mui.Icon icon="social-school" /></a>
            <a href="https://github.com/unknownexception/tryflow"><mui.Icon icon="mui-icon-github" /></a>

            <span className="mui-toolbar-separator">&nbsp;</span>
            <mui.RaisedButton label="run flow check" tip="tip" primary={true} onClick={this._handleTouchTap} />
          </mui.ToolbarGroup>
        </mui.Toolbar>

        <div className="raw-code-area">
          <mui.Paper zDepth={5} >
            <Code ref="sourceEditor" source={this.state.source} name="source-editor" onChange={this._onSourceChange} errors={this.state.errors}/>
          </mui.Paper>
        </div>
        <div className="output-area">
          <mui.Paper zDepth={5} >
            <Code ref="target" source={this.state.target} name="target-editor" readOnly="true" />
          </mui.Paper>
        </div>

        <Footer />

        <mui.Snackbar ref="snackbar" message={this.state.loading ? 'Loading.. ' : this.state.error} action={this.state.loading ? '' : 'Got it'}  onActionTouchTap={this._handleSnackbarAction} />

      </div>
    );
  },

  _onSourceChange(value: string) {
    this.setState({source: value});
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.updateOutput(value);
    }, 2000);
  },

  _handleTouchTap() {
    this.updateOutput(this.state.source);
  },

  _handleExamples(e: any, key: any, payload: any) {
    window.location.hash = payload.payload;
    this.loadByHash(payload.payload);
  },

  _handleSnackbarAction() {
    this.ref.snackbar.hide();
  }

});

module.exports = Main;
