import React, { useEffect, useState } from 'react';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';

import PropTypes from 'prop-types';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
function StudentNameCell(params) {
  const theme = useTheme();
  const field = params.field;
  const width = params.colDef.width;
  const apiRef = params.api;
  const [maxWidth, setMaxWidth] = useState(width);
  useEffect(() => apiRef.subscribeEvent('columnResize', (params) => {
      if (field === params.colDef.field) {
        setMaxWidth(params.width);
      }
    }), [apiRef, field]);
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: theme.spacing(2),
      }}
    >
      <Typography
        sx={{
          width: `${maxWidth - 30}px`,
          marginRight: theme.spacing(2),
        }}
        className='text-ellipsis'
      >
        {`${params.row.firstName || ''} ${params.row.lastName || ''}`}
      </Typography>
    </Box>
  );
}

StudentNameCell.propTypes = {
  value: PropTypes.string,
};

export default StudentNameCell;
