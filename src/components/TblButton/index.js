import React from 'react';

import debounce from 'lodash/debounce';
import isFunction from 'lodash/isFunction';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import withStyles from '@mui/styles/withStyles';

import PropTypes from 'prop-types';

import styles from './styled';

class TblButton extends React.PureComponent {

  onClick = debounce((e) => {
    const { onClick } = this.props;
    if (isFunction(onClick)) {
      onClick(e);
    }
  }, 100);

  render() {
    const {isShowCircularProgress, disabled, ...rest } = this.props;
    return(
      <Button
        onClick={(e) => { e.persist(); this.onClick(e); }}
        disabled={disabled || !!isShowCircularProgress}
        disableRipple
        {...rest}
      >
        {this.props.children}
        {!!isShowCircularProgress && <CircularProgress size={24}/>}
      </Button>
    );
  }
}

TblButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  isShowCircularProgress: PropTypes.bool,
  disabled: PropTypes.bool
};

TblButton.defaultProps = {
  children: 'Button',
  onClick: null,
  isShowCircularProgress: false,
  disabled: false
};

export default withStyles(styles)(TblButton);