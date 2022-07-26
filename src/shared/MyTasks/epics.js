import { makeAjaxRequest } from 'utils/ajax';

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import myTasksActions from './actions';
import { END_POINT, actions } from './constants';

const getTaskInProgressEpic = (action$) => action$.pipe(
    ofType(actions.MT_GET_TASK_IN_PROGRESS),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.mt_get_task_in_progress.method,
        END_POINT.mt_get_task_in_progress.url(
          action.payload.orgId,
          action.payload?.params
        )
      ).pipe(
        mergeMap((data) => of(
            myTasksActions.mtGetTaskInProgressSuccess({
              taskInProgressShared: data?.response?.result || {},
              isFetchingMTTaskInProgress: false,
              errorMTTaskInProgress: null,
            })
          )),
        catchError((error) => of(
            myTasksActions.mtGetTaskInProgressFailed({
              isFetchingMTTaskInProgress: false,
              errorMTTaskInProgress: error?.response?.errors,
            })
          ))
      )
    )
  );

export default [getTaskInProgressEpic];
