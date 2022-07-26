import React, { useRef, useState } from 'react';

import debounce from 'lodash/debounce';
import isFunction from 'lodash/isFunction';

import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

import TblInputLabel from 'components/TblInputLabel';
import NumberInput from 'components/TblInputs/NumberInput';

import PropTypes from 'prop-types';

import useStyles from './styles';

const INPUT_TYPE = {
  TEXT: 'text',
  DATE: 'date',
  TIME: 'time',
  PHONE: 'phone',
  NUMBER: 'number',
};
const timeout = 100;
function TblInputTable(props) {
  const {
    singleSave,
    label,
    required,
    errorMessage,
    onSave,
    inputType,
    inputSize,
    helperLabel,
    onClick,
    viewOnly,
    ...rest
  } = props;
  const classes = useStyles();
  const [, setOpenActions] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const inputEl = useRef(null);
  const tooltipRef = useRef(null);

  const handleClick = debounce(() => {
    if (!!singleSave) {
      inputEl.current.value = label;
      setOpenActions(true);
    }
    if (isFunction(onClick)) {
      onClick();
    }
  }, timeout);

  const handleClickAway = debounce(() => {
    if (!!singleSave && !!inputEl?.current?.value) {
      inputEl.current.value = null;
      setOpenActions(false);
      if (isFunction(onSave)) {
        onSave();
      }
    }
  }, timeout);

  const renderNumberInputUI = () => (
      <TextField
        color='secondary'
        fullWidth={true}
        variant='outlined'
        onClick={handleClick}
        error={!!errorMessage}
        {...rest}
        InputProps={{
          inputComponent: NumberInput,
          inputProps: { ...rest, inputType },
          ...props.InputProps
        }}
      />
    );

  const renderTextInputUI = () => (
      <OutlinedInput
        fullWidth={true}
        color='secondary'
        onClick={handleClick}
        error={!!errorMessage}
        placeholder='Enter Name'
        className={viewOnly ? classes.viewOnly : ''}
        {...rest}
      />
    );

  const renderDateInputUI = () => (
      <DesktopDatePicker
        autoOk
        variant='inline'
        inputVariant='outlined'
        color='secondary'
        fullWidth={true}
        format='MM/dd/yyyy'
        placeholder='MM/dd/yyyy'
        InputAdornmentProps={{ position: 'end' }}
        keyboardIcon={<span className='icon-icn_calendar' />}
        className={viewOnly ? classes.viewOnly : ''}
        onClick={handleClick}
        readyOnly={viewOnly}
        mask='__/__/____'
        renderInput={(props) => <TextField {...props} />} 

        {...rest}
      />
    );

  const renderTimeInputUI = () => (
      <DesktopTimePicker
        autoOk
        variant='inline'
        inputVariant='outlined'
        color='secondary'
        placeholder='hh:mm AM/PM'
        fullWidth={true}
        InputAdornmentProps={{ position: 'end' }}
        mask='__:__: _M'
        keyboardIcon={<span className='icon-icn_time' />}
        readyOnly={viewOnly}
        className={viewOnly ? classes.viewOnly : ''}
        onClick={handleClick}
        renderInput={(props) => <TextField {...props} />} 
        {...rest}
      />
    );

  const renderInputUI = () => {
    switch (inputType) {
      case INPUT_TYPE.TEXT:
        return renderTextInputUI();
      case INPUT_TYPE.PHONE:
      case INPUT_TYPE.NUMBER:
        return renderNumberInputUI();
      case INPUT_TYPE.DATE:
        return renderDateInputUI();
      case INPUT_TYPE.TIME:
        return renderTimeInputUI();
      default:
        return renderTextInputUI();
    }
  };

  const renderHelperLabel = () => (
      <Tooltip title={helperLabel} placement='top' arrow>
        <HelpOutlineRoundedIcon style={{ fontSize: 12, height: 16, verticalAlign: 'bottom' }} />
      </Tooltip>
    );

  const toggleHover = () => {
    if(!!errorMessage) {
      setShowTooltip(!showTooltip);
    } else {
      setShowTooltip(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
        <Tooltip open={showTooltip} title={errorMessage} placement='top' arrow ref={tooltipRef}>
          <div className={`TblInput ${classes.root} ${classes[inputSize]} ${classes.noneBorder}`} ref={inputEl}>
            {label && (
              <TblInputLabel required={required}>
                {label}
                {helperLabel && renderHelperLabel()}
              </TblInputLabel>
            )}
            {renderInputUI()}

            {/* {(!!errorMessage || openActions) && (
              <Fade in={!!errorMessage || openActions}>
                <TblFormHelperText
                  errorMessage={errorMessage}
                  showActions={openActions}
                  onAbort={handleCancel}
                  onSave={handleSubmit}
                />
              </Fade>
            )} */}
          </div>
        </Tooltip>
      </Box>
    </ClickAwayListener>
  );
}

TblInputTable.propTypes = {
  singleSave: PropTypes.any,
  errorMessage: PropTypes.any,
  onSave: PropTypes.func,
  onAbort: PropTypes.func,
  required: PropTypes.bool,
  viewOnly: PropTypes.bool,
  label: PropTypes.any,
  inputType: PropTypes.string,
  helperLabel: PropTypes.string,
  inputSize: PropTypes.string,
  onClick: PropTypes.func,
  InputProps: PropTypes.object
};
TblInputTable.defaultProps = {
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
  noneBorder: false,
  InputProps: {}
};

export default TblInputTable;
