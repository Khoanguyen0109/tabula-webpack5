import myCoursesActions from 'modules/MyCourses/actions';
import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../../utils/ajax';
import gradeWeightingAction from '../actionConstants/gradeWeightingActions';
import END_POINT from '../endPoints/gradeWeightingEndPoints';

const getGradeWeightEpic = (action$) =>
  action$.pipe(
    ofType(gradeWeightingAction.MC_GET_GRADE_WEIGHT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_grade_weight.method,
        END_POINT.mc_get_grade_weight.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetGradeWeightSuccess({
              gradeWeight: data.response?.gradeWeight?.criterias,
              mcGetGradeWeightSuccess: true,
            })
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcGetGradeWeightFailed()
          )
        )
      )
    )
  );
  const updateGradWeightEpic = (action$) =>
  action$.pipe(
    ofType(gradeWeightingAction.MC_UPDATE_GRADE_WEIGHT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_update_grade_weight.method,
        END_POINT.mc_update_grade_weight.url(
          action.payload.orgId,
          action.payload.courseId
        ),
        { gradeWeight: { criterias: action.payload.criterias } }
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.mcUpdateGradeWeightSuccess({
              updateGradeWeightSuccess: true,
            }),
            myCoursesActions.mcGetGradeWeight({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            })
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcUpdateGradeWeightFailed({
              updateGradeWeightFailed: true,
              error: error.response.errors,
            })
          )
        )
      )
    )
  );
  export default [
    getGradeWeightEpic,
    updateGradWeightEpic
  ];