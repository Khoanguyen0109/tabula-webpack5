import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Sort as SortIcon } from '@mui/icons-material';
import { ListItem, Menu, MenuItem, Typography } from '@mui/material';

import TblIconButton from 'components/TblIconButton';

import { PropTypes } from 'prop-types';

import { fieldsSortName } from '../utils';

function SortByName({ onClick, selectedFieldSort }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const { t } = useTranslation(['allCourses', 'common', 'error']);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <TblIconButton
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        <SortIcon />
      </TblIconButton>
      <Menu
        id='sort-by-name'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ListItem>
          <Typography variant='bodyMedium'>{t('common:sort_by')}</Typography>
        </ListItem>
        {fieldsSortName.map(({ name, label }) => (
          <MenuItem
            selected={selectedFieldSort === name}
            onClick={() => {
              onClick(name);
              handleClose();
            }}
          >
            {t(`common:${label}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

SortByName.propTypes = {
  onClick: PropTypes.func,
  selectedFieldSort: PropTypes.string
};

export default SortByName;
