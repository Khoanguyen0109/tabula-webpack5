import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import subjectActions from './actions';
import { END_POINT, actions } from './constants';

const getSubjectListEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SUBJECT_LIST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_subject_list.method,
        END_POINT.get_subject_list.url(action.payload.orgId)
      ).pipe(
        mergeMap((data) =>
          of(
            subjectActions.getSubjectListSuccess({
              subjectList: data?.response?.subjects,
              isLoadingGetSubjectList: false,
              getSubjectListSuccess: true,
            })
          )
        ),
        catchError((error) =>
          of(
            subjectActions.getSubjectListFailed({
              getSubjectListFailed: error?.response?.errors,
              errorCode: error?.status,
              isLoadingGetSubjectList: false,
            })
          )
        )
      )
    )
  );

const createNewSubjectEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_NEW_SUBJECT),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.create_new_subject.method,
        END_POINT.create_new_subject.url(action.payload.orgId),
        action.payload.subject
      ).pipe(
        mergeMap(() =>
          of(
            subjectActions.createNewSubjectSuccess({
              isCreateNewSubjectSuccess: true,
              isLoadingCreateEditSubject: false,
            })
          )
        ),
        catchError((error) =>
          of(
            subjectActions.createNewSubjectFailed({
              createNewSubjectFailed: error?.response,
              isLoadingCreateEditSubject: false,
            })
          )
        )
      )
    )
  );

const editSubjectEpic = (action$) =>
  action$.pipe(
    ofType(actions.EDIT_SUBJECT),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_subject.method,
        END_POINT.edit_subject.url(
          action.payload.orgId,
          action.payload.subjectId
        ),
        action.payload.subject
      ).pipe(
        mergeMap(() =>
          of(
            subjectActions.createNewSubjectSuccess({
              isEditSubjectSuccess: true,
              isLoadingCreateEditSubject: false,
            })
          )
        ),
        catchError((error) =>
          of(
            subjectActions.createNewSubjectFailed({
              editSubjectFailed: error?.response,
              isLoadingCreateEditSubject: false,
            })
          )
        )
      )
    )
  );
export default [getSubjectListEpic, createNewSubjectEpic, editSubjectEpic];
