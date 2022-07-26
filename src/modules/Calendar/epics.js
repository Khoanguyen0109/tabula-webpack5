import { TYPE_BLOCK_CALENDAR } from 'utils/constants';

import { orderBy } from 'lodash';
import { ofType } from 'redux-observable';
import { concat, of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { generateCalendarSchedule } from 'utils';

import { makeAjaxRequest } from '../../utils/ajax';

import calendarActions from './actions';
import { END_POINT, actions } from './constants';

const getSchedulesEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SCHEDULES),
    switchMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.get_schedules.method,
        END_POINT.get_schedules.url(
          payload?.payloadDataCalendar?.orgId,
          payload?.payloadDataCalendar?.params
        )
      )
        .pipe(
          mergeMap((data) => {
            if (data?.response?.errors) {
              return of(calendarActions.getSchedulesFailed({
                isFetchingCalendar: false,
                error: data.response.errors
              }));
            }
            const { schedules, collision } = generateCalendarSchedule([
              ...data.response?.schedules,
              ...data.response?.tasks,
              ...data.response?.curricularActivities.map((e) => ({ ...e, resizable: true }))
            ], { resizable: true, disabledBlock: false }, [TYPE_BLOCK_CALENDAR.ACTIVITY], false); //TL-3848: Don't show background disabled im calendar view
            return of(calendarActions.getSchedulesSuccess({
              isFetchingCalendar: false,
              error: undefined,
              calendarSchedules: orderBy(schedules, (e) => e.start, ['asc']),
              calendarAvailableTime: data.response?.availableTime,
              calendarStudyHall: data.response?.studyHall,
              calendarCollision: collision
            }));
          }),
          catchError((error) => of(calendarActions.getSchedulesFailed({
              isFetchingCalendar: false,
              error: error?.response?.errors
            })))
        )
    )
  );

const createCurricularEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_CURRICULAR),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.create_curricular.method,
        END_POINT.create_curricular.url(
          action?.payload?.orgId,
          action?.payload?.params
        ),
        action?.payload?.dataBody
      )
        .pipe(
          mergeMap((data) => {
            if (data?.response?.errors) {
              return of(calendarActions.createCurricularFailed({
                isFetchingCalendar: false,
                error: data.response.errors
              }));
            }
            return concat(
              of(calendarActions.createCurricularSuccess({
                isFetchingCalendar: false,
                error: undefined
              })),
              of(calendarActions.getSchedules(action?.payload?.payloadGetCalendar))
            );
          }),
          catchError((error) => of(calendarActions.createCurricularFailed({
              isFetchingCalendar: false,
              error: error?.response?.errors
            })))
        )
    )
  );

const updateCurricularEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_CURRICULAR),
    switchMap((action) => makeAjaxRequest(
        END_POINT.update_curricular.method,
        END_POINT.update_curricular.url(
          action?.payload?.orgId,
          action?.payload?.curricularId,
          action?.payload?.params
        ),
        action?.payload?.dataBody
      )
        .pipe(
          mergeMap((data) => {
            if (data?.response?.errors) {
              return of(calendarActions.updateCurricularFailed({
                isFetchingCalendar: false,
                error: data.response.errors
              }));
            }
            return concat(
              of(calendarActions.updateCurricularSuccess({
                isFetchingCalendar: false,
                error: undefined
              })),
              of(calendarActions.getSchedules(action?.payload?.payloadGetCalendar))
            );
          }),
          catchError((error) => of(calendarActions.updateCurricularFailed({
              isFetchingCalendar: false,
              error: error?.response?.errors
            })))
        )
    )
  );

const deleteCurricularEpic = (action$) =>
  action$.pipe(
    ofType(actions.DELETE_CURRICULAR),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_curricular.method,
        END_POINT.delete_curricular.url(
          action?.payload?.orgId,
          action?.payload?.curricularId,
          action?.payload?.params
        )
      )
        .pipe(
          mergeMap((data) => {
            if (data?.response?.errors) {
              return of(calendarActions.deleteCurricularFailed({
                isFetchingCalendar: false,
                error: data.response.errors
              }));
            }
            return concat(
              of(calendarActions.deleteCurricularSuccess({
                isFetchingCalendar: false,
                error: undefined
              })),
              of(calendarActions.getSchedules(action?.payload?.payloadGetCalendar))
            );
          }),
          catchError((error) => of(calendarActions.deleteCurricularFailed({
              isFetchingCalendar: false,
              error: error?.response?.errors
            })))
        )
    )
  );

export default [
  getSchedulesEpic,
  createCurricularEpic,
  updateCurricularEpic,
  deleteCurricularEpic
];
