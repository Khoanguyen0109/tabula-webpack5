import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import TblCustomScrollbar from '../TblCustomScrollbar';

import styled from './styled';

const TblDialog = (props) => {
  // render() {
  const {
    open,
    children,
    footer,
    title,
    subtitle,
    subtitle2,
    showScrollBar,
    header,
    hasCloseIcon,
    onClose,
    loading,
    ...rest
  } = props;
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.only('lg'));
  const downLg = useMediaQuery(theme.breakpoints.down('lg'));
  const maxHeight = props?.maxHeightContent ?? (lg || downLg ? 580 : 680);
  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  return (
    <Dialog open={open} {...rest} scroll='paper' disableEscapeKeyDown>
      {hasCloseIcon && (
        <IconButton
          aria-label='close'
          className='closeButton'
          onClick={onClose}
          size='large'
        >
          <CloseIcon />
        </IconButton>
      )}
      {header && <Box className='header'>{header}</Box>}
      {loading ? (
        <>
          <Skeleton width={150} />
          <Skeleton width={100} />
        </>
      ) : (
        <>
          {title && (
            <DialogTitle>
              <Typography variant='titleLarge'>{title}</Typography>
            </DialogTitle>
          )}
          {subtitle && (
            <Typography className={clsx('subtitle')}>{subtitle}</Typography>
          )}
          {subtitle2 && (
            <Typography className={clsx('subtitle2')}>{subtitle2}</Typography>
          )}
        </>
      )}
      <DialogContent className='scroll-div' ref={descriptionElementRef}>
        {showScrollBar ? (
          <TblCustomScrollbar maxHeightScroll={maxHeight}>
            <Box>{children}</Box>
          </TblCustomScrollbar>
        ) : loading ? (
          <Skeleton height={200} />
        ) : (
          children
        )}
      </DialogContent>

      {!!footer && <DialogActions>{footer}</DialogActions>}
    </Dialog>
  );
};

TblDialog.propTypes = {
  children: PropTypes.node,
  footer: PropTypes.node,
  hasCloseIcon: PropTypes.bool,
  header: PropTypes.node,
  loading: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  showScrollBar: PropTypes.bool,
  subtitle: PropTypes.string,
  subtitle2: PropTypes.string,
  title: PropTypes.string,
  maxHeightContent: PropTypes.number,
};

TblDialog.defaultProps = {
  showScrollBar: true,
  open: false,
  loading: false,
};

export default withStyles(styled)(TblDialog);
