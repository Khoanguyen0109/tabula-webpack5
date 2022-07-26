import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  skeltonWrapper: {
    maxWidth: '100%',
    overflow: 'hidden'
  },
  skeletonGradingPeriod: {
    margin: theme.spacing(2, 0, 2, 9)
  },
}));

export default function YearlyScheduleSkeleton() {
  const classes = useStyles();
  return (
    <Box className={classes.skeltonWrapper}>
      <Box width='100%'>
        <Skeleton variant='rectangular' height={41} />
        <Skeleton classes={{ root: classes.skeletonGradingPeriod }} variant='rectangular' height={19} />
      </Box>
      {
        [1,2,3,4,5].map((item, index) => (
            <Grid container wrap='nowrap' key={`wrapper-skeleton-${index}`}>
              {
                [1,2,3,4,5,6,7].map((value, i) => (
                  <Box marginRight={0.5} key={`skeleton-${i}`}>
                    <Skeleton classes={{ root: classes.skeletonGradingPeriod }} variant='rectangular' height={64} width={160} />
                  </Box>
                ))
              }
            </Grid>
          ))
      }
    </Box>
  );
}