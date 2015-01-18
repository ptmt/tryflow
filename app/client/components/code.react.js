/* @flow */
var React = require('react');

var CodeEditor = React.createClass({
  // getInitialState: function() {
  //   return {
  //     value: this.props.html
  //   };
  // },

  render: function(){
    var inputIsNotEmpty = !this.isEmpty();
    console.log(inputIsNotEmpty);
    var classes = ['textarea', 'mui-input', 'mui-input-textarea'];
    var codeareaClasses = ['codearea', 'mui-is-not-empty'];
    // if (inputIsNotEmpty) {
    //   classes.push('mui-is-not-empty');
    //   codeareaClasses.push('mui-is-not-empty');
    // }
    classes = classes.join(' ');
    codeareaClasses = codeareaClasses.join(' ');
    var html = inputIsNotEmpty ? this.props.html : '';

    return <div className={classes}>
      <pre ref="input" className={codeareaClasses} onInput={this.emitChange} onBlur={this.emitChange} dangerouslySetInnerHTML={{__html: html}}></pre>
      <span className="mui-input-placeholder" onClick={this._onPlaceholderClick}>
      {this.props.placeholder}
      </span>
      <span className="mui-input-highlight"></span>
      <span className="mui-input-bar"></span>
      <span className="mui-input-description">{this.props.description}</span>
      </div>;
  },

  // shouldComponentUpdate: function(nextProps){
  //   console.log('shouldComponentUpdate', nextProps.html, this.getHtml(), this.isEmpty());
  //   return nextProps.html !== this.getHtml() || this.isEmpty();
  // },

  componentDidUpdate: function() {
    if ( this.props.html !== this.getHtml() ) {
      this.refs.input.getDOMNode().innerHTML = this.props.html;
    }
  },

  isEmpty: function() {
    console.log(this.getHtml());
    if(!this.getHtml() || this.getHtml() === '<br>') {
      return true;
    } else
      return false;
  },

  blur: function() {
    if(this.isMounted()) this.refs.input.getDOMNode().blur();
  },

  focus: function() {
    if (this.isMounted()) this.refs.input.getDOMNode().focus();
  },

  _onPlaceholderClick: function(e) {
    this.focus();
  },

  getHtml() {
    // TODO: rewrite with state
    return this.refs.input ? this.refs.input.getDOMNode().innerHTML : this.props.html;
  },

  getText() {
    function extractTextWithWhitespace( elems ) {
      var ret = "", elem;

      for ( var i = 0; elems[i]; i++ ) {
        elem = elems[i];
        console.log(elem);
        // Get the text from text nodes and CDATA nodes
        if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
          ret += elem.nodeValue + "\n";

          // Traverse everything else, except comment nodes
        } else if ( elem.nodeType !== 8 ) {
          ret += extractTextWithWhitespace( elem.childNodes );
        }
      }

      return ret;
    }
    return this.refs.input ? extractTextWithWhitespace([this.refs.input.getDOMNode()]) : '';
  },

  emitChange: function(){
    var html = this.getHtml();
    //this.setState({value: html});
    if (html !== this.lastHtml) {
      //this.forceUpdate();
      if (this.props.onChange) {
        this.props.onChange({
          target: {
            value: this.getText()
          }
        });
      }
    }
    this.lastHtml = html;
  }
});

module.exports = CodeEditor;
