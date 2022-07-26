import { LOCAL_STORAGE } from 'utils/constants';

import { actions as authActions } from 'shared/Auth/constants';

import i18next from 'i18next';
import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, debounceTime, mergeMap ,switchMap} from 'rxjs/operators';
import { filter } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import notificationActions from './actions';
import { END_POINT, actions } from './constants';

const setDeviceTokenEpic = (action$) => action$.pipe(
    ofType(
      authActions.AUTH_LOGIN_SUCCESS,
      actions.SETUP_DEVICE_TOKEN
      // actions.GET_SSE_TOKEN_SUCCESS
    ),
    filter((action) => action.payload.token),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.setup_device_token.method,
        END_POINT.setup_device_token.url,
        { deviceId: action.payload.token }
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return notificationActions.setupDeviceTokenFailed();
          }
          return of(notificationActions.setupDeviceTokenSuccess());
        }),
        catchError(() => of(notificationActions.setupDeviceTokenFailed()))
      )
    )
  );

const getSseTokenEpic = (action$) => action$.pipe(
    ofType(actions.GET_SSE_TOKEN),
    switchMap(() =>
      makeAjaxRequest(
        END_POINT.sse_token.method,
        END_POINT.sse_token.url()
        // action.payload
      ).pipe(
        mergeMap((data) => {
          localStorage.setItem(LOCAL_STORAGE.DEVICE_TOKEN, data.response.token);
          return of(
            notificationActions.getSseTokenSuccess({
              token: data.response.token,
              getSseTokenSuccess: true,
              isBusy: false,
            })
          );
        }),
        catchError((error) => of(
            notificationActions.getSseTokenFailed({
              error: error?.response?.errors || {
                message: i18next.t('error:general_error'),
              },
              getSseTokenFailed: true,
              isBusy: false,
            })
          ))
      )
    )
  );

const replySseEpic = (action$) => action$.pipe(
    ofType(actions.RECEIVED_SSE),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.reply_sse.method,
        END_POINT.reply_sse.url(),
        action.payload
      ).pipe(
        mergeMap(() => of(
            notificationActions.replySseSuccess({
              replySseSuccess: true,
            })
          )),
        catchError(() => of(
            notificationActions.replySseSuccess({
              replySseSuccess: false,
            })
          ))
      )
    )
  );

const startUrgentTaskEpic = (action$) =>
  action$.pipe(
    ofType(actions.START_URGENT_TASK),
    debounceTime(1000),
    switchMap((action) => {
      const { notificationId, notificationData } = action.payload;
      return makeAjaxRequest(
        END_POINT.start_urgent_task.method,
        END_POINT.start_urgent_task.url(),
        {
          notificationId,
          action: action.payload.action,
        }
      ).pipe(
        mergeMap(() => of(
            notificationActions.startUrgentTaskSuccess({
              startUrgentTaskSuccess: true,
              isBusy: false,
              notificationData,
            })
          )),
        catchError((error) => of(
            notificationActions.startUrgentTaskFailed({
              error: error?.response?.code,
              startUrgentTaskFailed: true,
              notificationData: {
                ...notificationData,
                data: {
                  ...notificationData.data,
                  taskId:
                    error?.response?.errors?.detail?.taskId ||
                    notificationData.data.taskId,
                  taskStatus:
                    error?.response?.errors?.detail?.taskStatus ||
                    notificationData.data.taskStatus,
                },
              },
            })
          ))
      );
    })
  );

const sendNudgeTextEpic = (action$) =>
  action$.pipe(
    ofType(actions.SEND_NUDGE_TEXT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.send_nudge_text.method,
        END_POINT.send_nudge_text.url(),
        action.payload
      ).pipe(
        mergeMap(() => of(
            notificationActions.sendNudgeTextSuccess({
              sendNudgeTextSuccess: true,
              isBusy: false,
            })
          )),
        catchError((error) => of(
            notificationActions.sendNudgeTextFailed({
              error: error?.response?.errors,
              sendNudgeTextFailed: true,
              isBusy: false,
            })
          ))
      )
    )
  );

export default [
  setDeviceTokenEpic,
  getSseTokenEpic,
  sendNudgeTextEpic,
  startUrgentTaskEpic,
  replySseEpic,
];
