Web3Inspector = React.createClass({

  getInitialState () {
    return { 
      selected: _.keys(Contracts)[0],
      active: false
    };
  },

  changeSelected ( key ) {
    this.setState( { selected: key } );
  },

  renderContracts () {
    
    return _.map(Contracts, ( v, k ) => {
      var classes = React.addons.classSet({
        navBtn: true,
        selected: this.state.selected === k
      });

      var status = React.addons.classSet({
        statusIcon: true,
        green: typeof v.instance == "object"
      });

      var boundClick = this.changeSelected.bind( this, k );
      return <div className={classes} onClick={ boundClick }> { k } 
        <span className={status}></span>
        </div>;
    });
    
  },

  renderMainView () {
    if( this.state.selected === "web3" ) {
      return null;
    } else {
      var contract = Contracts[this.state.selected];
      if ( contract == null ) throw Error("no contract under this name found");
      return <Contract key={this.state.selected} {...contract} />;
    }
  },

  toggle () {
    this.setState({
      active: !this.state.active 
    });
  },

  render () {
    var boundClick = this.changeSelected.bind( this, "web3" );
    var classes = React.addons.classSet({
      navBtn: true,
      selected: this.state.selected === "web3"
    });

    var mainClasses = React.addons.classSet({
      active: this.state.active
    });

    return (
      <div id="web3Inspector" className={mainClasses} >
        <div className="activeToggle" onClick={this.toggle}>
        </div>
        <div className="navigation">
          <div className="contractsNavigation">
            { this.renderContracts() }
          </div>
          <div className="web3Settings">
            <div className={ classes } onClick={ boundClick }>
              web3
            </div>
          </div>
        </div>
        <div className="mainView">
          {this.renderMainView()}
        </div>
      </div>
    );
  }
});

ContractInspector = {
  init ( options ) {
    
    web3.setProvider( new web3.providers.HttpProvider( options.httpProvider ) );

    // web3.currentProvider.send({jsonrpc: "2.0", method: "evm_reset", params: [], id: 1});
    web3.eth.defaultAccount = web3.eth.coinbase;

    var initContractInspector = function() {
      $('body').append('<div id="web3Inspector-wrapper"></div>');
      React.render(<Web3Inspector />, document.getElementById("web3Inspector-wrapper"));
    }

    // TODO - refactor this
    var rdyCounter = 0;
    
    _.each(Contracts, ( Contract, name ) => {
    
      var C = web3.eth.contract( Contract.abi );
      c = C.new( {from: web3.eth.coinbase, data: Contract.binary }, function( err, con ){
        if( err ) throw new Error(err);
        if( !con.address ) return null;
        Contract.instance = con;
        
        // Render after every contract has been initialized
        if ( ++rdyCounter == _.keys(Contracts).length ) {
          if ( options.contractSetup && typeof options.contractSetup === "function" ) {
            options.contractSetup ( () => {
              initContractInspector();
            });
          } else {
            initContractInspector();
          }
        }
        
      });
    });
  }
}
