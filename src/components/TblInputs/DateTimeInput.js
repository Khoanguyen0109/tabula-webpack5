import React, { useState } from 'react';

import debounce from 'lodash/debounce';
import isFunction from 'lodash/isFunction';

import { TextField } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import InputWrapper from './InputWrapper';
import useStyles from './styled';
import { INPUT_TYPE } from './utils';

const timeout = 100;
function DateTimeInput(props) {
  const {
    value,
    singleSave,
    label,
    required,
    errorMessage,
    onSave,
    onAbort,
    inputType,
    inputSize,
    helperLabel,
    viewOnly,
    classNameForBox,
    format,
    placeholder,
    mask,
    spacing,
    noneBorder,
    onChange,
    ...rest
  } = props;
  const classes = useStyles();
  const [openActions, setOpenActions] = useState(false);
  const [blurred, setBlurred] = useState(true);

  const handleClickAway =() => {
    if (!!singleSave && blurred) {
      setOpenActions(false);
      setBlurred(true);
      if (isFunction(onSave)) {
        onSave();
      }
    }
  };

  const handleClick = (newValue) => {
    if (!!singleSave && !props.disabled) {
      setOpenActions(true);
      return onChange(newValue);
    }
    onChange(newValue);
  };

  const handleSubmit = debounce(() => {
    isFunction(onSave) && onSave();
    setOpenActions(false);
  }, timeout);

  const handleCancel = debounce(() => {
    isFunction(onAbort) && onAbort();
    setOpenActions(false);
  }, timeout);

  const renderDateInputUI = (
    <DesktopDatePicker
      autoOk
      value={value}
      variant='inline'
      inputVariant='outlined'
      color='secondary'
      placeholder={placeholder || 'MM/DD/yyyy'}
      inputFormat={format || 'MM/DD/yyyy'}
      InputAdornmentProps={{ position: 'end' }}
      keyboardIcon={<span className='icon-icn_calendar' />}
      className={viewOnly ? classes.viewOnly : ''}
      onChange={handleClick}
      readyOnly={viewOnly}
      mask={mask || '__/__/____'}
      renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
      {...rest}
    />
  );

  const renderTimeInputUI = (
    <DesktopTimePicker
      autoOk
      value={value}
      variant='inline'
      inputVariant='outlined'
      color='secondary'
      placeholder={placeholder || 'hh:mm am/pm'}
      InputAdornmentProps={{ position: 'end' }}
      keyboardIcon={<span className='icon-icn_time' />}
      readyOnly={viewOnly}
      className={viewOnly ? classes.viewOnly : ''}
      onChange={handleClick}
      renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
      {...rest}
    />
  );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <InputWrapper
        classNameForBox={classNameForBox}
        label={label}
        helperLabel={helperLabel}
        required={required}
        inputSize={inputSize}
        noneBorder={noneBorder}
        spacing={spacing}
        errorMessage={errorMessage}
        openActions={openActions}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        setBlurred={setBlurred}
      >
        <div className={clsx({ [classes.hasError]: !!errorMessage })}>
          {inputType === INPUT_TYPE.TIME
            ? renderTimeInputUI
            : renderDateInputUI}
        </div>
      </InputWrapper>
    </ClickAwayListener>
  );
}

DateTimeInput.propTypes = {
  classNameForBox: PropTypes.string,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.any,
  format: PropTypes.string,
  helperLabel: PropTypes.string,
  inputSize: PropTypes.string,
  inputType: PropTypes.string,
  isAllowed: PropTypes.any,
  label: PropTypes.string,
  mask: PropTypes.string,
  noneBorder: PropTypes.bool,
  onAbort: PropTypes.func,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onSave: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  singleSave: PropTypes.bool,
  spacing: PropTypes.bool,
  value: PropTypes.any,
  viewOnly: PropTypes.bool,
};
DateTimeInput.defaultProps = {
  singleSave: false,
  errorMessage: null,
  onSave: null,
  onAbort: null,
  required: false,
  onClick: null,
  label: '',
  helperLabel: '',
  inputType: 'text',
  mask: '',
  inputSize: 'large',
  disabled: false,
  spacing: 1,
  noneBorder: false,
};

export default DateTimeInput;
