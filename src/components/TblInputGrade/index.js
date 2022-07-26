import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblInputs from 'components/TblInputs';

import useEventListener from 'utils/customHook/useEventListener';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  grading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    '& .MuiFormControl-root': {
      width: theme.spacing(13),
      height: theme.spacing(5),
      marginRight: theme.spacing(1),
      '& .MuiInputBase-root': {
        paddingRight: 0,
      },
    },
    '& input': {
      padding: `${theme.spacing(1) } !important`,
      fontSize: `${theme.fontSize.small } !important`,
    },
  },
}));
const InputGrade = (props) => {
  const classes = useStyles();
  const {
    value,
    onChange,
    onBlur,
    disabled,
    totalPossiblePoints,
    placeholder,
    suffix,
  } = props;
  const { t } = useTranslation('grader');
  const inputRef = useRef();
  const handleKeyDown = (e) => {
    const { key } = e;
    if (key === 'Enter') {
      inputRef.current.blur();
      onBlur();
    }
  };
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  useEventListener('keydown', handleKeyDown);
  return (
    <Box className={classes.grading}>
      <TblInputs
        ref={inputRef}
        value={value}
        inputType='number'
        placeholder={placeholder}
        isAllowed={(values) => {
          const { floatValue, formattedValue } = values;
          return (
            formattedValue === '' ||
            (floatValue <= totalPossiblePoints && floatValue >= 0)
          );
        }}
        decimalScale={2}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeHolder={t('input_grade')}
        onBlur={onBlur}
        disabled={disabled}
        suffix={suffix}
      />{' '}
    </Box>
  );
};

InputGrade.propTypes = {
  disabled: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  suffix: PropTypes.string,
  totalPossiblePoints: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
};
export default InputGrade;
