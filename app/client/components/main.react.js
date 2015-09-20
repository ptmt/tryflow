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

  getChildContext(): any {
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
      this.setState ({ loading: true});
      this.refs.snackbar.show();
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
    return (
      <div>
        <mui.Card initiallyExpanded={true}>
          <mui.CardActions showExpandableButton={true} >
              <mui.RaisedButton label="RUN FLOW!" linkButton={true} primary={true} labelStyle={styles.buttonLabel} onClick={this._handleTouchTap}/>
              <mui.RaisedButton linkButton={true} href="http://flowtype.org/docs/getting-started.html" label="Flowtype.org" labelStyle={styles.buttonLabel}>
                <mui.FontIcon style={styles.exampleFlatButtonIcon} className="fa fa-2x fa-book" />
              </mui.RaisedButton>

              <mui.RaisedButton linkButton={true} href="https://github.com/unknownexception/tryflow" label="github" labelStyle={styles.buttonLabel}>
                <mui.FontIcon style={styles.exampleFlatButtonIcon} className="fa fa-2x fa-github" />
              </mui.RaisedButton>
              <Footer />
          </mui.CardActions>
           <mui.CardText expandable={true}>
             <a href="#c32a0a7568c3b9c3d9c731531b915b92" style={styles.link}>Hello, world!</a>.
             Javascript without types annotations: <a href="#16703f86fe7507a5145d9e87006eeddd" style={styles.link}>Dynamic</a>
             &nbsp;and <a href="#088c0e5b336e2941f081fd7387e2b048" style={styles.link}>Flow comments</a> examples.
             &nbsp;<a href="#d4334b8777e12c83792502e1b70c25a6" style={styles.link}>React.js</a>
             &nbsp;and <a href="#5c7ee1ad2409f22513e8829074409917" style={styles.link}>Redux</a> gists are in progress.
             Also: <a href="#524323e2bf98148b667b0f8e72e28f2c" style={styles.link}>Node.js Modules declarations</a>,
             <a href="#1c36beacd0fb6f72e3a0752e1d3e209d" style={styles.link}>Monads</a>

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
