import React from 'react';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

import EditorButton from '../EditorButton';
import RibbonButton from '../RibbonButton';
const useStyles = makeStyles((theme) => ({
  root: {},
  editorPopper: {
    zIndex: 1,
    '&:focus, & .MuiPaper-root:focus, & .MuiList-root:focus': {
      outline: 'none',
    },
    '& .MuiPaper-root': {
      padding: theme.spacing(1, 0.5),
      border: '1px solid #E9ECEF',
      boxSizing: 'border-box',
      boxShadow: '0px 8px 32px rgba(33, 37, 41, 0.16)',
      borderRadius: theme.spacing(1),
    },
    '& .MuiList-padding': {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  rootDisabled: {
    cursor: 'default',
    opacity: 0.5,
  },
}));

export default function OtherOptions({
  buttons,
  IconButton,
  plugin,
  format,
  disabled,
  title,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = React.useCallback(() => {
    if (disabled) {
      return;
    }
    setOpen(!open);
  }, [disabled, open]);

  const handleClose = (event) => {
    if (disabled) {
      return;
    }
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (disabled) {
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div
      ref={anchorRef}
      className={`${classes.root} ${open ? 'editor-selected' : ''} ${
        disabled ? classes.rootDisabled : classes.rootNormal
      }`}
      onClick={handleToggle}
    >
      <EditorButton
        title={title}
        disabled={disabled}
        svgIconComponent={IconButton}
      />
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        className={classes.editorPopper}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
              zIndex: 1,
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id='menu-list-grow'
                  onKeyDown={handleListKeyDown}
                >
                  {Object.keys(buttons).map((key) => (
                    <RibbonButton
                      key={key}
                      plugin={plugin}
                      format={format}
                      button={buttons[key]}
                    />
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}

OtherOptions.propTypes = {
  classes: PropTypes.object,
  buttons: PropTypes.object,
  IconButton: PropTypes.any,
  plugin: PropTypes.any,
  format: PropTypes.object,
  disabled: PropTypes.bool,
  title: PropTypes.string,
};
