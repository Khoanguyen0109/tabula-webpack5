import { TEACHER } from 'utils/roles';

import { checkPermission } from 'utils';
export const checkPermissionCreateAndPublish = (permission) => {
  const ROLES_UPDATE = [TEACHER];
  return checkPermission(
    permission,
    ROLES_UPDATE
  );
};

export const getQueueUpdate = (courseDayIds) => {
  const queueUpdate = {};
  if (courseDayIds) {
    courseDayIds.forEach((id) => queueUpdate[id] = true);
  }
  return queueUpdate;
};