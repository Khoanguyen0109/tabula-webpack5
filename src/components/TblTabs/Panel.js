import React from 'react';

import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

const useStyles = makeStyles( (theme) => ({
  panel: {
    marginTop: theme.spacing(2.4)
  },
}), { name: 'tbl-tab' });

function TabPanel(props) {
  const classes = useStyles();
  const { children, value, index, ...other } = props;

  return (
    <Box
      width='100%'
      className={classes.panel}
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
          <Box>{children}</Box>
      )}
    </Box>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default TabPanel;