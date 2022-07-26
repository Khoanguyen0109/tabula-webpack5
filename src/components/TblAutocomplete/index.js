import React from 'react';

import get from 'lodash/get';

import CheckIcon from '@mui/icons-material/Check';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';

import TblCheckBox from 'components/TblCheckBox';
import TblTooltipDynamic from 'components/TblTooltipDynamic';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import TblFormHelperText from '../TblFormHelperText';
import TblInputLabel from '../TblInputLabel';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: theme.fontSize.small,
    color: theme.mainColors.primary1[0],

    '& .Mui-required': {
      '& .MuiInputLabel-asterisk': {
        color: theme.palette.error.main,
      },
    },

    '& .MuiFormHelperText-root': {
      fontSize: theme.fontSize.small,
      paddingLeft: theme.spacing(1),
      color: theme.mainColors.primary1[0],
    },
  },
  autocompleteRoot: {},

  field: {
    '& .MuiInputBase-root': {
      width: 'auto',
      // paddingRight: ' !important',
      borderRadius: theme.borderRadius.default,
      fontSize: theme.fontSize.normal,
      minHeight: 44,
      color: '#212529',
      transition: theme.transitionDefault,
      padding: '8px 75px 8px 8px !important ',

      '& input': {
        '&::placeholder': {
          color: theme.newColors.gray[600]
        }
      },

      '& .MuiAutocomplete-input': {
        minWidth: '0 !important',
        padding: '0 !important',
      },
      '& fieldset': {
        border: 'solid 1px #e9ecef',
      },
      '&:hover fieldset': {
        border: theme.borderInput.default,
      },
      '&.Mui-focused fieldset': {
        border: theme.borderInput.focus,
        boxShadow: theme.boxShadowDefault,
        transition: theme.transitionDefault
      },
      '& .MuiAutocomplete-endAdornment': {
        // paddingRight: theme.spacing(1),
        // top: 'calc(50% - 10px)',
        '& .MuiAutocomplete-popupIndicator': {
          fontSize: theme.fontSizeIcon.normal
        },
        '& .MuiIconButton-root:hover, & .MuiIconButton-root:active': {
          background: 'none'
        }
      },
      '& .MuiAutocomplete-popupIndicator': {},
    },
    '& .Mui-disabled': {
      backgroundColor: theme.newColors.gray[100],
      color: theme.newColors.gray[500],
      cursor: 'not-allowed',
      '& .MuiIconButton-root.Mui-disabled': {
        display: 'none',
      },
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderStyle: 'none'
    },
    '& .MuiSvgIcon-root': {
      color: theme.mainColors.primary1[0],
      fontSize: theme.fontSizeIcon.normal
    },
  },

  popper: {},
  paper: {
    margin: '0',
    marginTop: theme.spacing(1),
    // padding: '8px 0',
    boxShadow: '0 8px 32px 0 rgba(33, 37, 41, 0.16)',
    backgroundColor: theme.newColors.gray[50],
    borderRadius: theme.borderRadius.default,

    '& .MuiAutocomplete-listbox': {
      padding: '0',
      overflow: 'overlay',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar *': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#ced4da',
        borderRadius: '8px',
      },
      '& .MuiAutocomplete-option[aria-selected="true"] ': {
        color: theme.customColors.primary1.light[0],
        backgroundColor: theme.customColors.primary1.light[3],
      },
    },
  },

  error: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.palette.error.main} !important`,
    },
    '& .MuiFormHelperText-root': {
      color: `${theme.palette.error.main} !important`,
      fontWeight: theme.fontWeight.normal,
    },
  },
  // '& li': {
  //   paddingBottom: '0',
  //   paddingTop: '0',
  //   '&:hover': {
  //     backgroundColor: theme.newColors.gray[100],
  //   },
  // },
  option: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
    paddingBottom: `${0 }!important`,
    paddingTop: `${0 }!important`,
    paddingLeft: `${8 }px !important` ,
    color: theme.mainColors.primary1[0],
    paddingRight: `${8 }px !important`,
 
    '& p': {
      lineHeight: '24px',
      marginTop: 10,
      marginBottom: 10,
      width: '95%',
      wordBreak: 'break-all',
      whiteSpace: 'normal',
      // marginRight: '16px',
    },
  },
  multiOption: {
    padding: 0,
  },

  noOptions: {
    paddingLeft: theme.spacing(1),
    '& li': {
      paddingBottom: '0',
      paddingTop: '0',
    },
  },

  tag: {
    borderRadius: '4px',
    backgroundColor: theme.newColors.gray[200],
    color: theme.newColors.gray[900]
  },

  chip: {
    borderRadius: 4,
  },
  chipDeleteIconSmall: {
    color: `${theme.newColors.gray[500] }!important`,
    '&:hover': {
      color: `${theme.newColors.gray[700] }!important`,
    },
  },
  textValue: {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  checkIcon: {
    fontSize: theme.fontSizeIcon.small,
    marginRight: 0
  }
}));
function TblAutoCompleteImprove(props) {
  const {
    label,
    multiple,
    error,
    errorMessage,
    onChange,
    keyValue,
    width,
    value,
    limitTags,
    options,
    helperLabel,
    required,
    placeholder,
    chipValue,
    ...rest
  } = props;

  const classes = useStyles();

  const renderHelperLabel = (
    <Tooltip title={helperLabel} placement='top' arrow>
      <HelpOutlineRoundedIcon
        style={{ fontSize: 12, height: 16, verticalAlign: 'bottom' }}
      />
    </Tooltip>
  );

  const renderValue = (value) => (
      <span className={limitTags ? classes.textValue : null}>
        {value
          .map((item) => {
            if (keyValue) {
              const display = get(item, keyValue);
              return display;
            }
            return item;
          })
          .join(', ')}
      </span>
    );
  const renderOptions = (props, option, { selected }) => multiple ? (
     <li {...props}>
      <TblCheckBox
          icon={icon}
          checkedIcon={checkedIcon}
          checked={selected}
        />
        {keyValue ? option[keyValue] : option}
      </li>
    ) : (
      <li {...props}>

        <p> {keyValue ? option[keyValue] : option} </p>
        {selected ? <CheckIcon className={classes.checkIcon} /> : null}
      </li>
    );

  const renderInput = (params) => (
      <TextField
        {...params}
        classes={{
          root: classes.field,
        }}
        placeholder={
          !(multiple && value?.length !== 0) &&
          (placeholder)
        }
        variant='outlined'
      />
    );

  return (
    <div className={`${classes.root} ${error ? classes.error : ''}`}>
      {label && (
        <Box display='flex' alignItems='center'>
          <TblInputLabel required={required} >
            <TblTooltipDynamic placement='top' className='text-ellipsis'>{label}</TblTooltipDynamic>
          </TblInputLabel>
          {helperLabel && <Box pt={0.5} display='flex'>{renderHelperLabel}</Box>}
        </Box>
      )}
      <Autocomplete
        size='small'
        multiple={multiple}
        options={options}
        value={value}
        style={{ width: width || 'auto' }}
        limitTags={limitTags}
        disableCloseOnSelect={multiple}
        // ListboxComponent={ListboxComponent}
        popupIcon={<KeyboardArrowDown />}
        classes={{
          root: classes.autocompleteRoot,
          popper: classes.popper,
          paper: classes.paper,
          option: clsx(classes.option, multiple && classes.multiOption),
          noOptions: classes.noOptions,
          tag: classes.tag,
          focused: classes.focused,
        }}
        getOptionLabel={(option) => (keyValue ? option[keyValue] : option)}
        isOptionEqualToValue={(option, value) => keyValue ? option[keyValue] === value[keyValue] : option === value}
        onChange={onChange}
        renderTags={!chipValue ? renderValue : null}
        renderOption={renderOptions}
        ChipProps={{
          classes: {
            root: classes.chip,
            deleteIconSmall: classes.chipDeleteIconSmall,
          },
        }}
        getLimitTagsText={() => <>...</>}
        renderInput={renderInput}
        {...rest}
      />
      {errorMessage && <TblFormHelperText errorMessage={errorMessage} />}
    </div>
  );
}

TblAutoCompleteImprove.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  options: PropTypes.array,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  helperLabel: PropTypes.string,
  placeholder: PropTypes.string,
  limitTags: PropTypes.number,
  onChange: PropTypes.func,
  keyValue: PropTypes.string,
  value: PropTypes.any,
  width: PropTypes.any,
  chipValue: PropTypes.bool,
};

TblAutoCompleteImprove.defaultProps = {
  chipValue: true,
  placeholder: 'Select'
};

export default TblAutoCompleteImprove;
