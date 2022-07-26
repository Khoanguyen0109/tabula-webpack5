import React from 'react';

import { TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DesktopDatePicker } from '@mui/x-date-pickers-pro';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  viewOnly: {
    background: theme.newColors.gray[100],
    '& .MuiOutlinedInput-input': {
      color: `${theme.newColors.gray[700]} !important`,
    },
    '& .MuiIconButton-label': {
      color: `${theme.newColors.gray[700]} !important`,
    },
    '& input': {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: ' hidden !important',
      textOverflow: 'ellipsis',
    },
  },
}));

function TblDatePicker(props) {
  const classes = useStyles();
  const { value, placeholder, viewOnly, onChange, ...rest } = props;
  return (
    <DesktopDatePicker
      autoOk
      value={value}
      variant='inline'
      inputVariant='outlined'
      color='secondary'
      placeholder={placeholder || 'MM/dd/yyyy'}
      inputFormat={'MM/dd/yyyy'}
      InputAdornmentProps={{ position: 'end' }}
      keyboardIcon={<span className='icon-icn_calendar' />}
      className={viewOnly ? classes.viewOnly : ''}
      onChange={onChange}
      readyOnly={viewOnly}
      mask={'__/__/____'}
      renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
      {...rest}
    />
  );
}

TblDatePicker.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.object,
  viewOnly: PropTypes.bool
};

export default TblDatePicker;
