import React from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function ViewDetailSkeleton() {
  return (
    <Box ml={5} mr={5} mt={2}>
      <Box mb={0.5}>
        <Skeleton width={100} height={20} />
      </Box>
      <Box>
        <Skeleton width={300} height={30} />
      </Box>
      <Box display='flex'>
        <Box mr={3}>
          <Skeleton width={500} height={500} />
        </Box>
        <Box>
          <Skeleton width={500} height={500} />
        </Box>
      </Box>
    </Box>
  );
}