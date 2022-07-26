import React from 'react';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Drawer from '@mui/material/Drawer';

import PropTypes from 'prop-types';
// import Overlay from './Overlay';

import useStyles from './styled';

const TblDrawer = React.forwardRef(function TblDrawer(props, ref) {
  const classes = useStyles();
  const { children, title, footer, ...rest } = props;
  return (<Drawer ref={ref} {...rest} classes={classes} disableBackdropClick disableEscapeKeyDown disableEnforceFocus>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {children}
      </DialogContent>
      {!!footer && <DialogActions>
        {footer}
      </DialogActions>}
    </Drawer>
  );
});

TblDrawer.propTypes = {
  children: PropTypes.any,
  ref: PropTypes.any,
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  footer: PropTypes.any
};

export default TblDrawer;