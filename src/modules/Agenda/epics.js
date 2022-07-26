import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import agendaActions from './actions';
import { END_POINT, actions } from './constants';
// import authActions from 'shared/Auth/actions';

const getAgendaListEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_AGENDA_LIST),
    switchMap((action) => makeAjaxRequest(
        END_POINT.get_agenda_list.method,
        END_POINT.get_agenda_list.url(
          action.payload.orgId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            agendaActions.getAgendaListSuccess({
              agendaList: data?.response?.agendas,
              isBusy: false,
            })
          )),
        catchError((error) => of(
            agendaActions.getAgendaListFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isBusy: false,
            })
          ))
      ))
  );

const getAgendaDetailEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_AGENDA_DETAIL),
    switchMap((action) => makeAjaxRequest(
        END_POINT.get_agenda_detail.method,
        END_POINT.get_agenda_detail.url(
          action.payload.orgId,
          action.payload.agendaId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            agendaActions.getAgendaDetailSuccess({
              agendaDetail: data?.response?.agenda?.details,
              agenda: data?.response?.agenda,
              draftActivities: data?.response?.draftActivities,
              courseTeacher: data?.response?.courseTeacher,
              isBusy: false,
            })
          )),
        catchError((error) => of(
            agendaActions.getAgendaDetailFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isBusy: false,
            })
          ))
      ))
  );

const studentGetAgendaDetailEpic = (action$) =>
  action$.pipe(
    ofType(actions.STUDENT_GET_AGENDA_DETAIL),
    switchMap((action) => makeAjaxRequest(
        END_POINT.student_get_agenda_detail.method,
        END_POINT.student_get_agenda_detail.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            agendaActions.studentGetAgendaDetailSuccess({
              studentAgendaDetail: data?.response?.detail?.details,
              studentAgenda: data?.response?.detail,
              sectionDetail: data?.response?.sectionDetail,
              isBusy: false,
            })
          )),
        catchError((error) => of(
            agendaActions.studentGetAgendaDetailFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isBusy: false,
            })
          ))
      ))
  );

const editAgendaDetailEpic = (action$) =>
  action$.pipe(
    ofType(actions.EDIT_AGENDA_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_agenda_detail.method,
        END_POINT.edit_agenda_detail.url(
          action.payload.orgId,
          action.payload.agendaId,
          action.payload.urlParams
        ),
        action.payload.data
      ).pipe(
        mergeMap(() => of(
            agendaActions.editAgendaDetailSuccess({
              editAgendaDetailSuccess: true,
              editAgendaDetailFailed: false,
            })
          )),
        catchError((error) => of(
            agendaActions.editAgendaDetailFailed({
              error: error?.response?.errors,
              editAgendaDetailFailed: true,
            })
          ))
      )
    )
  );

const markAgendaActivityCompleteEpic = (action$) =>
  action$.pipe(
    ofType(actions.MARK_AGENDA_ACTIVITY_COMPLETE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mark_agenda_activity_complete.method,
        END_POINT.mark_agenda_activity_complete.url(
          action.payload.orgId,
          action.payload.id
        ),
        action.payload.data
      ).pipe(
        mergeMap(() => of(
            agendaActions.markAgendaActivityCompleteSuccess({
              markAgendaActivityCompleteSuccess: true,
              markAgendaActivityCompleteFailed: false,
            })
          )),
        catchError((error) => of(
            agendaActions.markAgendaActivityCompleteFailed({
              error: error?.response?.errors,
              markAgendaActivityCompleteFailed: true,
            })
          ))
      )
    )
  );

export default [
  getAgendaListEpic,
  getAgendaDetailEpic,
  editAgendaDetailEpic,
  markAgendaActivityCompleteEpic,
  studentGetAgendaDetailEpic
];
