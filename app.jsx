Web3Inspector = React.createClass({

  getInitialState () {
    return { 
      active: false
    };
  },

  toggle () {
    this.setState({
      active: !this.state.active 
    });
  },

  render () {
    var mainClasses = React.addons.classSet({
      active: this.state.active
    });

    var children = _.map(Contracts, ( v, k ) => {
      return {
        nav: ContractNavigationView,
        main: Contract,
        object: { name: k, ...v },
        class: "contract"
      };
    });

    return <div id="web3Inspector" className={mainClasses} >
        <div className="activeToggle" onClick={this.toggle}></div>
        <TreeView className={mainClasses} children={children} class="contract" {...this.props} />
      </div>;
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

    var toDeploy = _.pick(Contracts, _.pluck( _.filter(options.contracts, function(c){
      return c.deploy;
    }),'name'));
    
    var toWhisk = _.pick(Contracts, _.pluck( _.filter(options.contracts, function(c){
      return typeof c.address === 'string';
    }),'name'));

    _.each( toWhisk, (Contract, name) => {
      var C = web3.eth.contract( Contract.abi );
      var c = C.at( _.find(options.contracts, (c) => { return c.name == name; }).address );
      Contract.instance = c;
    });

    
    // Deploy Contracts
    _.each( toDeploy, ( Contract, name ) => {
    
      var C = web3.eth.contract( Contract.abi );
      c = C.new( {from: web3.eth.coinbase, data: Contract.binary }, function( err, con ){
        if( err ) throw new Error(err);
        if( !con.address ) return null;
        Contract.instance = con;
        
        // Render after every contract has been initialized
        if ( ++rdyCounter == _.keys( toDeploy ).length ) {
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
