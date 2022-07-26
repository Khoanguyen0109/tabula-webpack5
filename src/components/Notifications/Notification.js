import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';

import { VARIANT_ICON } from 'modules/Notifications/constants';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0 2px 8px 0 rgba(47, 47, 47, 0.16)',
  },
  paper: {
    width: '480px',
    padding: theme.spacing(2),
    borderRadius: theme.borderRadius.default,
  },
  subtitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semi,
    color: theme.newColors.gray[900],
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  message: {
    marginTop: theme.spacing(1.2),
    color: theme.newColors.gray[700],
  },
  action: {
    marginTop: theme.spacing(1),

    '& .MuiButtonBase-root': {
      minWidth: theme.spacing(15),
      marginRight: theme.spacing(1),
    },
  },
  variantIcon: {
    pointerEvents: 'none',
    '& .MuiSvgIcon-root': {
      borderRadius: '50%',
    },
  },
  closeIcon: {
    marginTop: theme.spacing(-1.2),
  },

  success: {
    backgroundColor: theme.openColors.green[0],
    color: theme.openColors.green[8],
  },
  error: {
    backgroundColor: theme.openColors.red[0],
    color: theme.openColors.red[8],
  },
  info: {
    backgroundColor: theme.openColors.blue[0],
    color: theme.openColors.blue[8],
  },
  warning: {
    backgroundColor: theme.openColors.orange[0],
    color: theme.openColors.orange[5],
  },
}));

const Notification = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const {
    variant,
    notification,
    actionPrimary,
    actionSecondary,
  } = props;
  const { closeSnackbar } = useSnackbar();
  const handleDismiss = () => {
    closeSnackbar(props.id);
  };

  const variantIcon = (variant) => {
    switch (variant) {
      case VARIANT_ICON.INFO:
        return (
          <IconButton className={classes.info} size='large'>
            <ErrorOutlineIcon />{' '}
          </IconButton>
        );
      case VARIANT_ICON.SUCCESS:
        return (
          <IconButton className={classes.success} size='large'>
            <CheckIcon className={classes.success} />{' '}
          </IconButton>
        );
      case VARIANT_ICON.WARNING:
        return (
          <IconButton className={classes.warning} size='large'>
            <ReportProblemOutlinedIcon className={classes.warning} />{' '}
          </IconButton>
        );
      case VARIANT_ICON.ERROR:
        return (
          <IconButton className={classes.error} size='large'>
            <ErrorOutlineIcon className={classes.error} />{' '}
          </IconButton>
        );
      default:
        return (
          <IconButton className={classes.info} size='large'>
            <ErrorOutlineIcon fontSize='small' />{' '}
          </IconButton>
        );
    }
  };
  return (
    <Paper className={classes.paper} ref={ref}>
      <Grid container wrap='nowrap' spacing={2}>
        <Grid className={classes.variantIcon} item>
          {variantIcon(variant)}
        </Grid>
        <Grid item xs zeroMinWidth>
          <Typography className={classes.subtitle}> {notification?.title}</Typography>
          <Typography className={classes.message}>{notification?.body}</Typography>
          {(actionPrimary || actionSecondary) && (
            <Grid container className={classes.action}>
              {actionPrimary && (
                <Grid item xs={4.5}>
                  <TblButton
                    variant='contained'
                    color='primary'
                    onClick={() => actionPrimary.action(props)}
                  >
                    {' '}
                    {actionPrimary.label}
                  </TblButton>
                </Grid>
              )}
              {actionSecondary && (
                <Grid item xs={4.5}>
                  <TblButton
                    variant='outlined'
                    color='primary'
                    onClick={ () => actionSecondary.action(props)}
                  >
                    {actionSecondary.label}{' '}
                  </TblButton>
                </Grid>
              )}
              
            </Grid>
          )}
        </Grid>
        <Grid item>
          <IconButton
            aria-label='close'
            color='primary'
            fontSize='small'
            className={classes.closeIcon}
            onClick={handleDismiss}
            size='large'>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
});

Notification.propTypes = {
  actionSecondary: PropTypes.func,
  actionSecondaryLabel: PropTypes.string,
  actionPrimary: PropTypes.func,
  actionPrimaryLabel: PropTypes.string,
  id: PropTypes.number,
  notification: PropTypes.shape({
    body: PropTypes.string,
    title: PropTypes.string
  }),
  variant: PropTypes.string
};

export default Notification;
