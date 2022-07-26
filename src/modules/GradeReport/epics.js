import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import gradeReportActions from './actions';
import { END_POINT, actions } from './constants';

const getGradeReportEpic = (action$) => action$.pipe(
          ofType(actions.GET_GRADE_REPORT),
          mergeMap((action) =>
            makeAjaxRequest(
              END_POINT.get_grade_report.method,
              END_POINT.get_grade_report.url(
                action.payload.courseId,
                action.payload.termId,
                action.payload.urlParams
              )
            ).pipe(
              mergeMap((data) => of(
                    gradeReportActions.getGradeReportSuccess({
                      gradeReport: data.response.data,
                      fetchingGradeReport: false
                  })
                )),
              catchError((error) => of(
                    gradeReportActions.getGradeReportFailed({
                    error: error?.response?.errors,
                    fetchingGradeReport: false

                  })
                ))
            )
          )
        );

const getGradeReportAssignmentDetailEpic = (action$) => action$.pipe(
      ofType(actions.GET_GRADE_REPORT_ASSIGNMENT_DETAIL),
      mergeMap((action) =>
        makeAjaxRequest(
          END_POINT.get_grade_report_assignment_detail.method,
          END_POINT.get_grade_report_assignment_detail.url(

            action.payload.shadowId,
            action.payload.urlParams
            )
        ).pipe(
          mergeMap((data) => of(
                gradeReportActions.getGradeReportAssignmentDetailSuccess({
                  gradeReportAssignmentDetail: data.response.data
              })
            )),
          catchError((error) => of(
                gradeReportActions.getGradeReportAssignmentDetailFailed({
                error: error?.response?.errors,

              })
            ))
        )
      )
    );

const getGradeReportQuizDetailEpic = (action$) => action$.pipe(
    ofType(actions.GET_GRADE_REPORT_QUIZ_DETAIL),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.get_grade_report_quiz_detail.method,
        END_POINT.get_grade_report_quiz_detail.url(
          action.payload.shadowId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
              gradeReportActions.getGradeReportQuizDetailSuccess({
                gradeReportQuizDetail: data.response.data
            })
          )),
        catchError((error) => of(
              gradeReportActions.getGradeReportQuizDetailSuccessFailed({
              error: error?.response?.errors,

            })
          ))
      )
    )
  );
export default [
    getGradeReportEpic,
    getGradeReportAssignmentDetailEpic,
    getGradeReportQuizDetailEpic
];
