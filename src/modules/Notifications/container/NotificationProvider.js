/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import delay from 'lodash/delay';

import Notifications from 'components/Notifications/Notification';

import { isSafari } from 'utils/checkBrowser';
import { LOCAL_STORAGE } from 'utils/constants';
import firebase from 'utils/firebase';
import { isGuardian, isStudent } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { isEqual, startOfToday } from 'date-fns/esm';
import myTasksActions from 'modules/MyTasks/actions';
import { ROUTE_TASKS } from 'modules/MyTasks/constantsRoute';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { setUrlParam } from 'utils';

import { isTeacher } from '../../../utils/roles';
import { TASK_STATUS, TabInViewMyTasks } from '../../MyTasks/utils';
import notificationAction from '../actions';
import NudgeTextDialog from '../components/NudgeTextDialog';
import RequestNotificationDialog from '../components/RequestNotificationDialog';
import {
  END_POINT,
  NOTIFICATION_SERIES,
  VARIANT_ICON,
  // testData,
} from '../constants';
import { isInvalidNotification, isSupportedPushNoti } from '../utils';

import { handleSeries1 } from './series/series1';
import { handleSeries2 } from './series/series2';
import { handleSeries25 } from './series/series25';
import { handleSeries9A } from './series/series9a';

const snackbarConfig = {
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'right',
  },
  autoHideDuration: 10 * 60 * 1000, //NOTE: Revert from 2 to 10 minutes to hidden notification
};

function NotificationProvider(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const authContext = useContext(AuthDataContext);
  const { currentUser } = authContext;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [nudgeInfo, setNudgeInfo] = useState({});
  const urlSearchParams = new URLSearchParams(location.search);
  const notificationId = urlSearchParams?.get('notificationId');
  const [isVisible, setIsVisible] = React.useState(false);

  const notificationData = useSelector(
    (state) => state.Notification.notificationData
  );
  const startUrgentTaskSuccess = useSelector(
    (state) => state.Notification.startUrgentTaskSuccess
  );
  const startUrgentTaskFailed = useSelector(
    (state) => state.Notification.startUrgentTaskFailed
  );
  const error = useSelector((state) => state.Notification.error);
  const isBusy = useSelector((state) => state.Notification.isBusy);

  const onShowOrHideDialog = () => {
    setIsVisible(!isVisible);
  };
  const handleRequestNotificationPermission = () => {
    setIsVisible(false);
    handleGetFbToken();
  };

  async function handelOpenNudgeMessage(notificationProps) {
    const {
      id,
      data: { notificationId, notificationTime },
    } = notificationProps;
    closeSnackbar(id);
    if (isInvalidNotification(notificationTime)) {
      return;
    }
    closeSnackbar(id);
    await setNudgeInfo({
      notificationId: notificationId,
    });
    return setOpen(true);
  }

  function handleCloseNudgeMessage() {
    setOpen(false);
  }

  async function startScheduleTask(notificationProps) {
    const {
      data: { notificationId },
    } = notificationProps;
    dispatch(
      notificationAction.startUrgentTask({
        notificationId: notificationId,
        notificationData: notificationProps,
        action: 'start',
        isBusy: true,
      })
    );
    return closeSnackbar(notificationProps.id);
  }

  async function viewTaskDetail(notificationProps, close = true) {
    const {
      id,
      data: { taskStatus, taskId, studentId },
    } = notificationProps;
    // Change context for routing
    if (authContext?.currentStudentId !== parseInt(studentId)) {
      await authContext.setData(
        {
          ...authContext,
          currentStudentId: parseInt(studentId),
        },
        'user'
      );
    }
    switch (parseInt(taskStatus)) {
      case TASK_STATUS.UNSCHEDULED:
        history.push(
          ROUTE_TASKS.GUARDIAN_VIEW_UNSCHEDULE_TASK_DETAILS(taskId, studentId)
        );
        break;
      case TASK_STATUS.SCHEDULED:
        history.push(
          ROUTE_TASKS.GUARDIAN_VIEW_SCHEDULE_TASK_DETAILS(taskId, studentId)
        );
        break;
      case TASK_STATUS.COMPLETED:
        history.push(
          ROUTE_TASKS.GUARDIAN_VIEW_COMPLETED_TASK_DETAILS(taskId, studentId)
        );
        break;

      default:
        history.push(ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(studentId));
        break;
    }
    if (close === true) {
      return closeSnackbar(id);
    }
    return;
  }

  async function viewTaskAndTimeBlock(notificationProps, close = false) {
    // NOTE: if from desktop, history replace
    const type = !!close ? 'push' : 'replace';
    const {
      id,
      data: { taskStatus, taskId, studentId },
    } = notificationProps;
    const pathname = isGuardian(currentUser)
      ? ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(studentId)
      : ROUTE_TASKS.DEFAULT;

    if (authContext?.currentStudentId !== parseInt(studentId)) {
      await authContext.setData(
        {
          ...authContext,
          currentStudentId: parseInt(studentId),
        },
        'user'
      );
    }
    switch (parseInt(taskStatus)) {
      case TASK_STATUS.UNSCHEDULED:
        setUrlParam(
          location,
          history,
          {
            active: TabInViewMyTasks[0],
            taskJustScheduledId: taskId,
          },
          type,
          null,
          pathname
        );
        break;
      case TASK_STATUS.SCHEDULED:
        setUrlParam(
          location,
          history,
          {
            active: TabInViewMyTasks[1],
            taskJustScheduledId: taskId,
          },
          type,
          null,
          pathname
        );
        break;
      case TASK_STATUS.COMPLETED:
        setUrlParam(
          location,
          history,
          {
            active: TabInViewMyTasks[2],
            taskJustScheduledId: taskId,
          },
          type,
          null,
          pathname
        );
        break;

      default:
        setUrlParam(
          location,
          history,
          {
            active: TabInViewMyTasks[1],
            taskJustScheduledId: taskId,
          },
          type,
          null,
          pathname
        );
        break;
    }
    if (close === true) {
      return closeSnackbar(id);
    }
    return;
  }

  function handleGetFbToken() {
    if (messaging) {
      messaging
        .requestPermission()
        .then(() => messaging.getToken())
        .then((token) => {
          if (currentUser) {
            dispatch(notificationAction.setupDeviceToken({ token }));
          }
          localStorage.setItem(LOCAL_STORAGE.DEVICE_TOKEN, token);
        })
        .catch(() => {
          if (!isTeacher(currentUser)) {
            handleBlockedNotification();
          }
        });
    } else {
      console.log('Firebase not support for this browser :>> ');
    }
  }

  function handleDesktopNotificationReceive() {
    if (notificationId) {
      const action = urlSearchParams?.get('action');

      // handleReceiveNotification(testData, action);
      fetch(`${END_POINT.check_valid_notification.url(notificationId)}`, {
        method: END_POINT.check_valid_notification.method,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('data :>> ', data);
          console.log('action :>> ', action);
          return handleReceiveNotification(data.result, action);
        })
        .catch((error) => {
          console.log('error check notifiation valid :>> ', error);
          if (isGuardian(currentUser)) {
            return history.replace(
              ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS_NO_STUDENT()
            );
          }
          return history.replace(ROUTE_TASKS.DEFAULT);
        });
    }
  }
  function handleSafariNotificationReceived() {
    if (currentUser) {
      const sse = new EventSource(END_POINT.sse_url.url(currentUser.id));
      sse.onopen = function (evt) {
        console.log('evt open :>> ', evt);
      };
      sse.onmessage = function logEvents(event) {
        const res = JSON.parse(event.data);
        console.log('data safari', JSON.parse(event.data));
        if (res.notification) {
          const {
            data: { notificationId },
          } = res;
          handleReceiveNotification(res);
          return dispatch(
            notificationAction.receivedSse({
              id: notificationId,
              deviceToken: localStorage.getItem(LOCAL_STORAGE.DEVICE_TOKEN),
            })
          );
        }
      };
      sse.onerror = function (err) {
        console.log('err :>> ', err);
      };
    }
  }

  function handleReceiveNotification(payload, action) {
    console.log('payload :>> ', payload);
    const {
      data: { seri, notificationTime, studentId },
    } = payload;
    if (isInvalidNotification(notificationTime)) {
      if (isGuardian(currentUser)) {
        return history.push(ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(studentId));
      }
      return history.push(ROUTE_TASKS.DEFAULT);
    }
    switch (seri) {
      case NOTIFICATION_SERIES.SERIES_9A:
      case NOTIFICATION_SERIES.SERIES_9B:
      case NOTIFICATION_SERIES.SERIES_11A:
      case NOTIFICATION_SERIES.SERIES_11B: {
        return handleSeries9A({
          t,
          currentUser,
          payload,
          showNotification,
          startScheduleTask,
          viewTaskDetail,
          handelOpenNudgeMessage,
          action,
        });
      }
      case NOTIFICATION_SERIES.SERIES_1: {
        return handleSeries1({
          t,
          currentUser,
          payload,
          showNotification,
          startScheduleTask,
          viewTaskDetail,
          handelOpenNudgeMessage,
          viewTaskAndTimeBlock,
          action,
        });
      }
      case NOTIFICATION_SERIES.SERIES_2: {
        return handleSeries2({
          t,
          currentUser,
          payload,
          showNotification,
          startScheduleTask,
          viewTaskDetail,
          viewTaskAndTimeBlock,
          handelOpenNudgeMessage,
          action,
        });
      }
      case NOTIFICATION_SERIES.SERIES_25: {
        return handleSeries25({
          t,
          currentUser,
          payload,
          showNotification,
          startScheduleTask,
          viewTaskDetail,
          action,
        });
      }
      default:
        return showNotification({ variant: VARIANT_ICON.WARNING, payload });
    }
  }

  function handleBlockedNotification() {
    const payload = {
      notification: {
        title: t('notification:notification_is_being_blocked'),
        body: t('notification:notification_is_being_blocked'),
      },
    };
    showNotification({ variant: VARIANT_ICON.ERROR, payload });
  }

  function showNotification({
    variant,
    payload,
    actionPrimary,
    actionSecondary,
    ...rest
  }) {
    return enqueueSnackbar(null, {
      ...snackbarConfig,
      ...rest,
      content: (key) => (
        <Notifications
          id={key}
          variant={variant}
          data={payload.data}
          notification={payload.notification}
          actionPrimary={actionPrimary}
          actionSecondary={actionSecondary}
        />
      ),
    });
  }

  const messaging = firebase.messaging.isSupported()
    ? firebase.messaging()
    : null;

  //NOTE: Register notìfication services
  useEffect(() => {
    if (isSafari() ) {
      if (!localStorage.getItem(LOCAL_STORAGE.DEVICE_TOKEN)) {
        dispatch(notificationAction.getSseToken());
      }
      handleSafariNotificationReceived();
    } else {
      if (currentUser) {
        if (isSupportedPushNoti()) {
          if (
            Notification.permission === 'default' &&
            (isStudent(currentUser) || isGuardian(currentUser)) &&
            (isEqual(
              new Date(
                localStorage.getItem(
                  LOCAL_STORAGE.RE_REQUEST_NOTIFICATION_PERMISSION
                )
              ),
              startOfToday()
            ) ||
              !!!localStorage.getItem(
                LOCAL_STORAGE.RE_REQUEST_NOTIFICATION_PERMISSION
              ))
          ) {
            setIsVisible(true);
          } else if (Notification.permission === 'granted') {
            handleGetFbToken();
          }
        }
      }
      //NOTE: Listen to services worker messages
      if (isSupportedPushNoti()) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          handleReceiveNotification(event.data);
        });
      }
      handleDesktopNotificationReceive();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle epic
  useEffect(() => {
    if (startUrgentTaskSuccess) {
      const { organizationId } = currentUser;
      // NOTE: Delay call API to fixes BE issues
      delay(() => {
        if (location.pathname === ROUTE_TASKS.DEFAULT) {
          return dispatch(
            myTasksActions.mtGetTaskInProgress({
              orgId: organizationId,
              isFetchingMTTaskInProgress: true,
            })
          );
        }
        return history.push(ROUTE_TASKS.DEFAULT);
      }, 500);
    }

    if (error === 400 && startUrgentTaskFailed) {
      const {
        data: { seri },
      } = notificationData;
      if (
        notificationData &&
        (seri === NOTIFICATION_SERIES.SERIES_1 ||
          seri === NOTIFICATION_SERIES.SERIES_2)
      ) {
        return viewTaskAndTimeBlock(notificationData, true);
      }
      return history.push(ROUTE_TASKS.DEFAULT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      dispatch(
        notificationAction.resetStateNotification({
          startUrgentTaskSuccess: false,
          startUrgentTaskFailed: false,
          notificationData: null,
          error: null,
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, startUrgentTaskSuccess, startUrgentTaskFailed, isBusy]);

  return (
    <>
      {props.children}
      {isGuardian(currentUser) && (
        <NudgeTextDialog
          open={open}
          onCancel={handleCloseNudgeMessage}
          info={nudgeInfo}
        />
      )}
      {!isSafari() && (
        <RequestNotificationDialog
          open={isVisible}
          onShowOrHideDialog={onShowOrHideDialog}
          handleRequestNotificationPermission={
            handleRequestNotificationPermission
          }
        />
      )}
    </>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node,
};

export default NotificationProvider;
