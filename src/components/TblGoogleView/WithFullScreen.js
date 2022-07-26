import React from 'react';
import { useTranslation } from 'react-i18next';

import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  AppBar,
  Dialog,
  Slide,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import TblIconButton from 'components/TblIconButton';

import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    height: theme.spacing(5),

    backgroundColor: theme.customColors.primary1.main,
    '& span': {},
  },
  btn: {
    display: 'flex',
  },
  text: {
    marginLeft: theme.spacing(0.5),
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.normal,
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

function WithFullScreen(props) {
  const { open, onClose, children } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Dialog sx={{
      zIndex: theme.zIndex.drawer +1,

    }}
fullScreen
open={open}
TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <TblIconButton
          edge='start'
          className={classes.btn}
          color='inherit'
          onClick={onClose}
          aria-label='close'
         >
          <FullscreenExitIcon />{' '}
          <div className={classes.text}>{t('common:exit_full_screen')}</div>
        </TblIconButton>
      </AppBar>
      {children}
    </Dialog>
  );
}

WithFullScreen.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

export default WithFullScreen;
