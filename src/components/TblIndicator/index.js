import React from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  indicator: {
    fontSize: theme.fontSize.medium,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#F3F4F6',
    width: 'fit-content',
    padding: '8px 12px',
    borderRadius: theme.borderRadius.default,
  },
}));
function TblIndicator(props) {
  const { content, style } = props;
  const classes = useStyles();

  return (
    <Box className={classes.indicator} style={style}>
      <InfoOutlinedIcon
        sx={{
          marginRight: 1.25,
        }}
      />
      <Typography component='div' variant='bodyMedium'> {content} </Typography>
    </Box>
  );
}
TblIndicator.propTypes = {
  content: PropTypes.string,
  style: PropTypes.object,
};

TblIndicator.defaultProps = {};
export default TblIndicator;
