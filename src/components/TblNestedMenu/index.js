/* eslint-disable unused-imports/no-unused-vars */
import React, { useImperativeHandle, useRef, useState } from 'react';

import ArrowRight from '@mui/icons-material/ArrowRight';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';

import clsx from 'clsx';
import PropTypes from 'prop-types';

const TRANSPARENT = 'rgba(0,0,0,0)';
const useMenuItemStyles = makeStyles((theme) => ({
  root: (props) => ({
      backgroundColor: props.open ? theme.palette.action.hover : TRANSPARENT,
      overflow: 'hidden',
      
  }),
  paper: {
    overflow: 'hidden',
    maxHeight: 632
  },
  menuContent: {
    maxHeight: 600,
    overflow: 'auto',
    pointerEvents: 'auto',
    outline: 'none'
  },
  loading: {
    overflow: 'hidden'
  }
}));
/**
* Use as a drop-in replacement for `<MenuItem>` when you need to add cascading
* menu elements as children to this component.
*/
const NestedMenuItem = React.forwardRef(function NestedMenuItem(props, ref) {
  const { 
    parentMenuOpen, 
    component: WrapperComponent,
    label, 
    rightIcon, 
    children, 
    className, 
    tabIndex: tabIndexProp, 
    MenuProps,
    ContainerProps: ContainerPropsProp,
     ...MenuItemProps
  } = props;
  const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp;
  const menuItemRef = useRef(null);
  useImperativeHandle(ref, () => menuItemRef.current);
  const containerRef = useRef(null);
  useImperativeHandle(containerRefProp, () => containerRef.current);
  // const menuContainerRef = useRef(null);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleMouseEnter = (event) => {
      setIsSubMenuOpen(true);
      if (ContainerProps === null || ContainerProps === void 0 ? void 0 : ContainerProps.onMouseEnter) {
          ContainerProps.onMouseEnter(event);
      }
  };
  const handleMouseLeave = (event) => {
      setIsSubMenuOpen(false);
      if (ContainerProps === null || ContainerProps === void 0 ? void 0 : ContainerProps.onMouseLeave) {
          ContainerProps.onMouseLeave(event);
      }
  };
  // Check if any immediate children are active
  // const isSubmenuFocused = () => {
  //   const active = containerRef.current?.ownerDocument?.activeElement;
  //   for (const child of menuContainerRef.current?.children ?? []) {
  //     if (child === active) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };
  const handleFocus = (event) => {
      if (event.target === containerRef.current) {
          setIsSubMenuOpen(true);
      }
      if (ContainerProps === null || ContainerProps === void 0 ? void 0 : ContainerProps.onFocus) {
          ContainerProps.onFocus(event);
      }
  };
  // const handleKeyDown = (event) => {
  
  //     const active = containerRef.current?.ownerDocument?.activeElement;
  
  //     if (event.key === 'ArrowLeft' && isSubmenuFocused()) {
  //       // eslint-disable-next-line no-unused-expressions
  //       containerRef?.current?.focus();
  //     }
  
  //     if (
  //       event.key === 'ArrowRight' &&
  //       event.target === containerRef.current &&
  //       event.target === active
  //     ) {
  //       const firstChild = menuContainerRef.current ? menuContainerRef.current.children[0] : null;
  //       // eslint-disable-next-line no-unused-expressions
  //       firstChild?.focus();
  //     }
  // };
  const open = isSubMenuOpen && parentMenuOpen;
  const menuItemClasses = useMenuItemStyles({ open });
  // Root element must have a `tabIndex` attribute for keyboard navigation
  let tabIndex;
  if (!props.disabled) {
      tabIndex = tabIndexProp !== undefined ? tabIndexProp : 1;
  }
  return (
    <div
      {...ContainerProps}
      ref={containerRef}
      onFocus={handleFocus}
      tabIndex={tabIndex}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // onKeyDown={handleKeyDown}
    >
      <MenuItem
        {...MenuItemProps}
        className={clsx(menuItemClasses.root, className)}
        ref={menuItemRef}
      >
        {label}
        {rightIcon}
      </MenuItem>
      <Menu
        style={{pointerEvents: 'none'}}
        anchorEl={menuItemRef.current}
        classes={{paper: menuItemClasses.paper}}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={open}
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        onClose={() => {
          setIsSubMenuOpen(false);
        }}
      >
        <div className={clsx(menuItemClasses.menuContent, {[menuItemClasses.loading]: props.loading})}>
          {children}
        </div>
      </Menu>
    </div>
  );
});
NestedMenuItem.propTypes = {
  parentMenuOpen: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  component: PropTypes.any,
  rightIcon: PropTypes.any,
  children: PropTypes.any,
  className: PropTypes.string,
  label: PropTypes.element,
  MenuProps: PropTypes.object,
  tabIndex: PropTypes.any,
  ContainerProps: PropTypes.any
};
NestedMenuItem.defaultProps = {
  rightIcon: <ArrowRight />,
  ContainerProps: {},
  component: <div/>,
  MenuProps: {}
};
export default NestedMenuItem;
