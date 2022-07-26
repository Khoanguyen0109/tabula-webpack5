import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router';

import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popper from '@mui/material/Popper';
import makeStyles from '@mui/styles/makeStyles';

import { isGuardian, isStudent } from 'utils/roles';

import { USER_BEHAVIOR } from 'shared/User/constants';

import PropTypes from 'prop-types';

import { AuthDataContext } from '../../AppRoute/AuthProvider';
import OnBoardingProfile from '../../modules/MyTasks/components/OnBoardingProfile';

import GuardianMenu from './GuardianMenu';
import UserInfoCard from './UserInfoCard';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: theme.fontSize.normal,
    padding: 0,
    width: '100%',
  },
  list: {
    padding: 0,
    fontSize: theme.fontSize.normal,
    '& .MuiListItem-root': {
      boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.24)',
      padding: theme.spacing(1, 2, 2, 2),
    },
    '& .MuiListItemText-root': {
      margin: theme.spacing(0, 0, 0, 1),
    },
    '& .MuiListItemText-root span': {
      display: 'block',
    },
    '& .MuiListItemText-root span.username': {
      fontSize: theme.fontSize.normal,
      lineHeight: 1.3,
    },
    '& .MuiListItemText-root span.email': {
      fontSize: theme.fontSize.small,
      fontWeight: 300,
      lineHeight: 1.4,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  listIcon: {
    minWidth: 40,
    textTransform: 'uppercase',
  },
  avatar: {
    minWidth: 40,
    fontSize: theme.fontSize.normal,
  },
  popper: {
    zIndex: theme.zIndex.drawer + 2,
    minWidth: 280,
    boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.24)',
    background: 'white',
    borderRadius: 4,
  },
  domain: {
    padding: '8px 10px',
  },
  accountText: {
    color: theme.mainColors.tertiary[7],
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
    padding: '8px 10px 4px 10px',
  },
  menuItem: {
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSize.normal,
    paddingLeft: '10px',
  },
  userMenuIcn: {
    fontSize: theme.fontSizeIcon.medium,
  },
}));

function UserMenu({ routes, history, closeSidebar, openSideBar }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openOnBoarding, setOpenOnBoarding] = React.useState(false);
  const anchorRef = React.useRef(null);

  const toggle = (e) => {
    e.preventDefault();
    setOpen((prevOpen) => !prevOpen);
  };

  const getMenuItems = () => {
    const menu = [];
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].userMenu) {
        menu.push(routes[i]);
      }
    }
    return menu.sort((a, b) => {
      if (a.userMenu.order && b.userMenu.order) {
        return a.userMenu.order - b.userMenu.order;
      }
      return 0;
    });
  };

  const handleClose = (event, item) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    if (
      // item
      //NOTE: Change condition to handle onCLose function in GuardianMenu
      !!item?.path
    ) {
      history.push(item.path);
      // if (closeSidebar) {
      //   closeSidebar();
      // }
    }
    //NOTE: handle case user open sidebar then click away
    if (closeSidebar) {
      closeSidebar();
    }
  };
  const authContext = useContext(AuthDataContext);
  const { currentUser } = authContext;

  const subdomain = authContext?.currentUser?.organization?.subdomain;
  const domain = window.location.hostname.replace(`${subdomain}.`, '');

  const organization = {
    name: authContext?.currentUser?.organization?.organizationName,
    email: `${subdomain}.${domain}`,
  };

  useEffect(() => {
    if (currentUser) {
      const { settings } = currentUser;
      const haveAccessed = settings?.behavior?.includes(
        USER_BEHAVIOR.HAVE_SET_UP_PROFILE
      );
      if (
        !haveAccessed &&
        (isGuardian(currentUser) || isStudent(currentUser))
      ) {
        setOpenOnBoarding(true);
      }
    }
  }, [currentUser]);

  return (
    <div className={classes.root}>
      <AuthDataContext.Consumer>
        {({ currentUser }) => (
            <>
              <List className={classes.list}>
                <ListItem
                  button
                  onClick={toggle}
                  ref={anchorRef}
                  aria-controls={open ? 'menu-list-grow' : undefined}
                >
                  <ListItemIcon className={classes.listIcon}>
                    <Avatar className={classes.avatar}>{`${
                      currentUser?.firstName ? currentUser.firstName[0] : ''
                    }${
                      currentUser?.lastName ? currentUser.lastName[0] : ''
                    }`}</Avatar>
                  </ListItemIcon>
                  {openSideBar && (
                    <>
                      <ListItemText>
                        <Typography
                          noWrap
                          className='username'
                        >{`${currentUser?.firstName} ${currentUser?.lastName}`}</Typography>
                        <span className='email'>{currentUser?.email}</span>
                      </ListItemText>
                      <div
                        className={`icon-icn_sort_arrow_down ${classes.userMenuIcn}`}
                       />
                    </>
                  )}
                </ListItem>
                <ClickAwayListener onClickAway={handleClose}>
                  <Popper
                    className={classes.popper}
                    open={open}
                    anchorEl={anchorRef.current}
                    container={document.body}
                    role={undefined}
                    transition
                    placement='top'
                  >
                    {({ TransitionProps, placement }) => (
                      <Fade
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === 'bottom'
                              ? 'center top'
                              : 'center bottom',
                        }}
                      >
                        <MenuList autoFocusItem={open} id='menu-list-grow'>
                          <div className={classes.domain}>
                            <UserInfoCard itemInfo={organization} />
                          </div>
                          <Divider light />

                          {isGuardian(authContext?.currentUser) && (
                            <GuardianMenu handleCloseMenuList={handleClose} />
                          )}
                          <Divider light />
                          <div className={classes.accountText}>Account</div>
                          {getMenuItems().map((item, index) => (
                              <MenuItem
                                onClick={(e) => handleClose(e, item)}
                                key={index}
                                className={classes.menuItem}
                              >
                                {item.userMenu.title}
                              </MenuItem>
                            ))}
                        </MenuList>
                      </Fade>
                    )}
                  </Popper>
                </ClickAwayListener>
              </List>
              {currentUser && (
                <OnBoardingProfile
                  open={openOnBoarding}
                  onClose={() => setOpenOnBoarding(false)}
                />
              )}
            </>
          )}
      </AuthDataContext.Consumer>
    </div>
  );
}
UserMenu.propTypes = {
  classes: PropTypes.object,
  routes: PropTypes.array,
  history: PropTypes.object,
  closeSidebar: PropTypes.func,
  openSideBar: PropTypes.bool,
};
export default withRouter(UserMenu);
