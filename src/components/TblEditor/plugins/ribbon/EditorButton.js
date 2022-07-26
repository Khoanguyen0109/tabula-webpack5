import React from 'react';

import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import { ReactComponent as IcnMore } from './images/icn_more.svg';

const styles = (theme) => ({
  root: {
    position: 'relative',
    overflow: 'visible',
    display: 'inline-block',
  },
  rootDisabled: {
    opacity: '0.4',
  },
  button: {
    borderWidth: 0,
    borderRadius: 8,
    margin: theme.spacing(0.25, 0.5),
    padding: 4,
    backgroundColor: theme.newColors.gray[50],
    cursor: 'pointer',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:focus': {
      outline: 'none',
    },
  },
  btnNormal: {
    '&:hover': {
      backgroundColor: theme.newColors.gray[300],
      '& path': {
        fill: theme.newColors.gray[800],
      },
    },
  },
  btnDisabled: {
    cursor: 'default',
  },

  btnChecked: {
    backgroundColor: theme.customColors.primary1.light[3],
    '& < svg < path': {
      fill: theme.customColors.primary1.main,
    },
    '&:hover': {
      backgroundColor: theme.customColors.primary1.light[3],
      '& path': {
        fill: theme.customColors.primary1.main,
      },
    },
  },
  svgIcon: (props) => ({
    fontSize: 20,
    height: 20,
    width: 20,
    '& path': {
      fill: theme.newColors.gray[800],
      '&.svg-line-color': {
        fill: props.style?.color,
      },
    },
  }),
  iconChecked: {
    '& path': {
      fill: theme.customColors.primary1.main,
    },
  },
});

const useStylesTooltip = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontSize: '12px',
  },
}));

function CustomTooltip(props) {
  const classes = useStylesTooltip();

  return <Tooltip arrow classes={classes} {...props} />;
}
const EditorButton = ({
  classes,
  className,
  handleClick,
  checked,
  disabled,
  svgIconComponent,
  title,
}) => (
  <span
    className={clsx(classes.root, className, {
      [classes.rootDisabled]: disabled,
    })}
  >
    <CustomTooltip title={title || ''}>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleClick(e);
        }}
        className={clsx(classes.button, {
          [classes.btnChecked]: checked,
          [classes.btnNormal]: !disabled && !checked,
          [classes.btnDisabled]: disabled,
        })}
      >
        <SvgIcon
          component={svgIconComponent}
          className={clsx(classes.svgIcon, { [classes.iconChecked]: checked })}
        />
      </button>
    </CustomTooltip>
  </span>
);
EditorButton.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.any,
  handleClick: PropTypes.func,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  svgIconComponent: PropTypes.any,
  title: PropTypes.string,
};
EditorButton.defaultProps = {
  classes: {},
  className: '',
  handleClick: () => {},
  checked: false,
  disabled: false,
  svgIconComponent: IcnMore,
  title: '',
};
export default withStyles(styles)(
  React.forwardRef((props, ref) => <EditorButton innerRef={ref} {...props} />)
);
