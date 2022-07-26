import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SortIcon from '@mui/icons-material/Sort';
import { ListItem, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import makeStyles from '@mui/styles/makeStyles';

import { PropTypes } from 'prop-types';

import { fieldsSortName } from '../../../../shared/AllCourses/utils';

const useStyles = makeStyles((theme) => ({
  popper: {
    top: '20px !important',
    inset: '20px auto auto -150px !important',
  },
  menuSort: {
    textTransform: 'capitalize',
    marginLeft: theme.spacing(0.5),
    '& .MuiButton-root:hover, & .MuiButton-root:focus': {
      background: 'none',
    },
    '& .MuiSvgIcon-root': {
      fontSize: theme.fontSizeIcon.medium,
    },
    '& .MuiListSubheader-sticky': {
      lineHeight: 'normal',
      '&:focus': {
        outline: 'none',
      },
    },
    '& .MuiButton-root': {
      minWidth: 'auto',
      padding: 0,
    },
  },
  menuLi: {
    '&.selected-sort': {
      position: 'relative',
      color: theme.palette.secondary.main,
      backgroundColor: 'inherit',
      '&::after': {
        fontFamily: 'icomoon',
        position: 'absolute',
        right: theme.spacing(0.5),
        color: theme.palette.secondary.main,
        content: '"\\e929"',
      },
    },
    '&:hover': {
      backgroundColor: '#E0EDFF',
      color: '#0567F0',
    },
  },
  typoItem: {
    color: theme.newColors.gray[600],
  },
}));

function SortByName(props) {
  const anchorRef = useRef(null);
  const { onClick, selectedFieldSort } = props;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(['allCourses', 'common', 'error']);
  const classes = useStyles();

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    setOpen((prevOpen) => !prevOpen);
  }, []);
  const handleClose = useCallback((event) => {
    if (anchorRef.current && anchorRef.current.contains(event?.target)) {
      return;
    }
    setOpen(false);
  }, []);

  const handleListKeyDown = useCallback((event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }, []);
  const handleClick = useCallback(
    (name) => (e) => {
      e.stopPropagation();
      handleClose();
      onClick(name);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [handleClose, onClick]
  );

  return (
    <div className={classes.menuSort}>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
      >
        <SortIcon />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement='bottom-end'
        className={classes.popper}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper sx={{ width: 184, borderRadius: '8px' }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                  <ListItem>
                    <Typography
                      variant='bodyMedium'
                      className={classes.typoItem}
                    >
                      {t('common:sort_by')}
                    </Typography>
                  </ListItem>
                  {fieldsSortName.map((field) => (
                    <MenuItem
                      onClick={handleClick(field.name)}
                      className={`${classes.menuLi} ${
                        selectedFieldSort === field.name ? 'selected-sort' : ''
                      }`}
                    >
                      {t(`common:${field.label}`)}
                    </MenuItem>
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

SortByName.propTypes = {
  onClick: PropTypes.func,
  selectedFieldSort: PropTypes.string,
};

export default SortByName;
