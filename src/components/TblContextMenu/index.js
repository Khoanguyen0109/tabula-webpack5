import React, { useCallback, useEffect, useState } from 'react';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import makeStyles from '@mui/styles/makeStyles';

import clsx from 'clsx';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    transition: 'none !important',

    '& .MuiPaper-root': {
      fontSize: theme.fontSize.normal,
      color: theme.mainColors.primary1[1],
      transition: 'none !important',
      boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.24)',
    },
  },
  divider: {
    borderTop: `1px solid ${theme.mainColors.gray[4]}`,
  },
  menu: {
    maxHeight: 300,
  },
}));

let previousTime = null;
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
let previousElement = null;

function TblContextMenu(props) {
  const { element, menus, onClose, hasScrollInside } = props;
  const [scrollEl, setScrollEl] = useState(null);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  // const anchorRef = useRef(null);
  const [isScrollInside, setIsScrollInside] = React.useState(false); //NOTE: catch scroll event of menu opening
  const [anchorEl, setAnchorEl] = React.useState(null); //NOTE: use useState instead useRef to fix position display of menu

  const currentTarget = element?.currentTarget || element;

  const handleCloseMenu = useCallback(
    () => {
      // if (anchorRef.current && anchorRef.current.contains(event.target)) {
      //   return;
      // }
      if (open && isScrollInside) {
        if (!!!hasScrollInside) {
          setIsScrollInside(false);
        }
        return;
      }
      if (scrollEl) {
        scrollEl.style.overflow = '';
        setScrollEl(null);
      }
      setOpen(false);
      // setMenuPosition({});
      if (onClose) {
        onClose();
      }
      // window.removeEventListener('scroll', handleCloseMenu, true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isScrollInside, open]
  );

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleClickMenuItem = (item) => (event) => {
    setOpen(false);
    handleCloseMenu(event);

    if (item.onClick) item.onClick(item.value);
  };

  const getElementPosition = (element, timeout = 0) => {
    const e = element || currentTarget;
    if (!isEmpty(e)) {
      const offsetPosition = e.getBoundingClientRect();
      if (offsetPosition) {
        setTimeout(() => {
          setOpen(true);
          setAnchorEl(e);
          // setMenuPosition(offsetPosition);
          // setIsScrollInside(true);
          // handleMouseEvent(true);
          // disableScroll(e);
        }, timeout);
      }
    } else {
      setOpen(false);
    }
  };

  // const disableScroll = (e) => {
  //   // By default disable scroll body
  //   if (!scrollClass) {
  //     document.body.style.overflow = 'hidden';
  //     setScrollEl(document.body);
  //     return;
  //   }
  //   let tmp = e;
  //   while(!tmp.classList.contains(scrollClass)) {
  //     tmp = tmp.parentNode;
  //   }
  //   tmp.addEventListener('scroll', (e) => { handleCloseMenu(e); });
  //   setScrollEl(tmp);
  //   // tmp.style.overflow = 'hidden';
  // };

  useEffect(() => {
    if (!isEqual(previousTime, element?.times)) {
      previousTime = element?.times;
      previousElement = element?.currentTarget;
      getElementPosition();
    }
  }, [element?.times]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseEvent = useCallback((isInside) => {
    setIsScrollInside(isInside);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleCloseMenu, true);
    // window.addEventListener('resize', getElementPosition, false);

    return () => {
      window.removeEventListener('scroll', handleCloseMenu, true);
      // window.removeEventListener('resize', getElementPosition, false);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) {
      window.removeEventListener('scroll', handleCloseMenu, true);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // const customStyle = {
  //   minWidth: 160,
  //   left: menuPosition?.left
  // };

  // if (menuPosition.bottom > 400) {
  //   const menuHeight = menus.length * 40 > 300 ? 300 : menus.length * 40;
  //   customStyle.top = menuPosition.top - menuHeight + menuPosition?.height;
  // } else {
  //   if (placement.includes('bottom')) {
  //     customStyle.top = menuPosition?.top + menuPosition?.height + 5;
  //   } else {
  //     customStyle.top = menuPosition?.top;
  //   }
  // }

  // if (placement.includes('right')) {
  //   customStyle.right = menuPosition?.right;
  // }

  if (menus.length === 0) {
    return null;
  }

  return (
    <Popper
      open={open}
      // anchorEl={anchorRef.current}
      anchorEl={anchorEl}
      role={undefined}
      transition
      // disablePortal
      className={classes.root}
      // style={customStyle}
      onMouseEnter={() => handleMouseEvent(true)}
      onMouseLeave={() => handleMouseEvent(false)}
      onScroll={() => handleMouseEvent(true)}
      placement='right-start'
    >
      {({ TransitionProps }) => (
        <Fade
          timeout={200}
          {...TransitionProps}
          style={{ transformOrigin: '0 0 0' }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleCloseMenu}>
              <MenuList
                className={classes.menu}
                autoFocusItem={open}
                id='menu-list-grow'
                onKeyDown={handleListKeyDown}
              >
                {menus.map((menu, i) => {
                  if (menu.func) {
                    // const CustomMenu = React.cloneElement(menu.content, {parentEl: { element} });
                    return menu.func({
                      parentEl: { element },
                      value: menu.value,
                      handleCloseMenu,
                      ...menu.customProps,
                    });
                  }
                  return (
                    <MenuItem
                      className={clsx({ [classes.divider]: menu.divider })}
                      key={`context-menu-${i}`}
                      disabled={menu.disabled}
                      onClick={handleClickMenuItem(menu)}
                    >
                      {menu.content}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}

TblContextMenu.propTypes = {
  element: PropTypes.object,
  menus: PropTypes.array,
  placement: PropTypes.array,
  onClose: PropTypes.func,
  scrollClass: PropTypes.string,
  hasScrollInside: PropTypes.bool,
};

TblContextMenu.defaultProps = {
  menus: [],
  placement: [],
  hasScrollInside: false,
};

export default React.memo(TblContextMenu);
