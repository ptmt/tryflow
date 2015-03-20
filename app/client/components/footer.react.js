/* @flow */
var React = require('react');
var service = require('../service');

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
      <div className="footer">
        Flow v{this.state.version}, 
        React v{this.state.react}
      </div>
    );
  }
});
module.exports = Footer;
