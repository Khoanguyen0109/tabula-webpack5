import React from 'react';

import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    '& .MuiDialog-paper': {
      maxWidth: props.width || theme.spacing(55),
      padding: theme.spacing(2, 3),
      '& .scroll-div': {
        // padding: theme.spacing(1, 0, 4, 0)
      },
    },
    '& .MuiDialogTitle-root': {
      // padding: `${theme.spacing(0, 0, 2, 0)} !important`
    },
  }),
  singleButton: {
    margin: 'auto',
  },
  doubleButton: {},
}));

function ConfirmSuspend(props) {
  const {
    message,
    title,
    okText,
    cancelText,
    onConfirmed,
    onCancel,
    open,
    progressing,
    hiddenConfirmButton,
    classesButton,
    hasCloseIcon,
    ...rest
  } = props;
  const classes = useStyles(props);
  if (!open) {
    return null;
  }
  return (
    <TblDialog
      open={open}
      hasCloseIcon={hasCloseIcon}
      title={title}
      className={classes.root}
      onClose={onCancel}
      footer={
        <>
          {cancelText && (
            <TblButton variant='outlined' color='primary' onClick={onCancel}>
              {cancelText}
            </TblButton>
          )}
          {!hiddenConfirmButton && (
            <TblButton
              variant='contained'
              color='primary'
              onClick={onConfirmed}
              disabled={progressing}
              isShowCircularProgress={progressing}
              className={classesButton ?? ''}
            >
              {okText}
            </TblButton>
          )}
        </>
      }
      {...rest}
    >
      <Typography>{message}</Typography>
    </TblDialog>
  );
}

ConfirmSuspend.propTypes = {
  cancelText: PropTypes.string,
  classesButton: PropTypes.object,
  hasCloseIcon: PropTypes.bool,
  hiddenConfirmButton: PropTypes.bool,
  message: PropTypes.string,
  okText: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirmed: PropTypes.func,
  open: PropTypes.bool,
  progressing: PropTypes.bool,
  t: PropTypes.func,
  title: PropTypes.string
};
ConfirmSuspend.defaultProps = {
  okText: 'OK',
  cancelText: 'Cancel',
  message: '',
  hiddenConfirmButton: false,
  hasCloseIcon: true
};
export default ConfirmSuspend;
