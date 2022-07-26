/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import makeStyles from '@mui/styles/makeStyles';

import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    marginTop: '4px',
    paddingLeft: '8px',
    fontSize: theme.fontSize.small,
    width: '100%',
    wordBreak: 'break-word'
  },
  hasOpen: {
    marginRight: '76px'
  },
  actions: {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    zIndex: 1000
  },
  actionBtn: {
    borderRadius: '8px',
    padding: '4px',
    cursor: 'pointer'
  },
  icon: {
    fontSize: '24px',
    display: 'block'
  },
  clearIcon: {
    backgroundColor: '#E9ECEF',
    color: theme.newColors.gray[700],
    marginRight: '4px'
  },
  doneIcon: {
    backgroundColor: theme.customColors.primary1.main,
    color: '#FFFFFF'
  },
  hasError: {
    color: theme.palette.error.main,
  }
}));

function TblFormHelperText(props) {
  const { errorMessage, showActions, setBlurred, onAbort, onSave } = props;
  const classes = useStyles();

  const onClickCancel = useCallback(() => {
    setBlurred && setBlurred(true);
    onAbort && onAbort();
  }, [onAbort]);

  const openBlurred = useCallback(() => {
    setBlurred && setBlurred(true);
  }, []);

  const removeBlurred = useCallback(() => {
    setBlurred && setBlurred(false);
  }, []);

  const onMouseDownCancel = useCallback(() => {
    removeBlurred();
  }, []);

  const onMouseUpCancel = useCallback(() => {
    openBlurred();
  }, []);

  const onClickSubmit = useCallback(() => {
    openBlurred();
    onSave && onSave();
  }, [onAbort]);

  const onMouseDownSubmit = useCallback(() => {
    removeBlurred();
  }, []);

  const onMouseUpSubmit = useCallback(() => {
    setBlurred && setBlurred(true);
  }, []);

  return (
    <div className={`${classes.root} tbl-helper-text`}>
      {errorMessage && (
        <div className={clsx('input-error-message', { [classes.hasOpen]: showActions, [classes.hasError]: !!errorMessage })}> {errorMessage} </div>
      )}
      {showActions && <div className={`input-actions ${classes.actions}`}>
        <div className={`${classes.actionBtn} ${classes.clearIcon} action`}
          onMouseDown={onMouseDownCancel}
          onMouseUp={onMouseUpCancel}
          onClick={onClickCancel}>
          <ClearIcon className={classes.icon} />
        </div>
        <div className={`${classes.actionBtn} ${classes.doneIcon} action`}
          onMouseDown={onMouseDownSubmit}
          onMouseUp={onMouseUpSubmit}
          onClick={onClickSubmit}>
          <DoneIcon className={classes.icon} />
        </div>
      </div>
      }
    </div>
  );
}

TblFormHelperText.propTypes = {
  showActions: PropTypes.bool,
  onAbort: PropTypes.func,
  onSave: PropTypes.func,
  errorMessage: PropTypes.any,
  setBlurred: PropTypes.func
};

TblFormHelperText.defaultProps = {
  showActions: false,
  onAbort: null,
  onSave: null,
  errorMessage: null,
};
export default TblFormHelperText;
