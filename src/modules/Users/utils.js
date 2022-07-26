import React from 'react';

import get from 'lodash/get';

import Status from 'components/TblStatus';
// import Tooltip from '@mui/material/Tooltip';

export const renderUserStatus = (record) => {
  let status;
  let showTooltip = false;

  switch (get(record, 'status[0]')) {
    case 1:
      status = 'active';
      break;
    case 0:
      status = 'pending';
      break;
    case -2:
      status = 'suspended';
      break;
    case -1:
    case -3:
      status = 'locked';
      showTooltip = true;
      break;
    case -4:
      status = 'expired';
      break;
    default:
      break;
  }
  return (
    <Status
      label={status}
      color={status}
      title={
        showTooltip
          ? record.pendingEmail
            ? `User has not confirmed new email address ${record.pendingEmail}`
            : 'User is requested to reset password.'
          : null
      }
    />
  );
};
