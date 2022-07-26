import { isGuardian, isStudent } from 'utils/roles';

import {
  DESKTOP_ACTIONS,
  NOTIFICATION_STEPS,
  VARIANT_ICON,
} from '../../constants';
export function handleSeries2(props) {
  const {
    t,
    currentUser,
    payload,
    showNotification,
    startScheduleTask,
    viewTaskDetail,
    handelOpenNudgeMessage,
    viewTaskAndTimeBlock,
    action,
  } = props;

  const {
    data,
    notification: { actions },
  } = payload;
  const { step } = data;

  switch (step) {
    case NOTIFICATION_STEPS.STEP_PRE: {
      switch (action) {
        case DESKTOP_ACTIONS.notification_click:
          viewTaskAndTimeBlock(payload);
          return showNotification({
            variant: VARIANT_ICON.WARNING,
            payload,
          });
        default:
          return showNotification({
            variant: VARIANT_ICON.WARNING,
            payload,
          });
      }
    }
    case NOTIFICATION_STEPS.STEP_1:
    case NOTIFICATION_STEPS.STEP_2: {
      if (isStudent(currentUser)) {
        switch (action) {
          case DESKTOP_ACTIONS.start_urgent_task:
            return startScheduleTask(payload);
          case DESKTOP_ACTIONS.notification_click:
            viewTaskAndTimeBlock(payload);
            return showNotification({
              variant: VARIANT_ICON.WARNING,
              payload,
              actionPrimary: {
                label: t('notification:start_now'),
                action: startScheduleTask,
              },
            });
          default:
            return showNotification({
              variant: VARIANT_ICON.WARNING,
              payload,
              actionPrimary: {
                label: t('notification:start_now'),
                action: startScheduleTask,
              },
            });
        }
      }
      return;
    }
    case NOTIFICATION_STEPS.STEP_3: {
      if (isGuardian(currentUser)) {
        switch (action) {
          case DESKTOP_ACTIONS.send_nudge:
            return handelOpenNudgeMessage(payload);
          case DESKTOP_ACTIONS.notification_click:
            viewTaskAndTimeBlock(payload);
            return showNotification({
              variant: VARIANT_ICON.WARNING,
              payload,
              actionPrimary: {
                label: t('notification:nudge_text'),
                action: handelOpenNudgeMessage,
              },
            });
          default:
            return showNotification({
              variant: VARIANT_ICON.WARNING,
              payload,
              actionPrimary: {
                label: t('notification:nudge_text'),
                action: handelOpenNudgeMessage,
              },
            });
        }
      }
      return;
    }
    case NOTIFICATION_STEPS.STEP_4: {
      if (isStudent(currentUser)) {
        switch (action) {
          case DESKTOP_ACTIONS.start_urgent_task:
            return startScheduleTask(payload);
          case DESKTOP_ACTIONS.notification_click:
            viewTaskAndTimeBlock(payload);
            return showNotification({
              variant: VARIANT_ICON.WARNING,
              payload,
              actionPrimary: actions && actions[0]
                ? {
                    label: t('notification:start_now'),
                    action: startScheduleTask,
                  }
                : null,
            });
          default:
            return showNotification({
              variant: VARIANT_ICON.WARNING,
              payload,
              actionPrimary: actions && actions[0]
                ? {
                    label: t('notification:start_now'),
                    action: startScheduleTask,
                  }
                : null,
            });
        }
      }
      return;
    }
    case NOTIFICATION_STEPS.STEP_5: {
      if (isGuardian(currentUser)) {
        switch (action) {
          case DESKTOP_ACTIONS.view_task_details:
            return viewTaskDetail(payload);
          case DESKTOP_ACTIONS.notification_click:
            viewTaskDetail(payload ,false);
            return showNotification({
              variant: VARIANT_ICON.WARNING,
              payload,
              actionPrimary: {
                label: t('myCourses:view_task_details'),
                action: viewTaskDetail,
              },
            });
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
    }
    case NOTIFICATION_STEPS.STEP_6: {
      if (isGuardian(currentUser)) {
        switch (action) {
          case DESKTOP_ACTIONS.view_task_details:
            return viewTaskDetail(payload);
          case DESKTOP_ACTIONS.notification_click:
            viewTaskDetail(payload, false);
            return showNotification({ variant: VARIANT_ICON.WARNING, payload });

          default:
            return showNotification({ variant: VARIANT_ICON.WARNING, payload });
        }
      }
      return;
    }
    default:
      showNotification({ variant: VARIANT_ICON.WARNING, payload });
  }
}
