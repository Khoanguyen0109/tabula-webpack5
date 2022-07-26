import React from 'react';

import { Box, Fade } from '@mui/material';

import TblCustomRef from 'components/TblCustomRef';
import TblFormHelperText from 'components/TblFormHelperText';
import TblInputLabel from 'components/TblInputLabel';
import TblTooltipDynamic from 'components/TblTooltipDynamic';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import HelperLabel from './HelperLabel';
import useStyles from './styled';

const InputWrapper = React.forwardRef((props, ref) => {
  const {
    classNameForBox,
    label,
    helperLabel,
    required,
    multiline,
    inputSize,
    noneBorder,
    spacing,
    errorMessage,
    openActions,
    handleCancel,
    handleSubmit,
    setBlurred,
    children,
  } = props;
  const classes = useStyles();

  return (
    <Box className={`${classNameForBox}`}>
      <Box
        className={clsx(`TblInputs ${classes.root} ${classes[inputSize]}`, {
          multiline: multiline,
          [classes.noneBorder]: noneBorder,
        })}
        mb={spacing}
        ref={ref}

      >
        {label && (
          <Box display='flex' alignItems='center'>
            <TblInputLabel required={required}>
              <TblTooltipDynamic placement='top' className='text-ellipsis'>
                {label}
              </TblTooltipDynamic>
            </TblInputLabel>
            {helperLabel && (
              <Box pt={0.5} display='flex'>
                <HelperLabel helperLabel={helperLabel} />
              </Box>
            )}
          </Box>
        )}
        {children}
        {(!!errorMessage || openActions) && !props.disabled && (
          <Fade in={!!errorMessage || openActions}>
            <TblCustomRef>
              <TblFormHelperText
                errorMessage={errorMessage}
                showActions={openActions}
                setBlurred={setBlurred}
                onAbort={handleCancel}
                onSave={handleSubmit}
              />
            </TblCustomRef>
          </Fade>
        )}
      </Box>
    </Box>
  );
});

InputWrapper.propTypes = {
  children: PropTypes.node,
  classNameForBox: PropTypes.string,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  handleCancel: PropTypes.func,
  handleSubmit: PropTypes.func,
  helperLabel: PropTypes.string,
  inputSize: PropTypes.string,
  label: PropTypes.string,
  multiline: PropTypes.bool,
  noneBorder: PropTypes.bool,
  openActions: PropTypes.bool,
  required: PropTypes.bool,
  setBlurred: PropTypes.func,
  spacing: PropTypes.number
};

export default InputWrapper;
