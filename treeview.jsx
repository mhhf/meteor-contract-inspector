var PureRenderMixin = React.addons.PureRenderMixin;

TreeView = React.createClass({

  mixins: [PureRenderMixin],
  
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

      return <div className={classes} onClick={ boundClick } key={i} >
        <CClass {...child.object} />
      </div>;
    });
    
  },

  
  renderMainView () {
    var contract = Contracts[this.state.selected];

    let obj = this.props.children[this.state.selected];
    let ViewClass = obj.main;
    
    var mainClasses = React.addons.classSet({
      mainView: true,
      [ obj.class ]: true
    });

    return <div className={mainClasses}>
      <ViewClass key={this.state.selected} {...obj.object} />
    </div>;
  },

  render () {
    var boundClick = this.changeSelected.bind( this, "web3" );
    var boundClickNew = this.changeSelected.bind( this, "new" );
    
    var navClasses = React.addons.classSet({
      navigation: true,
      [ this.props.class ]: true
    });
    
    return (
      <div className="treeview">
        <div className={navClasses}>
          { this.renderNavigation() }
        </div>
        {this.renderMainView()}
      </div>
    );
  }
  
});
