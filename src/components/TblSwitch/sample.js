import React from 'react';

import Grid from '@mui/material/Grid';

import TblSwitch from '.';
function SampleSwitch() {
  return (
    <>
      <Grid item>
        <b>Switch</b>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <TblSwitch />
        </Grid>
      </Grid>

      <Grid item>
        <b>Disabled Switch without checked</b>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <TblSwitch disabled />
        </Grid>
      </Grid>

      <Grid item>
        <b>Disabled Switch with checked</b>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <TblSwitch checked disabled />
        </Grid>
      </Grid>
    </>
  );
}
export default SampleSwitch;
