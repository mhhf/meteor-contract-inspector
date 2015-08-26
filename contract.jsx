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

  renderMainView () {
    
    if( this.state.selected == -1 ) {
      return <div> Detailed Contract View </div>;
    } else {
      var abi = this.props.abi[ this.state.selected ];
      var natspec = this.getnatspec( abi );
      
      return <ABIView key={this.state.selected} { ...abi } {...natspec} callContract = {this.callContract} />;
    }
  },

  render() {
    var abis = this.renderABI();
    
    let boundClick = this.setSelected.bind( this, -1)
    
    var classes = React.addons.classSet({
      selected: this.state.selected === -1,
      contractInfo: true
    });
    
    return (
    <div className="contractView">
      <div className="abiInspector">
        <div className="abiSelect">
          <div key="-1" onClick = {boundClick} className={classes} >
            { this.props.name } @{this.props.instance.address.slice(2,9)}
          </div>
          {abis}
        </div>
        <div className="abiView">
          {this.renderMainView()}
        </div>
      </div>
    </div>
    );
  }
});

ABISelect = React.createClass({
  
  render () {
    
    var classes = React.addons.classSet({
      abiSmall: true,
      selected: this.props.selected
    });

    var notice = this.props.natspecuser && this.props.natspecuser.notice;
    var displayNotice = () => {
      return <span className="dev explainer"> { this.props.natspecuser.notice.slice(0,100) } </span>;
    }
    
    return (
      <div className={classes} onClick={this.props.onClick}>
        <span className="name"> {this.props.name} </span>
        { notice && displayNotice() }
      </div>
    );
  }
  
});
