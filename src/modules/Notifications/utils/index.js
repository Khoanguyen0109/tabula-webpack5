import { convertTimezone } from 'utils/time';

import differenceInMinutes from 'date-fns/differenceInMinutes';

export const isSupportedPushNoti = () =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window;

export function isInvalidNotification(notificationTime) {
  return (
    notificationTime &&
    differenceInMinutes(
      new Date(convertTimezone(new Date())),
      new Date(convertTimezone(new Date(notificationTime)))
    ) > 10
  );
}
