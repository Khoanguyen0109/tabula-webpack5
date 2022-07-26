import React from 'react';
import { useTranslation } from 'react-i18next';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';

import TblFormHelperText from 'components/TblFormHelperText';
import TblInputLabel from 'components/TblInputLabel';
import TblTooltipDynamic from 'components/TblTooltipDynamic';

import clsx from 'clsx';
import { isEqual, isNil } from 'lodash';
import PropTypes from 'prop-types';

import MultiOption from './MultiOption';
import useStyles from './styled';

function TblSelect(props) {
  const classes = useStyles();
  const {
    small,
    error,
    errorMessage,
    required,
    label,
    children,
    multiple,
    placeholder,
    helperLabel,
    keyValue,
    keyDisplay,
    value,
    options,
    chipValue,
    checkboxOption,
    hasBoxShadow,
    spacing,
    initialScrollOffset,
    addFunc,
    className,
    ...rest
  } = props;

  const { t } = useTranslation('common');
  const renderHelperLabel = (
    <Tooltip title={helperLabel} placement='top' arrow>
      <HelpOutlineRoundedIcon
        style={{ fontSize: 12, height: 16, verticalAlign: 'bottom' }}
      />
    </Tooltip>
  );

  const renderValue = (selected) => {
    if (!selected || selected.length === 0) {
      return <span className={classes.placeholder}> {placeholder} </span>;
    }

    if (multiple) {
      const { keyDisplay, keyValue } = props;
      if (chipValue) {
        return selected.map((item, index) => {
          if (keyDisplay && keyValue) {
            const display = get(item, keyDisplay);
            const key = get(item, keyValue);
            return <Chip clickable key={key} label={display} />;
          }
          return <Chip key={index} label={item} />;
        });
      }
      const list = selected.map((item) => {
        if (keyDisplay && keyValue) {
          if (typeof item !== 'object') {
            const index = options.find((option) => option[keyValue] === item);
            if (index) {
              return index[keyDisplay];
            }
          }
          const display = get(item, keyDisplay);
          return display;
        }
        return item;
      });
      if (list.length !== 0 && !!list[0]) {
        return list.join(', ');
      }
      return [''];
    }
    return selected;
  };

  const setScroll = React.useCallback(() => {
    const el = document.querySelector('.scroll-list');
    if (el && initialScrollOffset) {
      el.scrollTop = initialScrollOffset;
    }
  }, [initialScrollOffset]);
  return (
    <div
      className={clsx(
        'TblSelect-root',
        classes.root,
        {
          [classes.error]: error,
          [classes.small]: small,
          [classes.hasBoxShadow]: hasBoxShadow,
          [classes.placeholder]: multiple
            ? isEmpty(value)
            : isEmpty(toString(value)),
          [classes.space]: spacing,
        },
        className
      )}
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
              {renderHelperLabel}
            </Box>
          )}
        </Box>
      )}
      <Select
        displayEmpty={!!placeholder}
        IconComponent={ExpandMoreIcon}
        inputProps={{ 'aria-label': 'Without label' }}
        variant={small ? 'standard' : 'outlined'}
        // value={value}
        value={
          isNil(value) ? (multiple ? [''] : '') : value
        } // to display placeholder
        multiple={multiple}
        renderValue={multiple && !!placeholder ? renderValue : null}
        classes={{
          select: clsx(classes.select, classes.selectRoot),
          outlined: classes.outlined,
          icon: classes.icon,
          disabled: classes.disabled,
        }}
        MenuProps={{
          classes: {
            list: multiple && checkboxOption ? classes.multiMenu : classes.menu,
            paper: clsx(classes.menuPaper, 'scroll-list'),
          },
          getcontentanchorel: null,
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          TransitionProps: {
            onEntered: setScroll,
          },
          // onEntered: setScroll,
          transitionDuration: 300,
        }}
        {...rest}
      >
        {!children &&
          options &&
          multiple &&
          checkboxOption &&
          options.map((option) => (
              <MenuItem
                key={keyValue ? option[keyValue] : option}
                value={keyValue ? option[keyValue] : option}
              >
                <MultiOption
                  label={keyDisplay ? option[keyDisplay] : option}
                  data={keyValue ? option[keyValue] : option}
                  selectedList={value}
                />
              </MenuItem>
            ))}
        {!!placeholder && (isNil(value)) && (
          <MenuItem
            className={classes.emptyItem}
            disabled
            value={multiple ? [''] : ''}
          >
            <span className={clsx(classes.placeholder, 'placeholder')}>
              {' '}
              {placeholder}{' '}
            </span>
          </MenuItem>
        )}
        {checkboxOption
          ? !options
          : (!children || children.length === 0) && (
              <MenuItem disabled value={null}>
                No options
              </MenuItem>
            )}

        {children}
        {addFunc && (
          <Box
            component={Button}
            className={classes.add}
            onClick={() => addFunc()}
          >
            <AddIcon />
            <div className={classes.addTitle}>{t('add')}</div>
          </Box>
        )}
      </Select>
      {errorMessage && (
        <TblFormHelperText errorMessage={errorMessage} />
      )}
    </div>
  );
}

TblSelect.propTypes = {
  addFunc: PropTypes.func,
  checkboxOption: PropTypes.bool,
  children: PropTypes.node,
  chipValue: PropTypes.bool,
  className: PropTypes.any,
  error: PropTypes.bool,
  errorMessage: PropTypes.any,
  hasBoxShadow: PropTypes.bool,
  helperLabel: PropTypes.string,
  initialScrollOffset: PropTypes.number,
  keyDisplay: PropTypes.string,
  keyValue: PropTypes.string,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  small: PropTypes.bool,
  spacing: PropTypes.bool,
  value: PropTypes.any,
};

TblSelect.defaultProps = {
  small: false,
  required: false,
  error: false,
  label: '',
  helperLabel: '',
  spacing: false,
  initialScrollOffset: 0,
  hasBoxShadow: true,
  chipValue: false,
  checkboxOption: false,
  placeholder: 'Select',
};

// TblSelect.whyDidYouRender = true;
export const TblSelectMemo = React.memo(
  (props) => <TblSelect {...props} />,
  (prev, next) => (
      prev.value === next.value &&
      (isEqual(prev.errorMessage, next.errorMessage) ||
        isEqual(prev.error, next.error)) &&
      prev.children?.length === next.children?.length
    )
);
export default TblSelect;
