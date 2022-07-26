import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import assessmentMethodActions from './actions';
import { END_POINT, actions } from './constants';

const getAssessmentMethodListEpic = (action$) =>
  action$.pipe(
    ofType(
      actions.GET_ASSESSMENT_METHOD_LIST,
      actions.CREATE_ASSESSMENT_METHOD_SUCCESS,
      actions.EDIT_ASSESSMENT_METHOD_SUCCESS
    ),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_assessment_method_list.method,
        END_POINT.get_assessment_method_list.url(
          action.payload.orgId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => {
          const assessmentMethodList = data?.response?.methods;
          return of(
            assessmentMethodActions.getAssessmentMethodListSuccess({
              assessmentMethodList,
              isBusy: false,
            })
          );
        }),
        catchError((error) => of(
            assessmentMethodActions.getAssessmentMethodListFailed({
              error: error.response.errors,
              errorCode: error.status,
              isBusy: false,
            })
          ))
      )
    )
  );

const createAssessmentMethodEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_ASSESSMENT_METHOD),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.create_assessment_method.method,
        END_POINT.create_assessment_method.url(action.payload.orgId),
        action.payload.params
      ).pipe(
        mergeMap(() => of(
            assessmentMethodActions.createAssessmentMethodSuccess({
              orgId: action.payload.orgId,
              isCreateAssessmentMethodSuccess: true,
              isBusy: false,
              error: null,
            })
          )),
        catchError((error) => of(
            assessmentMethodActions.createAssessmentMethodFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isBusy: false,
            })
          ))
      )
    )
  );

const editAssessmentMethodEpic = (action$) =>
  action$.pipe(
    ofType(actions.EDIT_ASSESSMENT_METHOD),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_assessment_method.method,
        END_POINT.edit_assessment_method.url(
          action.payload.orgId,
          action.payload.gradeScaleId
        ),
        action.payload.params
      ).pipe(
        mergeMap(() => of(
            assessmentMethodActions.editAssessmentMethodSuccess({
              orgId: action.payload.orgId,
              isEditAssessmentMethodSuccess: true,
              isBusy: false,
              error: null,
            })
          )),
        catchError((error) => of(
            assessmentMethodActions.editAssessmentMethodFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isBusy: false,
            })
          ))
      )
    )
  );
const setDefaultAssessmentMethodEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.SET_DEFAULT_ASSESSMENT_METHOD),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.set_default_assessment_method.method,
        END_POINT.set_default_assessment_method.url(
          action.payload.orgId,
          action.payload.gradeScaleId
        )
      ).pipe(
        mergeMap(() => {
          const assessmentMethodList =
            state$.value.AssessmentMethod.assessmentMethodList.map((am) => {
              if (am.id !== parseInt(action.payload.gradeScaleId)) {
                am.default = false;
              } else {
                am.default = true;
              }
              return am;
            });
          return of(
            assessmentMethodActions.setDefaultAssessmentMethodSuccess({
              setDefaultAssessmentMethodSuccess: true,
              assessmentMethodList,
              error: null,
            })
          );
        }),
        catchError((error) => of(
            assessmentMethodActions.setDefaultAssessmentMethodFailed({
              error: error?.response?.errors,
            })
          ))
      )
    )
  );
const deleteAssessmentMethodEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.DELETE_ASSESSMENT_METHOD),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_assessment_method.method,
        END_POINT.delete_assessment_method.url(
          action.payload.orgId,
          action.payload.methodId
        ),
        action.payload.params
      ).pipe(
        mergeMap(() => {
          const assessmentMethodList =
            state$.value.AssessmentMethod.assessmentMethodList.filter(
              (method) => method.id !== action.payload.methodId
            );
          return of(
            assessmentMethodActions.editAssessmentMethodSuccess({
              isDeleteAssessmentMethodSuccess: true,
              assessmentMethodList,
              error: null,
            })
          );
        }),
        catchError((error) => of(
            assessmentMethodActions.editAssessmentMethodFailed({
              error: error?.response?.errors,
              errorCode: error?.subcode,
              isBusy: false,
            })
          ))
      )
    )
  );

export default [
  getAssessmentMethodListEpic,
  createAssessmentMethodEpic,
  editAssessmentMethodEpic,
  setDefaultAssessmentMethodEpic,
  deleteAssessmentMethodEpic,
];
