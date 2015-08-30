TreeView = React.createClass({

  propTypes: {
    selected: React.PropTypes.number,
    children: React.PropTypes.array
    //  array of:
    //  {
    //    navView: ReactClass,
    //    mainView: ReactClass,
    //    object: Object
    //  }
    //
  },
  
  getInitialState () {
    return { 
      selected: this.props.selected || 0
    };
  },

  // TODO - try to remove?
  changeSelected ( key ) {
    this.setState( { selected: key } );
  },


  renderNavigation() {
    
    return _.map(this.props.children, ( child, i ) => {
      var classes = React.addons.classSet({
        navBtn: true,
        [ child.class ]: true,
        selected: this.state.selected === i
      });
      
      var boundClick = this.changeSelected.bind( this, i );
      var CClass = child.nav;

      return <div className={classes} onClick={ boundClick } >
        <CClass {...child.object} />
      </div>;
    });
    
  },

  
  renderMainView () {
    if( this.state.selected === "web3" ) {
      return null;
    } else if( this.state.selected === "new" ) {
      return null;
    } else {
      
      var contract = Contracts[this.state.selected];

      let obj = this.props.children[this.state.selected];
      let ViewClass = obj.main;

      return <ViewClass key={this.state.selected} {...obj.object} />;
    }
  },

  render () {
    var boundClick = this.changeSelected.bind( this, "web3" );
    var boundClickNew = this.changeSelected.bind( this, "new" );
    
    var navClasses = React.addons.classSet({
      navigation: true,
      [ this.props.class ]: true
    });
    
    var mainClasses = React.addons.classSet({
      mainView: true,
      [ this.props.class ]: true
    });

    return (
      <div className="treeview">
        <div className={navClasses}>
          { this.renderNavigation() }
        </div>
        <div className={mainClasses}>
          {this.renderMainView()}
        </div>
      </div>
    );
  }
  
});
