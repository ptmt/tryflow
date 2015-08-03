/* @flow */
var React = require('react');
var service = require('../service');
var mui = require('material-ui');

var Footer: React.Class<any, any, {version:string}> = React.createClass({
  getInitialState() {
    return { version: '', react: ''};
  },
  componentDidMount() {
    // ANTI-PATTERN
    service.getVersion((err, res) => {
      if (!err) {
        this.setState(res);
      }
    });
  },
  render(): any {
    return(
      <mui.FlatButton linkButton={true} label={this.state.version} disabled={true} />
    );
  }
});
module.exports = Footer;
