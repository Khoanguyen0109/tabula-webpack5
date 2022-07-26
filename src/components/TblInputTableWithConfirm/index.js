import React, { useState } from 'react';

import debounce from 'lodash/debounce';
import isFunction from 'lodash/isFunction';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

import TblFormHelperTextInTable from 'components/TblFormHelperTextInTable';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import TblCustomRef from '../TblCustomRef';

import useStyles from './styled';

const INPUT_TYPE = {
  TEXT: 'text',
  DATE: 'date',
  TIME: 'time',
};

const timeout = 100;

function TblInputTableWithConfirm(props) {
  const {
    value,
    singleSave,
    errorMessage,
    onSave,
    onAbort,
    inputType,
    // inputSize,
    // helperLabel,
    viewOnly,
    onChange,
    ...rest
  } = props;
  const classes = useStyles();
  const [openActions, setOpenActions] = useState(false);
  const [mouseEv, setMouseEv] = useState(false);

  const handleCancel = debounce(() => {
    if (isFunction(onAbort)) {
      onAbort();
    }
    setOpenActions(false);
    setMouseEv(false);
  }, timeout);

  const handleClick = (newValue) => {
    if (!!singleSave) {
      setOpenActions(true);
      setMouseEv('onMouseDown');
     return onChange(newValue);
    }
   return onChange(newValue);
  };

  const handleClickAway = () => {
    setOpenActions(false);
    if (isFunction(onSave)) {
      onSave();
      setMouseEv(false);
    }
  };

  const handleSubmit = debounce(() => {
    if (isFunction(onSave)) {
      onSave();
      setOpenActions(false);
      setMouseEv(false);
    }
  }, timeout);

  const renderTextInputUI = () => (
      <Input
        disableUnderline
        fullWidth={true}
        color='secondary'
        onClick={handleClick}
        error={!!errorMessage}
        placeholder='Enter Name'
        className={viewOnly ? classes.viewOnly : ''}
        value={value}
        {...rest}
      />
    );

  const renderDateInputUI = () => (
      <Tooltip placement={'bottom'} title={errorMessage || ''} arrow>
        <DesktopDatePicker
          autoOk
          value={value}
          variant='inline'
          color='secondary'
          format='MM/dd/yyyy'
          placeholder='MM/dd/yyyy'
          invalidDateMessage={null}
          keyboardIcon={<span className='icon-icn_calendar' />}
          className={ clsx( classes.input, viewOnly ? classes.viewOnly : '')}
          onChange={handleClick}
          readyOnly={viewOnly}
          mask='__/__/____'
          renderInput={(props) => <TextField sx={{width: '100%'}} {...props} />} 

          {...rest}
        />
      </Tooltip>
    );

  const renderTimeInputUI = () => (
      <DesktopTimePicker
        autoOk
        value={value}
        variant='inline'
        color='secondary'
        placeholder='HH:mm A'
        fullWidth={true}
        InputAdornmentProps={{ position: 'end' }}
        mask='__:__: _M'
        keyboardIcon={<span className='icon-icn_time' />}
        readyOnly={viewOnly}
        className={ clsx( classes.input, viewOnly ? classes.viewOnly : '')}
        onChange={handleClick}
        renderInput={(props) => <TextField sx={{width: '100%'}} {...props} />} 

        {...rest}

      />
    );

  const renderInputUI = () => {
    switch (inputType) {
      case INPUT_TYPE.TEXT:
        return renderTextInputUI();
      case INPUT_TYPE.DATE:
        return renderDateInputUI();
      case INPUT_TYPE.TIME:
        return renderTimeInputUI();
      default:
        return renderTextInputUI();
    }
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent={mouseEv}>
      <div className={`${classes.root}`}>
        {renderInputUI()}
        {openActions && (
          <Fade in={openActions}>
            <TblCustomRef>
              <TblFormHelperTextInTable
                onAbort={handleCancel}
                onSave={handleSubmit}
              />
            </TblCustomRef>
          </Fade>
        )}
      </div>
    </ClickAwayListener>
  );
}

TblInputTableWithConfirm.propTypes = {
  errorMessage: PropTypes.string,
  helperLabel: PropTypes.string,
  inputSize: PropTypes.string,
  inputType: PropTypes.string,
  label: PropTypes.string,
  onAbort: PropTypes.func,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onSave: PropTypes.func,
  required: PropTypes.bool,
  singleSave: PropTypes.bool,
  value: PropTypes.any,
  viewOnly: PropTypes.bool
};

// TextFieldWithTooltip.propTypes = {
//   title: PropTypes.any,
// };
TblInputTableWithConfirm.defaultProps = {
  singleSave: false,
  errorMessage: null,
  onSave: null,
  onAbort: null,
  required: false,
  onClick: null,
  label: '',
  helperLabel: '',
  inputType: 'text',
  inputSize: 'large',
};

export default TblInputTableWithConfirm;
