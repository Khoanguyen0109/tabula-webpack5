import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import withStyles from '@mui/styles/withStyles';

import { ReactComponent as TabulaLogoFull } from 'assets/images/tabula_logo_full_bw.svg';
import { ReactComponent as TabulaLogoIcon } from 'assets/images/tabula_logo_icn_bw.svg';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import SidebarMenu from './SidebarMenu';
import styles from './styled';
import UserMenu from './UserMenu';

class TblSidebar extends React.PureComponent {
  render() {
    const { classes, routes, openSideBar, toggleSidebar, ...rest } = this.props;
    return (
      <Drawer
        open={openSideBar}
        anchor='left'
        {...rest}
        classes={{
          root: classes.root,
          paper: clsx(classes.paper, {
            [classes.drawerOpen]: openSideBar,
            [classes.drawerClose]: !openSideBar,
          }),
        }}
        variant='permanent'
        onClose={this.closeSidebar}
      >
        <Box display='flex' alignItems='center' justifyContent='center' className={classes.tblLogo}>
          <Box display='flex' mt={1}>
            {openSideBar ? <TabulaLogoFull /> : <TabulaLogoIcon />}
          </Box>
          <Box>
            <IconButton
              onClick={toggleSidebar}
              className={clsx(classes.iconButton, {
                [classes.iconButtonOpen]: openSideBar,
              })}
              size='large'>
              <Icon
                className={openSideBar ? 'icon-icn_arrow_left' : 'icon-icn_arrow_right'}
              />
            </IconButton>
          </Box>
        </Box>
        <SidebarMenu
          routes={routes}
          closeSidebar={this.closeSidebar}
          className={classes.list}
          openSideBar={openSideBar}
        />
        <UserMenu routes={routes} closeSidebar={this.closeSidebar} openSideBar={openSideBar} />
      </Drawer>
    );
  }
}

TblSidebar.propTypes = {
  classes: PropTypes.object,
  routes: PropTypes.array,
  openSideBar: PropTypes.bool,
  toggleSidebar: PropTypes.func
};

export default withStyles(styles)(TblSidebar);