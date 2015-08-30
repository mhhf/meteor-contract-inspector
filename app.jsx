var PureRenderMixin = React.addons.PureRenderMixin;

Web3Inspector = React.createClass({
  
  mixins: [PureRenderMixin],

  getInitialState () {
    return { 
      active: false,
      contracts: Contracts
    };
  },

  toggle () {
    this.setState({
      active: !this.state.active 
    });
  },

  setContracts( o ) {
    var newContracts = React.addons.update(this.state.contracts, o );
    this.setState( { contracts: newContracts } );
  },

  render () {
    var mainClasses = React.addons.classSet({
      active: this.state.active
    });

    var children = _.map(this.state.contracts, ( v, k ) => {
      return {
        nav: ContractNavigationView,
        main: Contract,
        object: { name: k, ...v, setContracts:this.setContracts },
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
  
  // TODO - cleanup this mess
  init ( options ) {
    
    web3.setProvider( new web3.providers.HttpProvider( options.httpProvider ) );

    // web3.currentProvider.send({jsonrpc: "2.0", method: "evm_reset", params: [], id: 1});
    web3.eth.defaultAccount = web3.eth.coinbase;

    var initContractInspector = function( contracts ) {
      $('body').append('<div id="web3Inspector-wrapper"></div>');
      React.render(<Web3Inspector contracts={contracts} />, document.getElementById("web3Inspector-wrapper"));
    }
    
    _.each(Contracts, ( con ) => {
      
      let C = web3.eth.contract( con.abi );
      con.Class = C;
      con.instances = [];
      
    });
    
    
    // TODO - refactor this
    var rdyCounter = 0;

    var toDeploy = _.pick(Contracts, _.pluck( _.filter(options.contracts, function(c){
      return c.deploy;
    }),'name'));
    
    var toWhisk = _.pick(Contracts, _.pluck( _.filter(options.contracts, function(c){
      return typeof c.address === 'string';
    }),'name'));

    // Instanceate 
    _.each( toWhisk, (Contract, name) => {
      var c = Contract.Class.at( _.find(options.contracts, (c) => { return c.name == name; }).address );
      Contract.instance = c;
      Contract.instances.push(c);
    });
    
    // Deploy Contracts
    _.each( toDeploy, ( Contract, name ) => {
    
      c = Contract.Class.new( {from: web3.eth.coinbase, data: Contract.binary }, function( err, con ){
        if( err ) throw new Error(err);
        if( !con.address ) return null;
        Contract.instance = con;
        Contract.instances.push( con );
        
        // Render after every contract has been initialized
        if ( ++rdyCounter == _.keys( toDeploy ).length ) {
          if ( options.contractSetup && typeof options.contractSetup === "function" ) {
            options.contractSetup ( () => {
              initContractInspector( Contracts );
            });
          } else {
            initContractInspector( Contracts );
          }
        }
        
      });
    });

  }
}

ContractNavigationView = React.createClass({
  
  mixins: [PureRenderMixin],

  render() {

    var status = React.addons.classSet({
      statusIcon: true,
      green: typeof this.props.instance == "object"
    });
    
    return (
      <div> { this.props.name } 
        <span className={status}></span>
      </div>
    );
  }
});
