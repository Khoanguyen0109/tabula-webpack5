import React from 'react';

import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import withStyles from '@mui/styles/withStyles';

import PropTypes from 'prop-types';

import Checkbox from './';

const styles = (theme) => ({
  root: {
    marginLeft: theme.spacing(-0.5)
  }
});

const TabulaCheckbox = ({ label, classes, containerClass, spacing, ...props }) => (
    <Box mb={spacing ? 1 : 0}>
      <FormControlLabel
        className={containerClass}
        classes={classes}
        control={<Checkbox {...props} />}
        label={label}
      />
    </Box>
  );

TabulaCheckbox.propTypes = {
  label: PropTypes.string,
  classes: PropTypes.object,
  containerClass: PropTypes.object,
  spacing: PropTypes.bool
};

TabulaCheckbox.defaultProps = {
  spacing: true
};

export default withStyles(styles)(TabulaCheckbox);