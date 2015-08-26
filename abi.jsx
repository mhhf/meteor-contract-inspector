
ABIView = React.createClass({

  getInitialState () {
    
    return { result: null };
    
  },

  renderInputs () {

    var inputs = this.props.inputs.map( ( input, i ) => {
      var notice = this.props.natspecdev 
      && this.props.natspecdev.params 
      && this.props.natspecdev.params[ input.name ];

      return <div><tr key={i}> <td> <label> {input.name || input.type}</label></td><td> <input type="text" ref={i} /> </td><td> ::{input.type} </td> </tr><tr><td colspan="3"><span className="explainer">{notice}</span></td></tr></div>;
    });

    
    if( inputs.length > 0 ) {
      return (
      <form ref="form">
        <fieldset>
          <legend>{this.props.name}</legend>
          <table>
            <tbody>
              {inputs}
            </tbody>
          </table>
        </fieldset>
      </form>
      );
    } else {
      return null;
    }
  },

  renderResult () {

    if ( this.props.type != "function" ) return null;
    
    var outputs = this.props.outputs.map( ( output, i ) => {
      
      
      return <tr key={i}>
        <td>
          <label> {output.name || output.type}</label>
        </td>
        <td> 
          <input disabled type="text" value={ this.props.outputs.length > 1 && this.state.result && this.state.result[i] || this.state.result } />
        </td>
        <td>::{output.type}</td>
      </tr>;
    });
    
    
    if( outputs.length > 0 ) {
      return (
      <fieldset>
        <legend>Output</legend>
        <table>
          <tbody>
            {outputs}
          </tbody>
        </table>
      </fieldset>
      );
    } else {
      return null;
    }
  },

  callContract () {
    var args = [];
    for( let i=0; i<this.props.inputs.length; i++ ) {
      args.push(this.refs[i].getDOMNode().value);
    }
    this.setState({ result: this.props.callContract( args ) });
  },

  render () {
    var nsuser = this.props.natspecuser && this.props.natspecuser.notice;
    var nsdev = this.props.natspecdev && this.props.natspecdev.details;

    var displayNotice = ( notice ) => {
      return <span className="explainer">{ notice }</span>;
    }
    
    return (
    <div>
      { nsuser && displayNotice( nsuser ) }
      { nsdev && displayNotice( nsdev ) }
      {this.renderInputs()}
      <button onClick = {this.callContract}> Call </button>
      {this.renderResult()}
    </div>
    );
  }
  
});
