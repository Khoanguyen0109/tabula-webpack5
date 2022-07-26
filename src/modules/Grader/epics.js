import { END_POINT as ALL_COURSE_END_POINT } from 'shared/AllCourses/constants';

import myCoursesActions from 'modules/MyCourses/actions';
import { END_POINT as MC_END_POINT } from 'modules/MyCourses/constants';
import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, finalize, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import GraderActions from './actions';
import { END_POINT, actions } from './constants';

const getGraderPermissionEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_PERMISSION_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        MC_END_POINT.mc_get_permission_course.method,
        MC_END_POINT.mc_get_permission_course.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => of(
            GraderActions.getPermissionCourseSuccess({
              courseName: data.response.courseName,
              permission: {
                roles: [
                  ...data.response.courseRoles,
                  ...data.response.organizationRoles,
                ],
              },
            })
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            GraderActions.getPermissionCourseFailed({
              error: error.response.errors,
            })
          )
        )
      )
    )
  );

const getBasicInfoEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_BASIC_INFO),
    switchMap((action) =>
      makeAjaxRequest(
        ALL_COURSE_END_POINT.get_basic_info.method,
        ALL_COURSE_END_POINT.get_basic_info.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => of(
            GraderActions.getBasicInfoSuccess({
              basicInfo: data?.response?.basicInfo,
              getBasicInfoSuccess: true,
            })
          )),
        catchError((error) => of(
            GraderActions.getBasicInfoFailed({
              getBasicInfoFailed: error?.response?.errors,
              errorCode: error?.status,
            })
          ))
      )
    )
  );

const getToGradeListEpic = (action$) => action$.pipe(
    ofType(actions.GET_TO_GRADE_LIST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_to_grade_list.method,
        END_POINT.get_to_grade_list.url(action.payload.orgId)
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.myCoursesSetState({
              toGradeList: data.response.listCourses,
              totalSubmission: data.response.totalSubmission,
            })
          )),
        catchError(() => of(
            myCoursesActions.myCoursesSetState({
              // error: error?.response?.errors,
            })
          ))
      )
    )
  );

const getActivitiesInGraderEpic = (action$) => action$.pipe(
    ofType(actions.GET_ACTIVITIES_IN_GRADER),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_activities_in_grader.method,
        END_POINT.get_activities_in_grader.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => {
          // const getActivitiesSuccess =  GraderActions.getActivitiesInGraderSuccess({
          //   assignmentList: data.response.assignments,
          // });
          if (data.response.assignments.length > 0) {
            return of(
              GraderActions.getActivitiesInGraderSuccess({
                assignmentList: data.response.assignments,
              }),
              GraderActions.getSectionsByActivityGrader({
                orgId: action.payload.orgId,
                courseId: action.payload.courseId,
                activityId: data.response.assignments[0].id,
              })
            );
          }
          return of(
            GraderActions.getActivitiesInGraderSuccess({
              assignmentList: data.response.assignments,
            })
          );
        }),
        catchError(() => of(
            GraderActions.getActivitiesInGraderFailed({
              // error: error?.response?.errors,
            })
          ))
      )
    )
  );

const getSectionsByActivityGraderEpic = (action$) => action$.pipe(
    ofType(actions.GET_SECTIONS_BY_ACTIVITY_GRADER),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_sections_by_activity_grader.method,
        END_POINT.get_sections_by_activity_grader.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.activityId
        )
      ).pipe(
        mergeMap((data) => of(
            GraderActions.getSectionsByActivityGraderSuccess({
              sectionList: data.response.sections,
            })
          )),
        catchError(() => of(
            GraderActions.getSectionsByActivityGraderFailed({
              // error: error?.response?.errors,
            })
          ))
      )
    )
  );

const getGradingListEpic = (action$) => action$.pipe(
    ofType(actions.GET_GRADING_LIST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_grading_list.method,
        END_POINT.get_grading_list.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.assignmentId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            GraderActions.getGradingListSuccess({
              gradingList: data.response.data,
              fetchingGradingList: false,
            })
          )),
        catchError((error) => of(
            GraderActions.getGradingListFailed({
              error: error?.response?.errors,
              fetchingGradingList: false,
            })
          )),
        finalize(() => of(
            GraderActions.graderSetState({
              fetchingGradingList: false,
            })
          ))
      )
    )
  );

const getGraderDetailEpic = (action$) => action$.pipe(
    ofType(actions.GET_GRADER_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_grader_detail.method,
        END_POINT.get_grader_detail.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId,
          action.payload.studentId
        )
      ).pipe(
        mergeMap((data) => of(
            GraderActions.getGraderDetailSuccess({
              getGraderDetailSuccess: true,
              graderDetail: data?.response.data,
              isFetchingGraderDetail: false,
            })
          )),
        catchError((error) => of(
            GraderActions.getGraderDetailFailed({
              error: error?.response?.errors,
              isFetchingGraderDetail: false,
            })
          ))
      )
    )
  );

const getTotalGradedEpic = (action$) => action$.pipe(
    ofType(actions.GET_TOTAL_GRADED),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_total_graded.method,
        END_POINT.get_total_graded.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.assignmentId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            GraderActions.getTotalGradedSuccess({
              summary: data.response.summary,
              total: data.response.total,
            })
          )),
        catchError((error) => of(
            GraderActions.getTotalGradedFailed({
              error: error?.response?.errors,
            })
          ))
      )
    )
  );
const handleUpdateGradingList = (data, state$) => {
  const { studentSelected } = state$.value.Grader;
  return state$.value.Grader.gradingList.map((student) => {
    if (student.studentId === studentSelected) {
      return {
        ...student,
        status: data.studentProgressStatus,
        overallGrade: data.overallGrade,
      };
    }
    return student;
  });
};
const inputGradeEpic = (action$, state$) => action$.pipe(
    ofType(actions.INPUT_GRADE),
    switchMap((action) => makeAjaxRequest(
        END_POINT.input_grade.method,
        END_POINT.input_grade.url(
          action.payload.courseId,
          action.payload.shadowAssignmentId,
          action.payload.progressId,
          action.payload.submissionAttemptId
        ),
        action.payload.data
      ).pipe(
        mergeMap((ajaxResponse) => {
          const { data } = ajaxResponse.response;
          const gradingListUpdated = handleUpdateGradingList(data, state$);

          return of(
            GraderActions.graderSetState({
              inputGradeSuccess: true,
              attemptGradedId: data.submissionAttempt.id,
              statusGraded: data.studentProgressStatus,
              attemptSelected: {
                ...state$.value.Grader.attemptSelected,
                grade: data.submissionAttempt.grade,
                finalGrade: data.submissionAttempt.finalGrade,
              },
              graderDetail: {
                ...state$.value.Grader.graderDetail,
                overallGrade: data.overallGrade,
              },
              gradingList: gradingListUpdated,
            })
          );
        }),
        catchError((error) => of(
            GraderActions.getTotalGradedFailed({
              error: error?.response?.errors,
            })
          ))
      ))
  );
const inputOverallGradeEpic = (action$, state$) => action$.pipe(
    ofType(actions.INPUT_OVERALL_GRADE),
    switchMap((action) => makeAjaxRequest(
        END_POINT.input_overall_grade.method,
        END_POINT.input_overall_grade.url(
          action.payload.courseId,
          action.payload.shadowAssignmentId,
          action.payload.progressId
        ),
        action.payload.data
      ).pipe(
        mergeMap((ajaxResponse) => {
          const { data } = ajaxResponse.response;
          const gradingListUpdated = handleUpdateGradingList(data, state$);
          return of(
            GraderActions.graderSetState({
              inputGradeSuccess: true,
              graderDetail: {
                ...state$.value.Grader.graderDetail,
                overallGrade: data.overallGrade,
              },
              statusGraded: data.studentProgressStatus,
              gradingList: gradingListUpdated,
            })
          );
        }),
        catchError((error) => of(
            GraderActions.getTotalGradedFailed({
              error: error?.response?.errors,
            })
          ))
      ))
  );

export default [
  getBasicInfoEpic,
  getGraderPermissionEpic,
  getToGradeListEpic,
  getActivitiesInGraderEpic,
  getSectionsByActivityGraderEpic,
  getGradingListEpic,
  getGraderDetailEpic,
  getTotalGradedEpic,
  inputGradeEpic,
  inputOverallGradeEpic,
];
