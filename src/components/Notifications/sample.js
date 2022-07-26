import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { VARIANT_ICON } from 'modules/Notifications/constants';

import Notification from './Notification';

function NotificationSample() {
  const message =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'";

  function handelSubmit() {
    return;
  }
  function handleCancel() {
    return;
  }
  return (
    <Grid container spacing={3}>
      <Grid item sm={6}>
        <Box mb={2}>
          <Notification title={VARIANT_ICON.INFO} message={message} />
        </Box>

        <Box mb={2}>
          <Notification
            variant={VARIANT_ICON.WARNING}
            title={VARIANT_ICON.WARNING}
            message={message}
          />
        </Box>
        <Box mb={2}>
          <Notification
            variant={VARIANT_ICON.SUCCESS}
            title={VARIANT_ICON.SUCCESS}
            message={message}
          />
        </Box>

        <Box mb={2}>
          <Notification
            variant={VARIANT_ICON.ERROR}
            title={VARIANT_ICON.ERROR}
            message={message}
          />
        </Box>
      </Grid>
      <Grid item sm={6}>
        <Box mb={2}>
          <Notification
            title={VARIANT_ICON.INFO}
            message={message}
            actionPrimary={handelSubmit}
            actionPrimaryLabel='Schedule Now'
            actionSecondary={handleCancel}
            actionSecondaryLabel='Remind me later'
          />
        </Box>

        <Box mb={2}>
          <Notification
            title={VARIANT_ICON.INFO}
            message={message}
            actionPrimary={handelSubmit}
            actionPrimaryLabel='Take the survey'
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default NotificationSample;
