import React from 'react';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ListItemText from '@mui/material/ListItemText';

import PropTypes from 'prop-types';

import TblCheckBox from '../TblCheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

function MultiOption({ label, data, selectedList}) {
    return (
    <>
      <TblCheckBox
        icon={icon}
        checkedIcon={checkedIcon}
        checked={selectedList.indexOf(data) > -1}
      />
      <ListItemText primary={label} />
    </>
  );
}

MultiOption.propTypes= {
  label: PropTypes.string,
  data: PropTypes.any,
  selectedList: PropTypes.array
};

export default MultiOption;
