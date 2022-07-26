import * as React from 'react';

import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

import PropTypes from 'prop-types';

const CustomSwitch = styled(Switch, { shouldForwardProp: (props) => props })(
  ({ theme }) => ({
    width: theme.spacing(5.5), //44
    height: theme.spacing(3), //24
    padding: 0,
    '&:active': {
      '& .MuiSwitch-track': {
        boxShadow: `0 0 3px ${theme.newColors.primary[800]}`,
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 0,
      '&.Mui-checked': {
        '& + .MuiSwitch-track': {
          border: `1.5px solid ${theme.newColors.primary[800]}`,
          backgroundColor: theme.newColors.primary[500],
          opacity: 1,
        },
        '& .MuiSwitch-thumb': {
          border: `1.5px solid ${theme.newColors.primary[800]}`,
          backgroundColor: theme.openColors.white,
        },
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        border: `1.5px solid ${theme.newColors.gray[200]}`,
        opacity: 1,
        color: theme.openColors.white,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        backgroundColor: theme.newColors.gray[100],
        opacity: 1,
        border: `1.5px solid ${theme.newColors.gray[200]}`,
        color: 'white',
        boxShadow: 'none',
      },
    },
    '& .MuiSwitch-thumb': {
      margin: 2,
      border: `1.5px solid ${theme.newColors.gray[400]}`,
      width: theme.spacing(2.5), //20
      height: theme.spacing(2.5), //20
      boxShadow: 'none',
    },
    '& .MuiSwitch-track': {
      margin: 2,
      backgroundColor: theme.openColors.white,
      border: `1.5px solid ${theme.newColors.gray[400]}`,
      borderRadius: '20px',
      width: theme.spacing(5), //40
      height: theme.spacing(2.5), //20
      opacity: 1,
    },
  })
);
export default function TblSwitch(props) {
  const { checked, onChange, disabled } = props;
  return (
    <CustomSwitch
      disableRipple={true}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
    />
  );
}
TblSwitch.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
