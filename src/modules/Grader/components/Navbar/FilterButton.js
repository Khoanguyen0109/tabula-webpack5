import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import snakeCase from 'lodash/snakeCase';

import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';

import TblCheckbox from 'components/TblCheckBox';
import TblIconButton from 'components/TblIconButton';

import { STUDENT_PROGRESS_STATUS } from 'modules/MyCourses/constants';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    filterBtn: {
        backgroundColor: theme.newColors.gray[50],
    },
    list: {
      '& .MuiList-root': {
        width: theme.spacing(30),
        borderRadius: theme.borderRadius.default
      }
    }
}));
function FilterButton(props) {
    const classes = useStyles();
    const {t} = useTranslation();
    const { filters, changeFilter} = props;
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState();

    const onClickFilter = (e) => {
        setOpen(true);
        setAnchorEl(e.currentTarget);
      };
    return <>
      <TblIconButton className={classes.filterBtn} onClick={onClickFilter}>
          <FilterListRoundedIcon
            aria-controls='simple-menu'
            aria-haspopup='true'
          />
        </TblIconButton>
        <Menu
          keepMounted
          className={classes.list}
          anchorEl={anchorEl}
          open={open}
          onClose={() => setOpen(false)}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {Object.keys(STUDENT_PROGRESS_STATUS).map((key) => (
              <MenuItem onClick={() => changeFilter(key)} key={key}>
                <TblCheckbox checked={!!filters[key]} />
                {t(`myCourses:${snakeCase(key)}`)}
              </MenuItem>
            ))}
        </Menu>
    </>;
}

FilterButton.propTypes = {
  changeFilter: PropTypes.func,
  filters: PropTypes.array
};

export default FilterButton;
