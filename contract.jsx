var PureRenderMixin = React.addons.PureRenderMixin;

Contract = React.createClass({

  mixins: [PureRenderMixin],
  
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

  render() {
    
    var children = this.props.abi
    .filter( (abi) => { return abi.type === 'function' })
    .map( ( abi ) => {

      var caller = (args) => { return this.props.instance[abi.name].apply(this,args); }

      return {
        nav: ABISelect,
        main: ABIView,
        object: _.extend( abi, { callContract: caller, ...this.getnatspec(abi), setContracts: this.props.setContracts } ),
        class: "abi"
      };
      
    });

    children.unshift({
      nav: ContractInfoSelect,
      main: ContractInfoView,
      object: this.props,
      class: "contractInfo"
    });
    
    return (
    <div className="contractView">
      <TreeView children={children} class="abi" {...this.props} />
    </div>
    );
  }
});


// Contract inspector - Information and meta Contract interaction
ContractInfoView = React.createClass({
  
  mixins: [PureRenderMixin],

  getInstances() {
    
    if( this.props.instances.length == 0 ) {
      return 'Not deployed, yet.';
    } else if( this.props.instances.length == 1 ) {
      return `@ ${this.props.instances[0].address}`
    } else {
      var options = this.props.instances.map( (i) => {
        return <option value={i.address} key={i.address}>{i.address}</option>;
      });
      
      return <div>
        @ <select id="instances" name="instances"> {options} </select> 
      </div>;
    }
  },

  onDeploy (){
    this.props.Class.new({ from: web3.eth.coinbase, data: this.props.binary }, (err, con) => {
      if( err ) throw new Error(err);
      if( !con.address ) return null;
      console.log(this.props.name);
      var newContracts = React.addons.update(Contracts, {
        [this.props.name]: {
          instances: {$unshift: [con]},
          instance: {$set: con}
        }
      });
      this.props.setContracts( newContracts );
    //   this.props.instances.unshift( con );
    //   this.props.instance = con;
    //   this.forceUpdate();
    });
  },

  onPoint () {
    
  },

  render() {
    return (
      <div>
        <div className="meta-info">
          <span className="name"> { this.props.name } </span>
          <span className="author"> { this.props.natspecdev.author } </span>
          <span className="title"> { this.props.natspecdev.title } </span>
        </div>
        
        <div className="label"> Instance </div>
        {this.getInstances()}
        <div>
          <button onClick={ this.onDeploy }>Deploy New</button>
          <button onClick={ this.onPoint }>Point to Existing Address</button>
        </div>
      </div>
    );
  }
});


// Small navigation button to display more information for the contract
ContractInfoSelect = React.createClass({
  
  
  // show address if contract is already deployed
  optAddress () {
    if( typeof this.props.instance === 'object' ) {
      return '@' + this.props.instance.address.slice(0,7);
    }
    return '';
  },

  render () {
    return <div> { this.props.name } {this.optAddress()} </div>;
  }
});
