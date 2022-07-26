import React, { useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';

import debounce from 'lodash/debounce';
import isFunction from 'lodash/isFunction';

import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ClickAwayListener } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import TblIconButton from 'components/TblIconButton';

import clsx from 'clsx';
import { isEqual } from 'lodash-es';
import PropTypes from 'prop-types';

import DateTimeInput from './DateTimeInput';
import InputWrapper from './InputWrapper';
import NumberInput from './NumberInput';
import useStyles from './styled';
import { INPUT_TYPE } from './utils';

const timeout = 100;

const TblInputs = React.forwardRef((props, ref) => {
  const {
    singleSave,
    required,
    label,
    placeHolder,
    multiline,
    // Type for browser input
    type,
    //Type for rendering
    inputType,
    helperLabel,
    errorMessage,
    errorTooltip,

    // Function
    onSave,
    onAbort,
    onClick,

    // For number
    decimalScale,
    isAllowed,

    // Styles
    inputSize,
    spacing,
    classNameForBox,
    noneBorder,
    inputProps,
    InputProps,
    startAdornment,
    hasSearchIcon,
    hasClearIcon,
    ...rest
  } = props;
  const classes = useStyles();
  const [openActions, setOpenActions] = useState(false);
  const [blurred, setBlurred] = useState(true);
  const inputEl = useRef(null);

  const handleClick = debounce(() => {
    if (!!singleSave && !props.disabled) {
      inputEl.current.value = label;
      setOpenActions(true);
    }
    isFunction(onClick) && onClick();
    // inputRef.current.focus();
  }, timeout);
  const handleClickAway = debounce(() => {
    if (!!singleSave && !!inputEl?.current?.value && !props.disabled) {
      inputEl.current.value = null;
      setOpenActions(false);
      if (onSave) {
        onSave();
      }
    }
  }, timeout);

  const handleSubmit = debounce(() => {
    isFunction(onSave) && onSave();
    setOpenActions(false);
  }, timeout);

  const handleCancel = debounce(() => {
    if (isFunction(onAbort) && !!inputEl?.current?.value) {
      inputEl.current.value = null;
      onAbort();
      setOpenActions(false);
    }
  }, timeout);

  const onBlur = () => {
    if (!blurred) {
      return;
    }
    handleSubmit();
  };

  const onFocus = () => {
    handleClick();
  };

  const onResetSearch = (e) => {
    e.target.value = '';
    props.onChange(e);
  };

  const renderNumberInputUI = (
    <TextField
      // ref={ref}
      inputRef={ref}
      InputProps={{
        ...InputProps,
        startAdornment,
        inputComponent: NumberInput,
        inputProps: {
          ...inputProps,
          inputType,
          decimalScale,
          isAllowed,
          onBlur,
          onFocus,
        },
      }}
      color='secondary'
      fullWidth={true}
      variant='outlined'
      onClick={handleClick}
      error={!!errorMessage}
      {...rest}
    />
  );

  const renderTextInputUI = (
    <TextField
      inputRef={ref}
      color='secondary'
      placeholder={placeHolder || 'Enter Text'}
      className={clsx(classes.input, { [classes.inputError]: errorMessage })}
      inputProps={{
        ...inputProps,
        type,
      }}
      multiline={multiline}
      InputProps={{
        ...InputProps,
        startAdornment: hasSearchIcon ? (
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        ) : (
          startAdornment
        ),
        endAdornment: (
          <InputAdornment position='end'>
            {hasClearIcon
              ? props.value && (
                  <TblIconButton onClick={onResetSearch}>
                    <CancelRoundedIcon className={classes.clearIcon} />
                  </TblIconButton>
                )
              : InputProps?.endAdornment || props.endAdornment}
            {!!errorTooltip && (
              <Tooltip title={errorTooltip} placement='top'>
                <ErrorOutlineIcon className={`${classes.hasError}`} />
              </Tooltip>
            )}
          </InputAdornment>
        ),
      }}
      fullWidth={true}
      variant='outlined'
      onClick={handleClick}
      error={errorMessage || errorTooltip}
      {...rest}
    />
  );

  const renderPhoneInputUI = (
    <PhoneInput
      country={'us'}
      countryCodeEditable={false}
      enableSearch={true}
      {...rest}
    />
  );

  const renderInput = () => {
    switch (inputType) {
      case INPUT_TYPE.PHONE:
        return renderPhoneInputUI;
      case INPUT_TYPE.NUMBER:
        return renderNumberInputUI;
      default:
        return renderTextInputUI;
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <InputWrapper
        ref={inputEl}
        classNameForBox={classNameForBox}
        label={label}
        helperLabel={helperLabel}
        required={required}
        multiline={multiline}
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
          {renderInput()}
        </div>
      </InputWrapper>
    </ClickAwayListener>
  );
});

TblInputs.propTypes = {
  value: PropTypes.any,
  singleSave: PropTypes.any,
  errorMessage: PropTypes.string,
  errorTooltip: PropTypes.string,
  onSave: PropTypes.func,
  onAbort: PropTypes.func,
  required: PropTypes.bool,
  viewOnly: PropTypes.bool,
  multiline: PropTypes.bool,
  label: PropTypes.any,
  format: PropTypes.string,
  mask: PropTypes.string,
  inputType: PropTypes.string,
  helperLabel: PropTypes.string,
  inputSize: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  classNameForBox: PropTypes.string,
  placeHolder: PropTypes.string,
  spacing: PropTypes.bool,
  decimalScale: PropTypes.number,
  isAllowed: PropTypes.any,
  inputProps: PropTypes.object,
  noneBorder: PropTypes.bool,
  type: PropTypes.string,
  InputProps: PropTypes.object,
  endAdornment: PropTypes.any,
  startAdornment: PropTypes.any,
  hasSearchIcon: PropTypes.bool,
  hasClearIcon: PropTypes.bool,
  onChange: PropTypes.func,
};
TblInputs.defaultProps = {
  singleSave: false,
  multiline: false,
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
  hasSearchIcon: false,
  hasClearIcon: false,
};

const InputField = React.forwardRef((props, ref) => {
  const { inputType, ...rest } = props;
  const [passwordType, setPasswordType] = useState(true);
  switch (inputType) {
    case INPUT_TYPE.TIME:
    case INPUT_TYPE.DATE:
      return <DateTimeInput inputType={inputType} {...rest} />;
    case INPUT_TYPE.PASSWORD:
      return (
        <TblInputs
          ref={ref}
          type={passwordType ? 'password' : 'text'}
          endAdornment={
            <InputAdornment position='end'>
              <TblIconButton
                aria-label='toggle password visibility'
                onClick={() => {
                  setPasswordType(!passwordType);
                }}
              >
                {passwordType ? <VisibilityOff /> : <Visibility />}
              </TblIconButton>
            </InputAdornment>
          }
          {...rest}
        />
      );
    default:
      return <TblInputs ref={ref} inputType={inputType} {...rest} />;
  }
});
InputField.propTypes = {
  inputType: PropTypes.string,
};
export const InputFieldMemo = React.memo(
  (props) => <InputField {...props} />,
  (prev, next) => (
      prev.value === next.value &&
      (isEqual(prev.errorMessage, next.errorMessage) ||
        isEqual(prev.error, next.error))
    )
);
// InputFieldMemo.whyDidYouRender = true;

export default InputField;
