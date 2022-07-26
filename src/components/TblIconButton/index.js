import React from 'react';

import IconButton from '@mui/material/IconButton';
import withStyles from '@mui/styles/withStyles';

import PropTypes from 'prop-types';

import styles from './styled';

class TblIconButton extends React.PureComponent {
  render() {
    const { children, color, size, onClick, ...rest } = this.props;
    return (
      <IconButton
        color={color}
        size={size}
        disableRipple={true}
        disableFocusRipple={true}
        onClick={onClick}
        {...rest}
      >
        {children}
      </IconButton>
    );
  }
}

TblIconButton.propTypes = {
  children: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.string,
};

TblIconButton.defaultProps = {
  children: 'Button',
  size: 'small',
};

export default withStyles(styles)(TblIconButton);
