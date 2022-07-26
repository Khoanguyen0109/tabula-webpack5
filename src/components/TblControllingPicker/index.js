import React, { useState } from 'react';

import { TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    position: 'relative',
    width: theme.spacing(4),
    height: theme.spacing(4)

  },
  inputDatePicker: {
    visibility: 'hidden',
    width: 0
  },
  calendarIcon: {
    background: theme.openColors.white,
    fontSize: theme.fontSizeIcon.medium,
    padding: theme.spacing(0.5),
    borderRadius: '50%'
  }
}));

function TblControllingPicker(props) {
  const classes = useStyles();

  const { date , onChange } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${classes.container} ${props.className}`}>
       <div className={classes.inputDatePicker}>
        <DesktopDatePicker
          // variant='inline'
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          value={date}
          onChange={onChange}
          renderInput={(props) => <TextField {...props} />} 
          
        />
      </div>
      <div onClick={() => setIsOpen(true)} className={`icon-icn_calendar cursor-pointer ${classes.calendarIcon}`} />
     
    </div>
  );
}

TblControllingPicker.propTypes = {
  className: PropTypes.any,
  onChange: PropTypes.func,
  date: PropTypes.any
};

export default TblControllingPicker;