import React from 'react';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

function FormSkeleton() {
  return (
    <Grid container spacing={3}>
    <Grid item xs={8}>
      <Skeleton variant='rectangular' animation='wave' width={'100%'} />
    </Grid>
    <Grid item xs={4}>
      <Skeleton variant='rectangular' animation='wave' width={'100%'} />
    </Grid>
  </Grid>
  );
}

export default FormSkeleton;
