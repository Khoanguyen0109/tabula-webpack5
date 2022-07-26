import * as React from 'react';

import LinearProgress from '@mui/material/LinearProgress';
import { GridOverlay } from '@mui/x-data-grid-pro';

function LoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default LoadingOverlay;
