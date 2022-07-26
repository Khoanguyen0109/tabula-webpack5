import React from 'react';

import Box from '@mui/material/Box';
import withStyles from '@mui/styles/withStyles';

import { isGuardian } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Breadcumb from '../components/TblBreadcrumb';
import Sidebar from '../components/TblSidebar';

import ToggleInfo from './components/ToggleInfo';
import { LayoutContext } from './LayoutContext';
import styles from './styled';

class Layout extends React.PureComponent {
  static contextType = LayoutContext;
  state = {
    openSideBar: (localStorage.getItem('openSideBarStatus') || 'true') === 'true'
  };

  toggleSidebar = () => {
    const { openSideBar } = this.state;
    this.setState({ openSideBar: !openSideBar });
    localStorage.setItem('openSideBarStatus', !openSideBar);
  };

  render() {
    const { classes, routes } = this.props;
    const { openSideBar } = this.state;
    if (this.context?.isPublic) {
      return <>{this.props.children}</>;
    }
    if(this.context.fullScreen){
      return <>{this.props.children}</>;

    }

    return (
      <Box display='flex' className={classes.root}>
        <Box className={clsx(
          'sidebar-container',
          classes.layoutSidebar,
          { [classes.layoutSidebarClose]: !openSideBar }
        )}>
          <Sidebar routes={routes} openSideBar={openSideBar} toggleSidebar={this.toggleSidebar} />
        </Box>
        <Box className={classes.layoutContent}>
          <AuthDataContext.Consumer>
            {((value) => isGuardian(value.currentUser) && <ToggleInfo className={classes.toggleInfo}/>)}
          </AuthDataContext.Consumer>

          <Breadcumb />
          {this.props.children}
        </Box>
      </Box>
    );
  }
}
Layout.propTypes = {
  classes: PropTypes.object,
  routes: PropTypes.array,
  isPublic: PropTypes.bool,
  children: PropTypes.node
};
export default withStyles(styles)(Layout);