/* @flow */
var React = require('react');
var mui = require('material-ui');

var Spinner = require('./spinner.react');
var Code = require('./code.react');
var Footer = require('./footer.react');
var utils = require('../utils');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
var service = require('../service'); // REWRITE WITH FLUX

type MainState = {
  source: string;
  loading: boolean;
  errors: Array<any>;
  target: string;
  error: string;
}

var Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  getInitialState(): MainState {
    return { source: '', loading: false, errors: [], target: '', error: ''};
  },

  componentDidMount() {
    this.loadByHash(this.props.hash);
    window.addEventListener("hashchange", () => this.loadByHash(location.hash), false);
  },

  loadByHash(hash: string) {
    this.refs.snackbar.show();
    this.setState ({ loading: true});
    service.loadByHash(hash, (err, res) => {
      if (err) {
        this.setState ({ loading: false, error: err});
        this.refs.snackbar.show();
      } else {
        this.refs.snackbar.dismiss();
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
          this.setState ({ loading: false, error: 'Cannot perform flow check, please report'});
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
      {payload: '0101751fa7c5741792c292e31fa8de32', text: '01 - Hello world'},
      {payload: '16703f86fe7507a5145d9e87006eeddd', text: '02 - Dynamic'},
      {payload: '18393dfcb824119d4e35beb9bcc7a48b', text: '03 - Type annotations'},
      {payload: '524323e2bf98148b667b0f8e72e28f2c', text: '04 - Modules'},
      {payload: 'bc1f559bbf4cf06ad317673e3f39dea1', text: '05 - React.js'},
      {payload: '088c0e5b336e2941f081fd7387e2b048', text: '06 - Flow comments'},
      {payload: '9b415a58cae0f6b47b79fd2a28313724', text: '07 - Bounded polymorphism'},
    ];
    // <mui.DropDownMenu menuItems={examples} onChange={this._handleExamples} />
    return (
      <div>
        <mui.Card initiallyExpanded={true}>
          <mui.CardActions showExpandableButton={true} >
              <mui.RaisedButton label="FLOW CHECK" linkButton={true} primary={true} labelStyle={styles.buttonLabel} onClick={this._handleTouchTap}/>
              <mui.RaisedButton linkButton={true} href="http://flowtype.org/docs/getting-started.html" label="Flowtype.org" labelStyle={styles.buttonLabel}>
                <mui.FontIcon style={styles.exampleFlatButtonIcon} className="fa fa-2x fa-book" />
              </mui.RaisedButton>

              <mui.RaisedButton linkButton={true} href="https://github.com/unknownexception/tryflow" label="github" labelStyle={styles.buttonLabel}>
                <mui.FontIcon style={styles.exampleFlatButtonIcon} className="fa fa-2x fa-github" />
              </mui.RaisedButton>
              <Footer />
          </mui.CardActions>
           <mui.CardText expandable={true}>
             <a href="#0101751fa7c5741792c292e31fa8de32" style={styles.link}>Hello, world!</a>.
             If you would like to write plain Javascript check out <a href="#16703f86fe7507a5145d9e87006eeddd" style={styles.link}>Dynamic</a>
             &nbsp;and <a href="#088c0e5b336e2941f081fd7387e2b048" style={styles.link}>Flow comments</a> examples.
             React fans might find interesting <a href="#bc1f559bbf4cf06ad317673e3f39dea1" style={styles.link}>React.js</a>
             &nbsp;and <a href="#16703f86fe7507a5145d9e87006eeddd" style={styles.link}>Redux</a> gists.
             Flow is also useful if you are working with Node (io.js) <a href="#524323e2bf98148b667b0f8e72e28f2c" style={styles.link}>Modules</a>

           </mui.CardText>
        </mui.Card>

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

        <mui.Snackbar ref="snackbar" message={this.state.loading ? 'Loading.. ' : this.state.error} action={this.state.loading ? '' : 'Got it'}  onActionTouchTap={this._handleSnackbarAction} />

      </div>
    );
  },

  _onSourceChange(value: string) {
    this.setState({source: value});
    // clearTimeout(this.timeout);
    // this.timeout = setTimeout(() => {
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

  _handleSnackbarAction() {
    this.refs.snackbar.dismiss();
  }

});

var styles = {
  container: {
    // textAlign: 'center',
    // marginBottom: '16px'
  },
  link: {paddingLeft: 0, color: Colors.cyanA700},
  buttonLabel: {
    //padding: '0px 16px 0px 8px'
  },
  exampleFlatButtonIcon: {
     //height: '100%',
     display: 'inline-block',
     verticalAlign: 'middle',
     float: 'left',
     paddingLeft: '12px',
     lineHeight: '36px',
     color: Colors.cyan500
   },
}
module.exports = Main;
