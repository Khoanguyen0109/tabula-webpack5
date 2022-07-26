import React from 'react';

import { Box, Divider } from '@mui/material';

import PropTypes from 'prop-types';

function OverallCell(props) {
  const { value } = props;
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Box width={60} textAlign='center'>
        {value?.calculateOverallGrade || value?.calculateOverallGrade === 0
          ? `${value.calculateOverallGrade}%`
          : '--'}
      </Box>
      <Divider orientation='vertical' sx={{ height: '50px' }} />
      <Box width={60} textAlign='center'>
        {value?.letterValue || '--'}
      </Box>
    </Box>
  );
}

OverallCell.propTypes = {
  value: PropTypes.shape({
    calculateOverallGrade: PropTypes.number,
    letterValue: PropTypes.string,
  }),
};

export default OverallCell;
