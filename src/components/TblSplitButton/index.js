import React, { useRef, useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';

import TblButton from 'components/TblButton';

import PropTypes from 'prop-types';

import styles from './styles';

const TblSplitButton = (props) => {
  const { disabled, primaryLabel, optionItems, onClickPrimary } = props;
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  return (
    <>
      <ButtonGroup ref={anchorRef} color='secondary' aria-label='split button'>
        <TblButton
          disabled={disabled}
          variant='contained'
          color='primary'
          onClick={onClickPrimary}
        >
          {primaryLabel}
        </TblButton>
        <Box
          width={'2px'}
          sx={{ backgroundColor: disabled ? '#D4D4D8' : '#0F6BE6 ' }}
         />
        <TblButton
          disabled={disabled}
          size='small'
          color='primary'
          variant='contained'
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label='select merge strategy'
          aria-haspopup='menu'
          onClick={handleToggle}
          style={{ padding: 0, minWidth: '32px' }}
        >
          <KeyboardArrowDownIcon fontSize='small' />
        </TblButton>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement='top-end'
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'top',
            }}
          >
            <Paper sx={{ marginBottom: '10px' }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu' autoFocusItem>
                  {optionItems.map((option, index) => {
                    const { label, onItemClick } = option;
                    return (
                      <MenuItem key={index} onClick={() => onItemClick()}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

TblSplitButton.defaultProps = {};

TblSplitButton.propTypes = {
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  onClickPrimary: PropTypes.func,
  optionItems: PropTypes.array,
  primaryLabel: PropTypes.string,
};

export default withStyles(styles)(TblSplitButton);
