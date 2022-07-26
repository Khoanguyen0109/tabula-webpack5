import React from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import withStyles from '@mui/styles/withStyles';

import clsx from 'clsx';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  root: {
    position: 'relative',
    marginTop: '8px',
    paddingLeft: '8px',
    fontSize: theme.fontSize.normal,
  },

  hasOpen: {
    marginRight: '76px',
  },
  actions: {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    zIndex: 1000,
  },
  actionBtn: {
    borderRadius: '8px',
    padding: '6px',
    cursor: 'pointer',
  },
  icon: {
    fontSize: '20px',
    height: '20px',
    width: '20px',
    display: 'block',
  },
  clearIcon: {
    backgroundColor: '#E9ECEF',
    color: '#495057',
    marginRight: '4px',
  },
  doneIcon: {
    backgroundColor: '#1A7AE6',
    color: '#FFFFFF',
  },
  hasError: {
    color: theme.palette.error.main,
  },
});

const InputSingleActions = ({
  classes,
  className,
  IconSave,
  IconCancel,
  handleSave,
  handleCancel,
  error,
  open,
}) => (
  <div className={`${classes.root} ${className}`}>
    {error && (
      <div
        className={clsx('input-error-message', {
          [classes.hasOpen]: open,
          [classes.hasError]: error.hasError,
        })}
      >
        {' '}
        {error.errorMessage}{' '}
      </div>
    )}
    {open && (
      <div className={`input-actions ${classes.actions}`}>
        <div
          className={`${classes.actionBtn} ${classes.clearIcon} action`}
          onClick={handleCancel}
        >
          <IconCancel className={classes.icon} />
        </div>
        <div
          className={`${classes.actionBtn} ${classes.doneIcon} action`}
          onClick={handleSave}
        >
          <IconSave className={classes.icon} />
        </div>
      </div>
    )}
  </div>
);
InputSingleActions.propTypes = {
  classes: PropTypes.object,

  label: PropTypes.array,
  required: PropTypes.bool,
  open: PropTypes.bool,

  handleSave: PropTypes.func,
  handleCancel: PropTypes.func,

  IconSave: PropTypes.any,
  IconCancel: PropTypes.any,
  error: PropTypes.object,
  className: PropTypes.any,
};
InputSingleActions.defaultProps = {
  IconSave: DoneIcon,
  IconCancel: ClearIcon,
  open: true,
  error: {
    hasError: false,
    errorMessage: '',
  },
};
export default withStyles(styles)(InputSingleActions);
