import { makeAjaxRequest } from 'utils/ajax';
import { TYPE_BLOCK_CALENDAR } from 'utils/constants';

import CommonActions from 'shared/Common/actions';

import { ofType } from 'redux-observable';
import { concat, of } from 'rxjs';
import { catchError, finalize, mergeMap, switchMap } from 'rxjs/operators';
import { generateCalendarSchedule } from 'utils';

import myTasksActions from './actions';
import { END_POINT, actions } from './constants';

const getScheduledTasksEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SCHEDULED_TASKS),
    mergeMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.get_scheduled_tasks.method,
        END_POINT.get_scheduled_tasks.url(
          payload?.orgId,
          payload?.params
          // { // params
          //   schoolYearId: payload?.payloadData?.schoolYearId,
          //   ...payload?.payloadData?.paramSort,
          //   timezone: payload?.payloadData?.timezone
          // }
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              myTasksActions.getScheduledTasksFailed({
                isFetchingScheduled: false,
              })
            );
          }
          return of(
            myTasksActions.getScheduledTasksSuccess({
              scheduledTasks: data.response.items || [],
              isFetchingScheduled: false,
            })
          );
        }),
        catchError(() =>
          of(
            myTasksActions.getScheduledTasksFailed({
              isFetchingScheduled: false,
            })
          )
        )
      )
    )
  );

const getUnscheduledTasksEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_UNSCHEDULED_TASKS),
    mergeMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.get_unscheduled_tasks.method,
        END_POINT.get_unscheduled_tasks.url(payload?.orgId, payload?.params)
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              myTasksActions.getScheduledTasksFailed({
                isFetchingUnscheduled: false,
              })
            );
          }
          return of(
            myTasksActions.getScheduledTasksSuccess({
              unscheduledTasks: data.response.items || [],
              isFetchingUnscheduled: false,
            })
          );
        }),
        catchError(() =>
          of(
            myTasksActions.getScheduledTasksFailed({
              isFetchingUnscheduled: false,
            })
          )
        )
      )
    )
  );

const getCompletedTasksEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_COMPLETED_TASKS),
    mergeMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.get_completed_tasks.method,
        END_POINT.get_completed_tasks.url(payload?.orgId, payload?.params)
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              myTasksActions.getCompletedTasksFailed({
                isFetchingCompleted: false,
              })
            );
          }
          return of(
            myTasksActions.getCompletedTasksSuccess({
              completedTasks: data.response.items || [],
              totalCompletedTasks: data.response.total || 0,
              isFetchingCompleted: false,
            })
          );
        }),
        catchError(() =>
          of(
            myTasksActions.getCompletedTasksFailed({
              isFetchingCompleted: false,
            })
          )
        )
      )
    )
  );

const getDetailTaskEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_DETAIL_TASK),
    mergeMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.get_detail_task.method,
        END_POINT.get_detail_task.url(
          payload?.payloadDataDetail?.orgId,
          payload?.payloadDataDetail?.taskId,
          payload?.payloadDataDetail?.params
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              myTasksActions.getDetailTaskFailed({
                isFetchingDetailTask: false,
                errorDetailTask: data.response.errors.subcode,
              })
            );
          }
          return of(
            myTasksActions.getDetailTaskSuccess({
              detailTask: payload?.payloadDataDetail?.convertModelResponse(
                data.response
              ),
              isFetchingDetailTask: false,
              errorDetailTask: null,
            })
          );
        }),
        catchError((error) => of(
            myTasksActions.getDetailTaskFailed({
              isFetchingDetailTask: false,
              errorDetailTask: error?.response?.errors,
            })
          ))
      )
    )
  );

const getCalendarSchedulesEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_CALENDAR_SCHEDULES),
    switchMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.get_calendar_schedules.method,
        END_POINT.get_calendar_schedules.url(
          payload?.payloadDataCalendar?.orgId,
          payload?.payloadDataCalendar?.params
        )
      ).pipe(
        mergeMap((data) => {
          if (data?.response?.errors) {
            return of(
              myTasksActions.getCalendarSchedulesFailed({
                isFetchingCalendar: false,
                errorCalendar: data.response.errors,
              })
            );
          }
          const { schedules, collision } = generateCalendarSchedule(
            [
              ...data.response?.schedules,
              ...(data.response?.tasks?.map((e) =>
                payload?.payloadDataCalendar?.taskRescheduled === e.id
                  ? { ...e, isIndicator: true, resizable: true }
                  : e
              ) || []),
              ...data.response?.curricularActivities,
            ],
            { resizable: true, disabledBlock: true },
            [TYPE_BLOCK_CALENDAR.TASK]
          );
          return of(
            myTasksActions.getCalendarSchedulesSuccess({
              isFetchingCalendar: false,
              errorCalendar: undefined,
              calendarSchedules: schedules,
              calendarAvailableTime: data.response?.availableTime,
              calendarStudyHall: data.response?.studyHall,
              calendarCollision: collision,
            })
          );
        }),
        catchError((error) => of(
            myTasksActions.getCalendarSchedulesFailed({
              isFetchingCalendar: false,
              errorCalendar: error?.response?.errors,
            })
          ))
      )
    )
  );

const getDailyCalendarSchedulesEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_DAILY_CALENDAR_SCHEDULES),
    switchMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.get_calendar_schedules.method,
        END_POINT.get_calendar_schedules.url(
          payload?.payloadDataDailyCalendar?.orgId,
          payload?.payloadDataDailyCalendar?.params
        )
      ).pipe(
        mergeMap((data) => {
          if (data?.response?.errors) {
            return of(
              myTasksActions.getDailyCalendarSchedulesFailed({
                isFetchingDailyCalendar: false,
                errorDailyCalendar: data.response.errors,
              })
            );
          }
          const { schedules } = generateCalendarSchedule(
            [
              ...data.response?.schedules,
              ...data.response?.tasks.map((e) => ({ ...e, resizable: true })),
              ...data.response?.curricularActivities,
            ],
            { resizable: true, disabledBlock: true },
            [TYPE_BLOCK_CALENDAR.TASK]
          );
          return of(
            myTasksActions.getDailyCalendarSchedulesSuccess({
              isFetchingDailyCalendar: false,
              errorDailyCalendar: undefined,
              dailyCalendarSchedules: schedules,
            })
          );
        }),
        catchError((error) => of(
            myTasksActions.getDailyCalendarSchedulesFailed({
              isFetchingDailyCalendar: false,
              errorDailyCalendar: error?.response?.errors,
            })
          ))
      )
    )
  );

const getCalendarSchoolYearEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_CALENDAR_SCHOOL_YEAR),
    mergeMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.get_calendar_school_year.method,
        END_POINT.get_calendar_school_year.url(
          payload?.payloadData?.orgId,
          payload?.payloadData?.studentId,
          payload?.payloadData?.params
        )
      ).pipe(
        mergeMap((data) => {
          if (data?.response?.errors) {
            return of(
              myTasksActions.getCalendarSchoolYearFailed({
                isFetchingSchoolYear: false,
                error: data.response.errors,
              })
            );
          }

          return of(
            myTasksActions.getCalendarSchoolYearSuccess({
              isFetchingSchoolYear: false,
              error: undefined,
              schoolYears: data.response?.schoolYear,
              isGetCalendarSchoolYearSuccess: true,
            })
          );
        }),
        catchError((error) => of(
            myTasksActions.getCalendarSchoolYearFailed({
              isFetchingSchoolYear: false,
              error: error?.response?.errors,
            })
          ))
      )
    )
  );

const createTaskEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_TASK),
    mergeMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.create_task.method,
        END_POINT.create_task.url(
          payload?.payloadData?.orgId,
          payload?.payloadData?.taskId,
          payload?.payloadData?.params
        ),
        payload?.payloadData?.body
      ).pipe(
        mergeMap((data) => {
          if (data?.response?.errors) {
            return of(
              myTasksActions.createTaskFailed({
                isFetchingCreateTask: false,
                taskJustScheduled: [],
                errorCreateTask: data?.response,
              })
            );
          }
          return of(
            myTasksActions.createTaskSuccess({
              isFetchingCreateTask: false,
              taskJustScheduled: payload?.payloadData?.taskId,
              errorCreateTask: undefined,
            })
          );
        }),
        catchError((error) => of(
            myTasksActions.createTaskFailed({
              isFetchingCreateTask: false,
              taskJustScheduled: [],
              errorCreateTask: error?.response,
            })
          ))
      )
    )
  );

const rescheduleTaskEpic = (action$) =>
  action$.pipe(
    ofType(actions.RESCHEDULE_TASK),
    mergeMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.reschedule_task.method,
        END_POINT.reschedule_task.url(
          payload?.payloadData?.orgId,
          payload?.payloadData?.taskId,
          // timezone
          payload?.payloadData?.params
        ),
        payload?.payloadData?.body
      ).pipe(
        mergeMap((data) => {
          if (data?.response?.errors) {
            return of(
              myTasksActions.rescheduleTaskFailed({
                isFetchingRescheduleTask: false,
                errorRescheduleTask: data.response,
              })
            );
          }
          return of(
            myTasksActions.rescheduleTaskSuccess({
              isFetchingRescheduleTask: false,
              isReSchedulesSuccess: true,
            })
          );
        }),
        catchError((error) => of(
            myTasksActions.rescheduleTaskFailed({
              isFetchingRescheduleTask: false,
              errorRescheduleTask: error?.response,
            })
          ))
      )
    )
  );

const getTimeBlocksByTaskEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_TIME_BLOCKS_BY_TASK),
    mergeMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.get_time_blocks_by_task.method,
        END_POINT.get_time_blocks_by_task.url(
          payload?.payloadGetTimeBlocksByTask?.orgId,
          payload?.payloadGetTimeBlocksByTask?.taskId,
          payload?.payloadGetTimeBlocksByTask?.params
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              myTasksActions.getTimeBlocksByTaskFailed({
                isFetchingGetTimeBlocksByTask: false,
                errorGetTimeBlocksByTask: data.response.errors.subcode,
              })
            );
          }
          return of(
            myTasksActions.getTimeBlocksByTaskSuccess({
              isFetchingGetTimeBlocksByTask: false,
              timeBlocksByTask: data.response.task,
              errorGetTimeBlocksByTask: null,
            })
          );
        }),
        catchError((error) => of(
            myTasksActions.getTimeBlocksByTaskFailed({
              isFetchingGetTimeBlocksByTask: false,
              errorGetTimeBlocksByTask: error?.response?.errors?.subcode,
            })
          ))
      )
    )
  );

const deleteTimeBlockEpic = (action$) =>
  action$.pipe(
    ofType(actions.DELETE_TIME_BLOCK),
    mergeMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.delete_time_block.method,
        END_POINT.delete_time_block.url(
          payload?.payloadDeleteTimeBlock?.orgId,
          payload?.payloadDeleteTimeBlock?.task?.id,
          payload?.payloadDeleteTimeBlock?.timeBlock?.id
        ),
        payload?.payloadDeleteTimeBlock?.body
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              myTasksActions.deleteTimeBlockFailed({
                isFetchingDeleteTimeBlock: false,
                errorDeleteTimeBlock: data.response.errors.subcode,
              })
            );
          }
          if (payload?.payloadDeleteTimeBlock?.isOnlyUpcoming) {
            return of(
              myTasksActions.deleteTimeBlockSuccess({
                isFetchingDeleteTimeBlock: false,
                errorDeleteTimeBlock: null,
              })
            );
          }
          return concat(
            of(
              myTasksActions.deleteTimeBlockSuccess({
                isFetchingDeleteTimeBlock: false,
                errorDeleteTimeBlock: null,
              })
            ),
            of(
              myTasksActions.getTimeBlocksByTask(
                payload?.payloadGetTimeBlocksByTask
              )
            )
          );
        }),
        catchError((error) => of(
            myTasksActions.deleteTimeBlockFailed({
              isFetchingDeleteTimeBlock: false,
              errorDeleteTimeBlock: error?.response?.errors?.subcode,
            })
          ))
      )
    )
  );

const getMTDetailsEpic = (action$) =>
  action$.pipe(
    ofType(actions.MT_GET_TASK_DETAILS),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.mt_get_task_details.method,
        END_POINT.mt_get_task_details.url(
          action.payload.orgId,
          action.payload.taskId,
          action.payload?.params
        )
      ).pipe(
        mergeMap((data) => of(
            myTasksActions.mtGetTaskDetailsSuccess({
              taskDetails: data?.response?.task,
              taskInProgress: data?.response?.inProgress || {},
              isFetchingMTTaskDetails: false,
              errorMTTaskDetails: null,
            })
          )),
        catchError((error) => of(
            myTasksActions.mtGetTaskDetailsFailed({
              isFetchingMTTaskDetails: false,
              errorMTTaskDetails: error?.response?.errors,
              error: error?.response?.errors,
            })
          ))
      )
    )
  );

const workingOnTimeBlockEpic = (action$) =>
  action$.pipe(
    ofType(actions.WORKING_ON_TIME_BLOCK),
    mergeMap(({ payload }) =>
      makeAjaxRequest(
        END_POINT.working_on_time_block.method,
        END_POINT.working_on_time_block.url(
          payload?.payloadWorkingOnTimeBlock?.orgId,
          payload?.payloadWorkingOnTimeBlock?.taskId,
          payload?.payloadWorkingOnTimeBlock?.timeBlockId
        ),
        payload?.payloadWorkingOnTimeBlock?.body
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              myTasksActions.workingOnTimeBlockFailed({
                isFetchingWorkingOnTimeBlock: false,
                errorWorkingOnTimeBlock: data.response.errors.subcode,
              })
            );
          }
          return of(
            myTasksActions.workingOnTimeBlockSuccess({
              isFetchingWorkingOnTimeBlock: false,
              errorWorkingOnTimeBlock: null,
              workingOnTimeBlockSuccess: true,
              taskStatus: data.response?.status,
            })
          );
        }),
        catchError((error) => of(
            myTasksActions.workingOnTimeBlockFailed({
              isFetchingWorkingOnTimeBlock: false,
              errorWorkingOnTimeBlock: error?.response?.errors?.subcode,
            })
          ))
      )
    )
  );

const getTaskInProgressEpic = (action$) => action$.pipe(
    ofType(actions.MT_GET_TASK_IN_PROGRESS),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.mt_get_task_in_progress.method,
        END_POINT.mt_get_task_in_progress.url(
          action.payload.orgId,
          action.payload?.params
        )
      ).pipe(
        mergeMap((data) => of(
            myTasksActions.mtGetTaskInProgressSuccess({
              taskInProgress: data?.response?.result || {},
              errorMTTaskInProgress: null,
            })
          )),
        catchError((error) => of(
            myTasksActions.mtGetTaskInProgressFailed({
              errorMTTaskInProgress: error?.response?.errors,
            })
          )),
        finalize(() => of(
            myTasksActions.myTasksSetState({
              isFetchingMTTaskInProgress: false,
            })
          ))
      ))
  );

const mtStartUrgentTaskEpic = (action$, state$) => action$.pipe(
    ofType(actions.MT_START_URGENT_TASK),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.start_urgent_task.method,
        END_POINT.start_urgent_task.url(
          state$.value.Auth.currentUser.organizationId,
          action.payload.taskId,
          action.payload?.params
        )
      ).pipe(
        mergeMap(() => of(
            myTasksActions.mtStartUrgentTaskSuccess({
              mtStartUrgentTaskSuccess: true,
            })
          )),
        catchError((error) => of(
            myTasksActions.mtStartUrgentTaskFailed({
              errorStartUrgentTask: error?.response?.errors?.subcode,
            })
          ))
      )
    )
  );

const mtUseGoogleTemplateEpic = (action$) => action$.pipe(
    ofType(actions.MT_USE_GOOGLE_TEMPLATE),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.use_google_template.method,
        END_POINT.use_google_template.url(),
        action.payload.data
      ).pipe(
        mergeMap((data) => of(
            myTasksActions.mtUseGoogleTemplateSuccess({
              googleFileTemplate: data.response.data,
              useTemplateLoading: false,
              mtUseGoogleTemplateSuccess: true,
            }),
            CommonActions.commonSetState({
              openPreview: true,
              fileInformation: data.response.data
            })
          )),
        catchError((error) => of(
            myTasksActions.mtUseGoogleTemplateFailed({
              errorUseGoogleTemplate: error?.response?.errors?.subcode,
              useTemplateLoading: false,
            })
          ))
      )
    )
  );

export default [
  getScheduledTasksEpic,
  getUnscheduledTasksEpic,
  getCompletedTasksEpic,
  getDetailTaskEpic,
  getCalendarSchedulesEpic,
  getDailyCalendarSchedulesEpic,
  getCalendarSchoolYearEpic,
  createTaskEpic,
  rescheduleTaskEpic,
  deleteTimeBlockEpic,
  getTimeBlocksByTaskEpic,
  getMTDetailsEpic,
  workingOnTimeBlockEpic,
  getTaskInProgressEpic,
  mtStartUrgentTaskEpic,
  mtUseGoogleTemplateEpic,
];
