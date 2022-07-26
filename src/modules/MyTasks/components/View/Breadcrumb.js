import React, { useCallback, useContext, useEffect, useState } from 'react';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import TblIconButton from 'components/TblIconButton';

import PropTypes from 'prop-types';

export default function Breadcrumb({ t, title, setOpenDialog, footerContent }) {
  const [{ isOpenPopper, anchorEl }, setPopper] = useState({
    isOpenPopper: false,
    anchorEl: null,
  });

  const breadcrumb = useContext(BreadcrumbContext);

  const onSelectMenuItem = useCallback(
    (e) => {
      togglePopper(false)(e);
      setOpenDialog && setOpenDialog(true);
    },
    [setOpenDialog]
  );

  const togglePopper = (isOpenPopper) => (e) => {
    setPopper({
      isOpenPopper,
      anchorEl: isOpenPopper ? e?.currentTarget : null,
    });
  };

  useEffect(() => {
    breadcrumb.setData({
      bodyContent: (
        <Typography variant='headingSmall' component='span' className='text-ellipsis'>
          {title}
          <TblIconButton margin='0 0 0 10px' onClick={togglePopper(true)}>
            <span className='icon-icon_setting' />
          </TblIconButton>
          <ClickAwayListener
            onClickAway={togglePopper(false)}
            mouseEvent='onMouseDown'
          >
            <Popper
              open={isOpenPopper}
              role={undefined}
              anchorEl={anchorEl}
              placement='bottom-start'
            >
              {() => (
                <Paper>
                  <MenuList>
                    <MenuItem onClick={onSelectMenuItem}>
                      {t('filter_by_school_year')}
                    </MenuItem>
                  </MenuList>
                </Paper>
              )}
            </Popper>
          </ClickAwayListener>
        </Typography>
      ),
      footerContent: footerContent,
    });
  }, [isOpenPopper, anchorEl, footerContent]);

  return null;
}
Breadcrumb.propTypes = {
  t: PropTypes.func,
  setOpenDialog: PropTypes.func,
  footerContent: PropTypes.any,
};
