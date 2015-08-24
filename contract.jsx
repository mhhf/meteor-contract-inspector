Contract = React.createClass({
  
  getInitialState () {
    return { selected: 0 };
  },

  setSelected ( i ) {
    this.setState({ selected: i });
  },

  renderABI () {
    return this.props.abi
    .filter( (abi) => { return abi.type == 'function'; } )
    .map( ( abi, i ) => {
      var boundClick = this.setSelected.bind( this, i)
      return <ABISelect {...abi} onClick={ boundClick } key = {i} selected={i === this.state.selected} />;
    });
  },
  
  renderStatus () {
    if( typeof this.props.instance == "object" ) {
      return "Address: "+this.props.instance.address
    } else {
      return "not deployed, yet.";
    }
  },
  
  callContract( args ) {
    if( args.length == 0 ) {
      var result = this.props.instance[ this.props.abi[this.state.selected].name ].apply( this );
    } else {
      var result = this.props.instance[ this.props.abi[this.state.selected].name ].apply( this, args );
    }
    return result;
  },

  render() {
    var abis = this.renderABI();
    
    var abi = this.props.abi[ this.state.selected ];
    
    return (
    <div className="contractView">
      <div className="contractStatus">{this.renderStatus()}</div>
      <div className="abiInspector">
        <div className="abiSelect">
          {abis}
        </div>
        <div className="abiView">
          <ABIView key={this.state.selected} { ...abi } callContract = {this.callContract} />
        </div>
      </div>
    </div>
    );
  }
});

