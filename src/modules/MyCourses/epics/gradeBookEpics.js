import { makeAjaxRequest } from 'utils/ajax';

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import myCoursesActions from '../actions';
import { END_POINT, actions } from '../constants';

const getMcColumnGradeBook = (action$) => action$.pipe(
    ofType(actions.MC_GET_COLUMN_GRADE_BOOK),
    switchMap(() =>
      makeAjaxRequest(
        END_POINT.mc_get_column_grade_book.method,
        END_POINT.mc_get_column_grade_book.url()
      ).pipe(
        mergeMap(() => of(myCoursesActions.mcColumnGradeBookSuccess({}))),
        catchError(() => of(myCoursesActions.mcColumnGradeBookFailed({})))
      )
    )
  );

const getGradeBookEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_GRADE_BOOK),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_grade_book.method,
        END_POINT.mc_get_grade_book.url(
          action.payload.courseId,
          action.payload.termId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetGradeBookSuccess({
              gradeBookColumn: data.response.courseActivities,
              gradeBookRow: data.response.students,
              isFetchingGradeBook: false,
              gradeBookParticipation: data.response.listParticipation
            })
          )),
        catchError(() => of(
            myCoursesActions.mcGetGradeBookFailed({
              gradeBookColumn: [],
              gradeBookRow: [],
              isFetchingGradeBook: false,
            })
          ))
      )
    )
  );

const mcEditSubmissionStatusEpic = (action$, state$) => action$.pipe(
    ofType(actions.MC_EDIT_SUBMISSION_STATUS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_grade_book_edit_submission_status.method,
        END_POINT.mc_grade_book_edit_submission_status.url(
          action.payload.courseId,
          action.payload.submissionId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          const studentProgress = data.response.data.studentProgress;
          const gradeBookRow = state$.value.AllCourses.gradeBookRow;
          const length = gradeBookRow.length;
          const currentCellUpdate = state$.value.AllCourses.currentCellUpdate;
          currentCellUpdate.value.status = studentProgress.status;
          for (let i = 0; i < length; i++) {
            if (gradeBookRow[i].id === studentProgress.studentId) {
              gradeBookRow[i][
                `a-${studentProgress.shadowAssignment.id}`
              ].status = studentProgress.status;
              break;
            }
          }
          return of(
            myCoursesActions.mcEditSubmissionStatusSuccess({
              mcDoActionSuccess: true,
              currentCellUpdate,
              gradeBookRow,
            })
          );
        }),
        catchError((error) => of(
            myCoursesActions.mcEditSubmissionStatusFailed({
              mcDoActionFailed: true,
              mcDoActionFailedMessage: error?.response?.errors,
            })
          ))
      )
    )
  );

const mcInputOverallGradeEpic = (action$, state$) => action$.pipe(
    ofType(actions.MC_INPUT_OVERALL_GRADE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_input_overall_grade.method,
        END_POINT.mc_input_overall_grade.url(
          action.payload.courseId,
          action.payload.shadowAssignmentId,
          action.payload.progressId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          const studentProgress = data.response.data.studentProgress;
          const currentCellUpdate = state$.value.AllCourses.currentCellUpdate;
          currentCellUpdate.value.overallGrade = studentProgress.overallGrade;

          const gradeBookRow = state$.value.AllCourses.gradeBookRow;
          const length = gradeBookRow.length;
          for (let i = 0; i < length; i++) {
            if (gradeBookRow[i].id === studentProgress.studentId) {
              gradeBookRow[i][
                `a-${action.payload.shadowAssignmentId}`
              ].overallGrade = studentProgress.overallGrade;
            }
          }
          return of(
            myCoursesActions.mcInputOverallGradeSuccess({
              currentCellUpdate,
              gradeBookRow,
              mcDoActionSuccess: true,
              graderDetail: {
                ...state$.value.AllCourses.graderDetail,
                status: studentProgress.status,
              },
            })
          );
        }),
        catchError(() => of(
            myCoursesActions.mcInputOverallGradeFailed({
              mcDoActionFailed: true,
            })
          ))
      )
    )
  );

const mcGetGraderDetailEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_GRADER_DETAIL),
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
            myCoursesActions.mcGetGraderDetailSuccess({
              getGraderDetailSuccess: true,
              graderDetail: data?.response.data,
              isFetchingGraderDetail: false,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcGetGraderDetailFailed({
              error: error?.response?.errors,
              isFetchingGraderDetail: false,
            })
          ))
      )
    )
  );

const mcGetQuizGraderDetailEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_QUIZ_GRADER_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_quiz_grader_detail.method,
        END_POINT.get_quiz_grader_detail.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId,
          action.payload.studentId
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetQuizGraderDetailSuccess({
              getGraderDetailSuccess: true,
              graderDetail: data?.response.data,
              isFetchingGraderDetail: false,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcGetQuizGraderDetailFailed({
              error: error?.response?.errors,
              isFetchingGraderDetail: false,
            })
          ))
      )
    )
  );

const mcInputOverallGradeTestEpic = (action$, state$) => action$.pipe(
    ofType(actions.MC_INPUT_OVERALL_GRADE_TEST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_input_overall_grade.method,
        END_POINT.mc_input_overall_grade_test.url(
          action.payload.courseId,
          action.payload.shadowQuizId,
          action.payload.quizSubmissionId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          const studentProgress = data.response.data.studentProgress;
          const {overallGrade} = studentProgress;
          const currentCellUpdate = state$.value.AllCourses.currentCellUpdate;
          currentCellUpdate.value.overallGrade = studentProgress.overallGrade;

          const gradeBookRow = state$.value.AllCourses.gradeBookRow;
          const graderDetail = state$.value.AllCourses.graderDetail;

          const length = gradeBookRow.length;
          for (let i = 0; i < length; i++) {
            if (gradeBookRow[i].id === studentProgress.studentId) {
              gradeBookRow[i][`q-${action.payload.shadowQuizId}`].overallGrade =
                studentProgress.overallGrade;
              break;
            }
          }
          const returnPayload = {
            currentCellUpdate,
            gradeBookRow,
            mcDoActionSuccess: true,
          };
          if(graderDetail){
            graderDetail.overallGrade =overallGrade;
          }
          returnPayload.graderDetail=graderDetail;
          return of(
            myCoursesActions.mcInputOverallGradeSuccess(returnPayload)
          );
        }),
        catchError(() => of(
            myCoursesActions.mcInputOverallGradeFailed({
              mcDoActionFailed: true,
            })
          ))
      )
    )
  );

const mcCreateQuizAttemptEpic = (action$, state$) => action$.pipe(
    ofType(actions.MC_CREATE_QUIZ_ATTEMPT),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.create_quiz_attempt.method,
        END_POINT.create_quiz_attempt.url(
          action.payload.courseId,
          action.payload.shadowQuizId,
          action.payload.studentId
        )
      ).pipe(
        mergeMap((data) => {
          const graderDetail = state$.value.AllCourses.graderDetail;
          const {quizSubmissionAttempts} = graderDetail;
          const newQuizAttempt= data.response.data;
          quizSubmissionAttempts.unshift(newQuizAttempt);
          return of(
            myCoursesActions.mcCreateQuizAttemptSuccess({
              creatingQuizAttempt: false,
              newQuizAttempt: data.response.data,
              createQuizAttemptSuccess: true,
              graderDetail: {
                ...graderDetail,
                quizSubmissionAttempts: quizSubmissionAttempts
              }
              
            })
          );
        }),
        catchError(() => of(
            myCoursesActions.mcCreateQuizAttemptFailed({
              creatingQuizAttempt: false,
            })
          ))
      ))
  );
const mcInputGradeQuizAttemptEpic = (action$, state$) => action$.pipe(
    ofType(actions.MC_INPUT_GRADE_QUIZ_ATTEMPT),
    mergeMap((action) => {
      const {inputQuizAttemptGrade, retake, makeup } = action.payload;
      const data = {
        grade: inputQuizAttemptGrade,
        retake,
        makeup
      }; 
     return makeAjaxRequest(
        END_POINT.input_grade_quiz_attempt.method,
        END_POINT.input_grade_quiz_attempt.url(
          action.payload.courseId,
          action.payload.shadowQuizId,
          action.payload.studentId,
          action.payload.attemptId
        ),
        data
      ).pipe(
        mergeMap((data) => {
          const {attempt, overallGrade} =data.response.data;

          const graderDetail = state$.value.AllCourses.graderDetail;
          const gradeBookRow = state$.value.AllCourses.gradeBookRow;
          const currentCellUpdate = state$.value.AllCourses.currentCellUpdate;
          const {quizSubmissionAttempts , shadowQuizId, studentId} = graderDetail;
          const index = gradeBookRow.findIndex((row) => row.id === studentId);
          gradeBookRow[index][`q-${shadowQuizId}`].overallGrade = overallGrade ?? '';
          currentCellUpdate.value.overallGrade = overallGrade || '';

          const indexAttempt = quizSubmissionAttempts.findIndex((item) => item.id === attempt.id);
          quizSubmissionAttempts[indexAttempt] = attempt;
          return of(
            myCoursesActions.mcInputGradeQuizAttemptSuccess({
              graderDetail: {
                ...graderDetail,
                overallGrade: overallGrade ?? '',
                quizSubmissionAttempts: quizSubmissionAttempts
              },
              mcDoActionSuccess: true,
              gradeBookRow,
              currentCellUpdate
            })
          );
        }),
        catchError(() => of(myCoursesActions.mcInputGradeQuizAttemptFailed({})))
      );
    }

    )
  );
const mcRemoveQuizAttemptEpic = (action$, state$) => action$.pipe(
    ofType(actions.MC_REMOVE_QUIZ_ATTEMPT),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.remove_quiz_attempt.method,
        END_POINT.remove_quiz_attempt.url(
          action.payload.courseId,
          action.payload.shadowQuizId,
          action.payload.studentId,
          action.payload.attemptId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          const { overallGrade} =data.response.data;
          
          const graderDetail = state$.value.AllCourses.graderDetail;
          const gradeBookRow = state$.value.AllCourses.gradeBookRow;
          const currentCellUpdate = state$.value.AllCourses.currentCellUpdate;
          const {quizSubmissionAttempts , shadowQuizId, studentId} = graderDetail;
          const index = gradeBookRow.findIndex((row) => row.id === studentId);
          gradeBookRow[index][`q-${shadowQuizId}`].overallGrade = overallGrade ?? '';
          currentCellUpdate.value.overallGrade = overallGrade || '';

          const filter= quizSubmissionAttempts.filter((attempt) => attempt.id !== action.payload.attemptId);
          
          return of(
            myCoursesActions.mcRemoveQuizAttemptSuccess({
              removeQuizAttemptSuccess: true,
              graderDetail: {
                ...graderDetail,
                overallGrade: overallGrade??'',
                quizSubmissionAttempts: filter
              },
              mcDoActionSuccess: true,
              currentCellUpdate,
              gradeBookRow
              // removeAttemptId: action.payload.attemptId

            })
          );
        }),
        catchError(() => of(myCoursesActions.mcRemoveQuizAttemptFailed({})))
      )
    )
  );

const mcInputStudentParticipation = (action$, state$) => action$.pipe(
    ofType(actions.MC_INPUT_STUDENT_PARTICIPATION),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_input_student_participation.method,
        END_POINT.mc_input_student_participation.url(
          action.payload.courseId,
          action.payload.termId,
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          const studentParticipation = data.response.data.studentParticipation;
          const currentCellUpdate = state$.value.AllCourses.currentCellUpdate;
          currentCellUpdate.value.overallGrade = studentParticipation.overallGrade || '';

          const gradeBookRow = state$.value.AllCourses.gradeBookRow;
          const length = gradeBookRow.length;
          for (let i = 0; i < length; i++) {
            if (gradeBookRow[i].id === studentParticipation.studentId) {
              gradeBookRow[i][
                `pa-${studentParticipation.gradeWeightCriteriaId}`
              ].overallGrade = studentParticipation.overallGrade || '';
            }
          }
          return of(
            myCoursesActions.mcInputOverallGradeSuccess({
              currentCellUpdate,
              gradeBookRow,
              mcDoActionSuccess: true,
            })
          );
        }),
        catchError(() => of(
            myCoursesActions.mcInputOverallGradeFailed({
              mcDoActionFailed: true,
            })
          ))
      )
    )
  );

const mcCalculateOverallCourseGrade = (action$, state$) => action$.pipe(
    ofType(actions.MC_CALCULATE_OVERALL_COURSE_GRADE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_calculate_overall_course_grade.method,
        END_POINT.mc_calculate_overall_course_grade.url(
          action.payload.courseId,
          action.payload.termId,
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          const calculateData = data.response.data.calculateData;
          const gradeBookRow = state$.value.AllCourses.gradeBookRow;
          const length = gradeBookRow.length;
          for (let i = 0; i < length; i++) {
            if (gradeBookRow[i].id === calculateData.studentId) {
              gradeBookRow[i].overallCourseGrade.calculateOverallGrade = calculateData.calculateOverallGrade ?? '';
              gradeBookRow[i].overallCourseGrade.letterValue = calculateData.letterValue || '';
              break;

            }
          }
          return of(
            myCoursesActions.mcCalculateOverallCourseGradeSuccess({
              mcCalculateOverallCourseGradeSuccess: true,
              gradeBookRow
            })
          );
        }),
        catchError(() => of(
            myCoursesActions.mcCalculateOverallCourseGradeFailed({
            })
          ))
      )
    )
  );

const getReleaseGradeOfGradeBookEpic = (action$ ) => action$.pipe(
    ofType(actions.MC_GET_RELEASE_GRADE_OF_GRADE_BOOK),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_release_grade_of_grade_book.method,
        END_POINT.mc_get_release_grade_of_grade_book.url(
          action.payload.courseId,
          action.payload.termId,
          action.payload.urlParams
        ),
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetReleaseGradeOfGradeBookSuccess({
                releaseGradeOfGradeBook: data.response.data ?? []
            })
          )),
        catchError(() => of(
            myCoursesActions.mcGetReleaseGradeOfGradeBookFailed({
              releaseGradeOfGradeBook: []
            })
          ))
      )
    )
  );

// const releaseGradeOfGradeBookEpic =(action$ , state$) => {
//   return action$.pipe(
//     ofType(actions.MC_RELEASE_GRADE_OF_GRADE_BOOK),
//     switchMap((action) =>
//       makeAjaxRequest(
//         END_POINT.mc_release_grade_of_grade_book.method,
//         END_POINT.mc_release_grade_of_grade_book.url(
//           action.payload.courseId,
//           action.payload.termId,
//         ),
//         action.payload.data
//       ).pipe(
//         mergeMap((data) => {
//           return of(
//             myCoursesActions.mcReleaseGradeOfGradeBookSuccess({
     
//             })
//           );
//         }),
//         catchError((error) => {
//           return of(
//             myCoursesActions.mcReleaseGradeOfGradeBookFailed({
//             })
//           );
//         })
//       )
//     )
//   );
// };

export default [
  getMcColumnGradeBook,
  getGradeBookEpic,
  mcEditSubmissionStatusEpic,
  mcInputOverallGradeEpic,
  mcGetGraderDetailEpic,
  mcGetQuizGraderDetailEpic,
  mcInputOverallGradeTestEpic,
  mcCreateQuizAttemptEpic,
  mcRemoveQuizAttemptEpic,
  mcInputGradeQuizAttemptEpic,
  mcInputStudentParticipation,
  mcCalculateOverallCourseGrade,
  getReleaseGradeOfGradeBookEpic,
];
