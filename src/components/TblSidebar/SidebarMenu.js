import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router';

import isArray from 'lodash/isArray';

import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import TblTooltip from 'components/TblTooltip';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { ReactComponent as IcnMenu } from 'assets/images/icn_feedback.svg';
import ContactUsForm from 'modules/ContactUs/containers';
import PropTypes from 'prop-types';
import { checkPermission } from 'utils';

class SidebarMenu extends React.PureComponent {
  static contextType = AuthDataContext;
  state = {
    openContactForm: false,
  };
  getMenuItems = (routes) => {
    const menu = {};
    const { currentUser } = this.context;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].menu && checkPermission(currentUser, routes[i].roles)) {
        if (!menu[routes[i].menu.group]) {
          menu[routes[i].menu.group] = [];
        }
        menu[routes[i].menu.group].push(routes[i]);
      }
    }
    return menu;
  }

  renderMenu = () => {
    const menuItems = this.getMenuItems(this.props.routes);
    const keys = Object.keys(menuItems).sort((a, b) => {
      if (a === 'noname') {
        return -1;
      }
      // Support order menu group
      // if (menuItems[a].groupOrder && menuItems[b].groupOrder) {
      //   return menuItems[a].groupOrder - menuItems[b].groupOrder;
      // }
      const groupOrderA = menuItems[a][0]?.menu?.groupOrder;
      const groupOrderB = menuItems[b][0]?.menu?.groupOrder;
      // Support order menu group
      if (groupOrderA && groupOrderB) {
        return groupOrderA - groupOrderB;
      }
      return a - b;
    });
    return keys.map((key, index) => this.renderMenuItem(menuItems[key], key, index));
  }
  getPath = (item) => {
    if (item?.getSelectedPath) {
      return item.getSelectedPath(this.context);
    }
    return isArray(item.path) && !!item.path.length ? item.path[0] : item.path;
  }
  handleClickMenu = (item) => {

    const { history, closeSidebar } = this.props;
    const path = this.getPath(item);
    history.push(path);
    if (closeSidebar) {
      closeSidebar();
    }
  }

  renderMenuItem = (items, key, index) => {
    const { location, openSideBar } = this.props;
    const menus = [];

    if (key) {
      if (key !== 'noname' && index !== 0) {
        menus.push(key !== 'undefined' ? <div className='divider-wrapper'><Divider component='li' className='divider' key={`divider-${index}`} /></div> : null);
      }
    }
    const orderedItems = items.sort((a, b) => {
      const orderA = a.menu?.order;
      const orderB = b.menu?.order;
      if (orderA && orderB) {
        return orderA - orderB;
      }
      return a - b;
    });
    return [...menus, ...orderedItems.map((item, index) => {
      const MenuIcon = item.menu.icon;
      const pathname = location.pathname?.split('/');
      const path = this.getPath(item);
      const selected = path?.includes(pathname[1]);
      return <ListItem button key={index} onClick={() => this.handleClickMenu(item, selected)} selected={selected}>
        {item.menu.icon &&
          <ListItemIcon>
            <TblTooltip title={!openSideBar ? item.menu.title : ''} placement='right'>
              {typeof MenuIcon === 'string' ?
                <Icon className={item.menu.icon} />
                :
                <MenuIcon />
              }
            </TblTooltip>
          </ListItemIcon>
        }
        <ListItemText primary={item.menu.title} />
      </ListItem>;
    })];
  }

  openContactForm = () => {
    this.setState({ openContactForm: true });
  };
  closeContactForm = () => {
    this.setState({ openContactForm: false });
  };

  render() {
    const { className, openSideBar } = this.props;
    const { openContactForm } = this.state;
    return (
      <PerfectScrollbar option={{ suppressScrollX: true }}>
        <ContactUsForm
          open={openContactForm}
          onCancel={this.closeContactForm}
        />
        <List className={className}>
          {this.renderMenu()}
          <div className='divider-wrapper'>
            <Divider component='li' className='divider' key={`divider-${this.props.routes?.length + 1}`} />
          </div>
          <ListItem
            button
            key='contact'
            onClick={() => this.openContactForm()}
          >
            <ListItemIcon>
              <TblTooltip title={!openSideBar ? 'Contact Us' : ''} placement='right'>
                <IcnMenu />
              </TblTooltip>

            </ListItemIcon>
            <ListItemText primary='Contact Us' />
          </ListItem>
        </List>
      </PerfectScrollbar >
    );
  }
}
SidebarMenu.propTypes = {
  routes: PropTypes.array,
  className: PropTypes.string,
  history: PropTypes.object,
  closeSidebar: PropTypes.func,
  location: PropTypes.object,
  openSideBar: PropTypes.bool
};

export default withRouter(SidebarMenu);