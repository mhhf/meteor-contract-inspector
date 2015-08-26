Contract = React.createClass({
  
  getInitialState () {
    return { selected: 0 };
  },

  setSelected ( i ) {
    this.setState({ selected: i });
  },

  getnatspec ( abi ) {
    findText = ( o ) => {
      return  o && o.methods &&
        _.find( o.methods, ( v, k ) => {
          return (new RegExp(`^${abi.name}`)).test(k);
        });
    };
    var natspecuser = findText( this.props.natspecuser );
    var natspecdev  = findText( this.props.natspecdev );
    return { natspecuser, natspecdev };
  },

  renderABI () {
    return this.props.abi
    .filter( (abi) => { return abi.type == 'function'; } )
    .map( ( abi, i ) => {
      let boundClick = this.setSelected.bind( this, i)
      let natspec= this.getnatspec( abi );
      
      return <ABISelect {...abi} {...natspec} onClick={ boundClick } key = {i} selected={i === this.state.selected} />;
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
    var natspec = this.getnatspec( abi );
    
    return (
    <div className="contractView">
      <div className="contractStatus">{this.renderStatus()}</div>
      <div className="abiInspector">
        <div className="abiSelect">
          {abis}
        </div>
        <div className="abiView">
          <ABIView key={this.state.selected} { ...abi } {...natspec} callContract = {this.callContract} />
        </div>
      </div>
    </div>
    );
  }
});

