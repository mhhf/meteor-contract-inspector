Contract = React.createClass({
  
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
        object: _.extend( abi, { callContract: caller, ...this.getnatspec(abi) } ),
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

ContractInfoView = React.createClass({

  render() {
    return (
      <div>ContractInfoView</div>
    );
  }
});


ContractInfoSelect = React.createClass({
  
  // show address if contract is already deployed
  optAddress () {
    if( typeof this.props.instance === 'object' ) {
      return '@' + this.props.instance.address.slice(0,7);
    }
    return '';
  },

  render () {
    return <div>
            { this.props.name } {this.optAddress()}
          </div>;
  }
});


ContractNavigationView = React.createClass({

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
