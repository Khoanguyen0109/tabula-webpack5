import { isGuardian, isStudent } from '../../../../utils/roles';
import {
  DESKTOP_ACTIONS,
  NOTIFICATION_STEPS,
  VARIANT_ICON,
} from '../../constants';

export function handleSeries25(props) {
  const {
    t,
    currentUser,
    payload,
    showNotification,
    startScheduleTask,
    viewTaskDetail,
    action,
  } = props;

  const { data } = payload;
  const { step } = data;

  switch (step) {
    case NOTIFICATION_STEPS.STEP_1:
    case NOTIFICATION_STEPS.STEP_2:
      if (isStudent(currentUser)) {
        switch (action) {
          case DESKTOP_ACTIONS.start_urgent_task:
            return startScheduleTask(payload);
          default:
            return showNotification({
              variant: VARIANT_ICON.WARNING,
              payload,
              actionPrimary: {
                label: t('notification:start_urgent_task'),
                action: startScheduleTask,
              },
            });
        }
      }
      return;
    case NOTIFICATION_STEPS.STEP_3:
      if (isGuardian(currentUser)) {
        switch (action) {
          case DESKTOP_ACTIONS.view_task_details:
            return viewTaskDetail(payload);
          default:
            return showNotification({
              variant: VARIANT_ICON.WARNING,
              payload,
              actionPrimary: {
                label: t('myCourses:view_task_details'),
                action: viewTaskDetail,
              },
            });
        }
      }
      return;
    default:
      return;
  }
}
