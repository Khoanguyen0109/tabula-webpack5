import React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
    <Box display='flex' width='100%' height='100%' alignContent='center' justifyContent='center' justifyItems='center' alignItems='center'>
      <CircularProgress />
    </Box>
  );
}