/* @flow */
var React = require('react');
var service = require('../service');

var Footer = React.createClass({
  getInitialState(): MainState {
    return { version: 'version: unknown'};
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
        Flow {this.state.version}
      </div>
    );
  }
});
module.exports = Footer;
