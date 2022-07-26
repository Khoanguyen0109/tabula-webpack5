import React from 'react';

import startCase from 'lodash/startCase';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import PropTypes from 'prop-types';

function TblNotification(props, ref) {
  const { severity, children, isToast, ...rest } = props;
  return (
    <Alert severity={severity} {...rest} ref={ref}>
      {isToast ? <AlertTitle>{startCase(severity)}</AlertTitle> : <React.Fragment />}
      {children}
    </Alert>
  );
}

TblNotification.propTypes = {
  severity: PropTypes.string,
  children: PropTypes.any,
  isToast: PropTypes.bool
};

TblNotification.defaultProps = {
  severity: 'error',
  isToast: false
};

export default React.forwardRef(TblNotification);
