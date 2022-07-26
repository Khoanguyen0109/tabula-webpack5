import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import myCoursesActions from './actions';
import { END_POINT, actions } from './constants';
import gradeBookEpics from './epics/gradeBookEpics';
import gradeWeightingEpics from './epics/gradeWeightingEpics';
import { getQueueUpdate } from './utils';
// import Worker from './course.worker.js';

const getMyCoursesListEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_MY_COURSES_LIST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_my_courses_list.method,
        END_POINT.get_my_courses_list.url(
          action.payload.orgId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.getMyCoursesListSuccess({
              myCoursesList: data?.response?.listCourse,
              isBusy: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.getMyCoursesListFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isBusy: false,
            })
          ))
      )
    )
  );

const getLinkedContentsEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_LINKED_CONTENTS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_linked_contents.method,
        END_POINT.get_linked_contents.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.getLinkedContentsSuccess({
              assignmentsContents: data?.response?.assignments,
              lessonsContents: data?.response?.lessons,
              quizzesContents: data?.response?.quizzes || [],
              isBusy: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.getLinkedContentsFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isBusy: false,
            })
          ))
      )
    )
  );

const getSyllabusEpic = (action$) =>
  action$.pipe(
    ofType(actions.MC_GET_SYLLABUS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_syllabus.method,
        END_POINT.mc_get_syllabus.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.syllabus) {
            return of(
              myCoursesActions.mcGetSyllabusSuccess({
                syllabus: data.response?.syllabus,
                syllabusFetching: false,
              })
            );
          }
        }),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcGetSyllabusFailed({ syllabusFetching: false })
          ))
      )
    )
  );

const updateSyllabusEpic = (action$) =>
  action$.pipe(
    ofType(actions.MC_UPDATE_SYLLABUS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_update_syllabus.method,
        END_POINT.mc_update_syllabus.url(
          action.payload.orgId,
          action.payload.courseId
        ),
        { syllabus: action.payload.syllabus }
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.mcUpdateSyllabusSuccess({
              updateSyllabusSuccess: true,
            }),
            myCoursesActions.getCourseValidation({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            }),
            myCoursesActions.mcGetSyllabus({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcUpdateSyllabusFailed({
              updateSyllabusSuccess: false,
            })
          ))
      )
    )
  );

const getAssignmentDetailEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_ASSIGNMENT_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_assignment_detail.method,
        END_POINT.get_assignment_detail.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.assignmentId
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.getAssignmentDetailSuccess({
              assignment: data?.response?.assignment,
              activityDetails: data?.response?.assignment,
              isBusy: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.getAssignmentDetailFailed({
              error: error?.response?.errors,
              errorCode: error?.response?.code,
              isBusy: false,
            })
          ))
      )
    )
  );

const getShadowAssignmentDetailEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SHADOW_ASSIGNMENT_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_shadow_assignment_detail.method,
        END_POINT.get_shadow_assignment_detail.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.getShadowAssignmentDetailSuccess({
              shadowAssignment: data?.response?.assignment,
              isBusy: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.getShadowAssignmentDetailFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isBusy: false,
            })
          ))
      )
    )
  );

const studentViewShadowAssignmentEpic = (action$) =>
  action$.pipe(
    ofType(actions.STUDENT_GET_SHADOW_ASSIGNMENT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.student_get_shadow_assignment.method,
        END_POINT.student_get_shadow_assignment.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.studentGetShadowAssignmentSuccess({
              shadowAssignmentDetail: data?.response?.data,
              errorStudentEditShadowAssignment: null,
              activityDetails: data?.response?.data,
              isBusy: false,
              studentGetShadowAssignmentError: null,
              studentGetShadowQuizError: null,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.studentGetShadowAssignmentFailed({
              // error: error?.response?.errors,
              studentGetShadowAssignmentError: error?.response,
              activityDetails: error?.response?.detail,
              isBusy: false,
              errorCode: error?.response?.code,
            })
          ))
      )
    )
  );

const studentEditShadowAssignmentEpic = (action$) =>
  action$.pipe(
    ofType(actions.STUDENT_EDIT_SHADOW_ASSIGNMENT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.student_edit_shadow_assignment.method,
        END_POINT.student_edit_shadow_assignment.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId
        ),
        action.payload.data
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.studentEditShadowAssignmentSuccess({
              isTurningIn: false,
              studentEditShadowAssignmentSuccess: true,
              errorStudentEditShadowAssignment: null,
              isTurnIn: action.payload.data?.turnIn || false,
            })
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.studentEditShadowAssignmentFailed({
              isTurningIn: false,
              studentEditShadowAssignmentFailed: true,
              errorStudentEditShadowAssignment: error.response.errors,
            })
          )
        )
      )
    )
  );

const createNewAssignmentEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_NEW_ASSIGNMENT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.create_new_assignment.method,
        END_POINT.create_new_assignment.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.createNewAssignmentSuccess({
              createNewAssignmentSuccess: true,
              assignment: data?.response?.assignment,
            })
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.createNewAssignmentFailed({
              createNewAssignmentSuccess: false,
              errorMasterAssignment: error.response.errors,
            })
          )
        )
      )
    )
  );

const editAssignmentEpic = (action$) =>
  action$.pipe(
    ofType(actions.EDIT_ASSIGNMENT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_assignment.method,
        END_POINT.edit_assignment.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.assignmentId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.editAssignmentSuccess({
              // createNewAssignmentSuccess: true,
              editMasterAssignmentSuccess: true,
              errorMasterAssignment: null,
              queueUpdate: getQueueUpdate(data?.response?.courseDayIds),
            })
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.editAssignmentFailed({
              editMasterAssignmentFailed: true,
              errorMasterAssignment: error.response.errors,
            })
          )
        )
      )
    )
  );

const editShadowAssignmentEpic = (action$) =>
  action$.pipe(
    ofType(actions.EDIT_SHADOW_ASSIGNMENT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_shadow_assignment.method,
        END_POINT.edit_shadow_assignment.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId
        ),
        action.payload.data
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.editShadowAssignmentSuccess({
              editShadowAssignmentSuccess: true,
              editShadowAssignmentFailed: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.editShadowAssignmentFailed({
              editShadowAssignmentFailed: true,
              errorShadowAssignment: error.response.errors,
            })
          ))
      )
    )
  );

const deleteAssignmentEpic = (action$) =>
  action$.pipe(
    ofType(actions.DELETE_ASSIGNMENT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_assignment.method,
        END_POINT.delete_assignment.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.assignmentId
        ),
        action.payload.assignment
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.deleteAssignmentSuccess({
              deleteAssignmentSuccess: true,
            })
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.deleteAssignmentFailed({
              error: error.response.errors,
            })
          )
        )
      )
    )
  );

const createNewUnitEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_NEW_UNIT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.create_new_unit.method,
        END_POINT.create_new_unit.url(
          action.payload.orgId,
          action.payload.courseId
        ),
        action.payload.unit
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.createNewUnitSuccess({
              isCreateNewUnitSuccess: true,
              isCreatingUnit: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.createNewUnitFailed({
              error: error?.response?.errors,
              isCreatingUnit: false,
            })
          ))
      )
    )
  );

const getTermsListByCourseEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_TERMS_LIST_BY_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_terms_list_by_course.method,
        END_POINT.get_terms_list_by_course.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.getTermsListByCourseSuccess({
              termsListByCourse: data?.response?.terms,
              isFetchingTermsList: false,
            })
            // myCoursesActions.getUnitsByTerm({
            //   orgId: action.payload.orgId,
            //   courseId: action.payload.courseId,
            //   urlParams: { termIds: data?.response?.terms[0]?.id, groupBy: 'gradingPeriod' },
            //   isFetchingUnitsList: true
            // })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.getTermsListByCourseFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isFetchingTermsList: false,
            })
          ))
      )
    )
  );
const getCoursePermissionEpic = (action$) =>
  action$.pipe(
    ofType(actions.MC_GET_PERMISSION_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_permission_course.method,
        END_POINT.mc_get_permission_course.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => {
          let roles = [...data.response.organizationRoles];
          if (!!data?.response?.courseRoles) {
            roles =[...roles , ...data?.response?.courseRoles];
          }
          return of(
            myCoursesActions.mcGetPermissionCourseSuccess({
              permission: {
                roles: roles,
                courseRoles: data?.response?.courseRoles
              },
            })
          );
        }),
        catchError((error) => of(
            myCoursesActions.mcGetPermissionCourseFailed({
              error: error?.response?.errors,
            })
          ))
      )
    )
  );

const getUnitsByTermEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_UNITS_BY_TERM),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_units_by_term.method,
        END_POINT.get_units_by_term.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.getUnitsByTermSuccess({
              gradingPeriodList: data?.response?.gradingPeriods,
              isFetchingUnitsList: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.getUnitsByTermFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isFetchingUnitsList: false,
            })
          ))
      )
    )
  );

const createQuizEpic = (action$) =>
  action$.pipe(
    ofType(actions.MC_CREATE_QUIZ),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.create_quiz.method,
        END_POINT.create_quiz.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId
        ),
        {
          metadata: { ...action.payload.quiz },
          linkContents: action.payload.linkContents,
          googleFiles: action.payload.googleFiles,
          attachments: action.payload.attachments
        }
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcCreateQuizSuccess({
              currentQuiz: data.response.quiz,
              createQuizSuccess: true,
            })
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcCreateQuizFailed({
              error: error?.response?.errors,
            })
          )
        )
      )
    )
  );

const getQuizEpic = (action$) =>
  action$.pipe(
    ofType(actions.MC_GET_QUIZ),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_quiz.method,
        END_POINT.get_quiz.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.quizId
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetQuizSuccess({
              currentQuiz: data.response.quiz,
              activityDetails: data.response.quiz,
            })
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcGetQuizFailed({
              error: error?.response?.errors,
              errorCode: error?.response?.code,
            })
          )
        )
      )
    )
  );

const editQuizEpic = (action$) =>
  action$.pipe(
    ofType(actions.MC_EDIT_QUIZ),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_quiz.method,
        END_POINT.edit_quiz.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.quizId
        ),
        {
          metadata: { ...action.payload.quiz },
          linkContents: action.payload.linkContents,
          googleFiles: action.payload.googleFiles,
          attachments: action.payload.attachments

        }
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcEditQuizSuccess({
              editQuizSuccess: true,
              queueUpdate: getQueueUpdate(data?.response?.courseDayIds),
            })
            // myCoursesActions.mcGetQuiz({orgId: action.payload.orgId, courseId: action.payload.courseId, unitId: action.payload.unitId, quizId: action.payload.quizId})
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcEditQuizFailed({
              error: error?.response?.errors,
            })
          )
        )
      )
    )
  );
const deleteQuizEpic = (action$) =>
  action$.pipe(
    ofType(actions.MC_DELETE_QUIZ),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_quiz.method,
        END_POINT.delete_quiz.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.quizId
        )
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.mcDeleteQuizSuccess({ deleteQuizSuccess: true })
          )),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcDeleteQuizFailed({
              error: error?.response?.errors,
            })
          )
        )
      )
    )
  );

const editUnitEpic = (action$) =>
  action$.pipe(
    ofType(actions.EDIT_UNIT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_unit.method,
        END_POINT.edit_unit.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId
        ),
        action.payload.unit
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.editUnitSuccess({
              isEditUnitSuccess: true,
              isEditingUnit: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.editUnitFailed({
              error: error?.response?.errors,
              isEditingUnit: false,
            })
          ))
      )
    )
  );

const deleteLessonEpic = (action$) =>
  action$.pipe(
    ofType(actions.DELETE_LESSON),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_lesson.method,
        END_POINT.delete_lesson.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.lessonId
        )
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.deleteLessonSuccess({
              isDeleteLessonSuccess: true,
              isDeletingLesson: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.deleteLessonFailed({
              error: error?.response?.errors,
              isDeletingLesson: false,
            })
          ))
      )
    )
  );

const deleteUnitEpic = (action$) =>
  action$.pipe(
    ofType(actions.DELETE_UNIT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_unit.method,
        END_POINT.delete_unit.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId
        )
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.deleteUnitSuccess({ deleteUnitSuccess: true }),
            myCoursesActions.getUnitsByTerm({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
              urlParams: {
                termIds: action.payload.termId,
                timezone: action.payload.timezone,
                groupBy: 'gradingPeriod',
              },
            })
          )),
        catchError((error) =>
          of(
            myCoursesActions.deleteUnitFailed({
              error: error?.response?.errors,
            })
          )
        )
      )
    )
  );

const getUnitByCourseEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_UNIT_BY_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_unit_by_course.method,
        END_POINT.mc_get_unit_by_course.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetUnitByCourseSuccess({
              unitList: data?.response?.data,
              mcGetUnitByCourseSuccess: true,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcGetUnitByCourseFailed({
              mcGetUnitByCourseFailed: error?.response?.errors,
            })
          ))
      )
    )
  );

const getCourseItemByUnitEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_COURSE_ITEM_BY_UNIT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_course_item_by_unit.method,
        END_POINT.mc_get_course_item_by_unit.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetCourseItemByUnitSuccess({
              courseItemByUnit: data?.response?.data,
              isFetchingGradingPeriodList: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcGetCourseItemByUnitFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isFetchingGradingPeriodList: false,
            })
          ))
      )
    )
  );

const getCourseDayByGradingPeriodEpic = (action$, state$) => action$.pipe(
    ofType(actions.MC_GET_COURSE_DAY_BY_GRADING_PERIOD),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_course_day_by_grading_period.method,
        END_POINT.mc_get_course_day_by_grading_period.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.gradingPeriodId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetCourseDayByGradingPeriodSuccess({
              courseDaysByGradingPeriod: data?.response?.courseDays,
              isFetchingPlanningData: false,
              currentCourseDayId: state$.value.AllCourses.firstTime
                ? state$.value.AllCourses.currentCourseDayId
                : data?.response?.currentDayId,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcGetCourseDayByGradingPeriodFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isFetchingPlanningData: false,
            })
          ))
      )
    )
  );

const getCourseDayDetailEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_COURSE_DAY_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_course_day_detail.method,
        END_POINT.mc_get_course_day_detail.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.courseDayId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetCourseDayDetailSuccess({
              courseDayDetail: data?.response?.courseDays,
              isFetchingGradingPeriodList: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcGetCourseDayDetailFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              // isFetchingGradingPeriodList: false,
            })
          ))
      )
    )
  );

const updateMasterItemEpic = (action$) => action$.pipe(
    ofType(actions.MC_UPDATE_MASTER_ITEM),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_update_master_item.method,
        END_POINT.mc_update_master_item.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.courseDayId,
          action.payload.urlParams
        ),
        action.payload.activity
      ).pipe(
        mergeMap(() => {
          const updateReducer = myCoursesActions.mcUpdateMasterItemSuccess({
            mcUpdateMasterItemSuccess: true,
            updateData: {
              destinationId: action.payload.courseDayId,
              sourceId: action.payload.sourceId,
            },
          });
          if (!!action.payload.unitId) {
            return of(
              updateReducer,
              myCoursesActions.mcGetCourseItemByUnit({
                orgId: action.payload.orgId,
                courseId: action.payload.courseId,
                unitId: action.payload.unitId,
              })
            );
          }
          return of(updateReducer);
        }),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcUpdateMasterItemFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              // isFetchingGradingPeriodList: false,
            })
          ))
      )
    )
  );

const updateShadowLessonEpic = (action$) => action$.pipe(
    ofType(actions.MC_UPDATE_SHADOW_LESSON),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_update_shadow_lesson.method,
        END_POINT.mc_update_shadow_lesson.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId,
          action.payload.urlParams
        ),
        action.payload.activity
      ).pipe(
        mergeMap(() => {
          const payload = {
            // courseDayDetail: data?.response?.courseDays,
            mcUpdateShadowLessonSuccess: true,
            updateData: {
              destinationId: action.payload.courseDayId,
              sourceId: action.payload.sourceId,
            },
          };
          if (action.payload.isEditingShadowLesson) {
            Object.assign(payload, { isEditingShadowLesson: false });
          }
          return of(myCoursesActions.mcUpdateShadowLessonSuccess(payload));
        }),
        catchError((error) => {
          const payload = {
            error: error?.response?.errors,
            errorCode: error?.status,
          };
          if (action.payload.isInModal) {
            delete payload.error;
            Object.assign(payload, { errorShadow: error?.response?.errors });
          }
          if (action.payload.isEditingShadowLesson) {
            Object.assign(payload, { isEditingShadowLesson: false });
          }
          return of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcUpdateShadowLessonFailed(payload)
          );
        })
      )
    )
  );

const getCourseDayListEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_COURSE_DAY_LIST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_course_day_list.method,
        END_POINT.mc_get_course_day_list.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.sectionId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetCourseDayListSuccess({
              courseDayList: data?.response?.schedules,
              currentDayId: data?.response?.currentDayId,
              isFetchingCourseDayList: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcGetCourseDayListFailed({
              error: error?.response?.errors,
              isFetchingCourseDayList: false,
            })
          ))
      )
    )
  );

const getAllCourseDaysEpic = (action$) => action$.pipe(
    ofType(actions.GET_ALL_COURSE_DAYS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_all_course_days.method,
        END_POINT.get_all_course_days.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.getAllCourseDaysSuccess({
              courseDays: data?.response?.courseDays,
              currentDayId: data?.response?.currentDayId,
              isFetchingCourseDayList: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.getAllCourseDaysFailed({
              error: error?.response?.errors,
              isFetchingCourseDayList: false,
            })
          ))
      )
    )
  );

const getShadowLessonDetailEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_SHADOW_LESSON_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_shadow_lesson_detail.method,
        END_POINT.mc_get_shadow_lesson_detail.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetShadowLessonDetailSuccess({
              shadowLessonDetail: data?.response?.data,
              isFetchingShadowLessonDetail: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.mcGetShadowLessonDetailFailed({
              error: error?.response?.errors,
              isFetchingShadowLessonDetail: false,
            })
          ))
      )
    )
  );

const updateShadowQuizzesEpic = (action$) => action$.pipe(
    ofType(actions.MC_UPDATE_SHADOW_QUIZZES),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_update_shadow_quizzes.method,
        END_POINT.mc_update_shadow_quizzes.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId,
          action.payload.urlParams
        ),
        action.payload.activity
      ).pipe(
        mergeMap(() => {
          const payload = {
            // courseDayDetail: data?.response?.courseDays,
            mcUpdateShadowQuizzesSuccess: true,
            updateData: {
              destinationId: action.payload.courseDayId,
              sourceId: action.payload.sourceId,
            },
          };
          if (action.payload.isEditingShadowQuizzes) {
            Object.assign(payload, { isEditingShadowQuizzes: false });
          }
          return of(myCoursesActions.mcUpdateShadowQuizzesSuccess(payload));
        }),
        catchError((error) => {
          const payload = {
            error: error?.response?.errors,
            errorCode: error?.status,
          };
          if (action.payload.isInModal) {
            delete payload.error;
            Object.assign(payload, { errorShadow: error?.response?.errors });
          }
          if (action.payload.isEditingShadowQuizzes) {
            Object.assign(payload, { isEditingShadowQuizzes: false });
          }
          return of(myCoursesActions.mcUpdateShadowQuizzesFailed(payload));
        })
      )
    )
  );

const getShadowQuizDetailEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_SHADOW_QUIZ_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_shadow_quiz_detail.method,
        END_POINT.mc_get_shadow_quiz_detail.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetShadowQuizDetailSuccess({
              shadowQuizDetail: data?.response?.data,
              isFetchingShadowQuizDetail: false,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcGetShadowQuizDetailFailed({
              error: error?.response?.errors,
              isFetchingShadowQuizDetail: false,
            })
          ))
      )
    )
  );

const updateShadowAssignmentsEpic = (action$) => action$.pipe(
    ofType(actions.MC_UPDATE_SHADOW_ASSIGNMENTS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_update_shadow_assignments.method,
        END_POINT.mc_update_shadow_assignments.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId,
          action.payload.urlParams
        ),
        action.payload.activity
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.mcUpdateShadowAssignmentsSuccess({
              // courseDayDetail: data?.response?.courseDays,
              mcUpdateShadowAssignmentsSuccess: true,
              updateData: {
                destinationId: action.payload.courseDayId,
                sourceId: action.payload.sourceId,
              },
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcUpdateShadowAssignmentsFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              // isFetchingGradingPeriodList: false,
            })
          ))
      )
    )
  );

// Student
const getCourseContentEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_COURSE_CONTENT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_course_content.method,
        END_POINT.mc_get_course_content.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetCourseContentSuccess({
              mcGetCourseContentSuccess: true,
              courseContent: data?.response,
              error: null,
              errGetCourseContent: null,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcGetCourseContentFailed({
              errGetCourseContent: error?.response?.errors,
              error: error?.response?.errors,
            })
          ))
      )
    )
  );

const getLessonDetailsEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_LESSON_DETAILS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_lesson_details.method,
        END_POINT.mc_get_lesson_details.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetActivityDetailsSuccess({
              mcGetActivityDetailsSuccess: true,
              activityDetails: data?.response?.lesson,
              isFetchingLessonDetails: false,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcGetActivityDetailsFailed({
              error: error?.response?.errors,
              isFetchingLessonDetails: false,
              errorCode: error?.response?.code,
            })
          ))
      )
    )
  );

const getQuizDetailsEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_QUIZ_DETAILS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_quiz_details.method,
        END_POINT.mc_get_quiz_details.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.shadowId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetActivityDetailsSuccess({
              mcGetActivityDetailsSuccess: true,
              activityDetails: data?.response?.detail,
              studentGetShadowQuizError: null,
              studentGetShadowAssignmentError: null,
              isFetchingQuizDetails: false,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcGetActivityDetailsFailed({
              error: error?.response?.errors,
              studentGetShadowQuizError: error?.response,
              activityDetails: error?.response?.detail,
              errorCode: error?.response?.code,
              isFetchingQuizDetails: false,
            })
          ))
      )
    )
  );

const getAssignmentStudentSubmissionEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_ASSIGNMENT_STUDENT_SUBMISSION),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_assignment_student_submission.method,
        END_POINT.mc_get_assignment_student_submission.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.assignmentId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetAssignmentStudentSubmissionSuccess({
              mcGetAssignmentStudentSubmissionSuccess: true,
              assignmentStudentSubmission: data?.response,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcGetAssignmentStudentSubmissionFailed({
              error: error?.response?.errors,
            })
          ))
      )
    )
  );

const getActivitiesByUnitEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_ACTIVITIES_BY_UNIT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_activities_by_unit.method,
        END_POINT.mc_get_activities_by_unit.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetActivitiesByUnitSuccess({
              mcGetActivitiesByUnitSuccess: true,
              activitiesByUnit: data?.response,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcGetActivitiesByUnitFailed({
              error: error?.response?.errors,
            })
          ))
      )
    )
  );

// Publish shadow lessons, assignments, quizzes at the master level
const getShadowItemValidationsEpic = (action$) => action$.pipe(
    ofType(actions.MC_GET_SHADOW_ITEM_VALIDATIONS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_shadow_item_validations.method,
        END_POINT.mc_get_shadow_item_validations.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.courseItemType,
          action.payload.masterId
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcGetShadowItemValidationsSuccess({
              shadowItemValidations: data?.response?.result,
              isFetchingShadowItemValidations: false,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcGetShadowItemValidationsFailed({
              error: error?.response?.errors,
              isFetchingShadowItemValidations: false,
            })
          ))
      )
    )
  );

const changeShadowItemsStatusAtMasterLevelEpic = (action$) => action$.pipe(
    ofType(actions.MC_CHANGE_SHADOW_ITEMS_STATUS_AT_MASTER_LEVEL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_change_shadow_items_status_at_master_level.method,
        END_POINT.mc_change_shadow_items_status_at_master_level.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.courseItemType,
          action.payload.masterId
        ),
        action.payload.data
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.mcChangeShadowItemsStatusAtMasterLevelSuccess({
              mcChangeShadowItemsStatusAtMasterLevelSuccess: true,
              isChangingShadowItemsStatusAtMasterLevel: false,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcChangeShadowItemsStatusAtMasterLevelFailed({
              error: error?.response?.errors,
              isChangingShadowItemsStatusAtMasterLevel: false,
            })
          ))
      )
    )
  );

const consolidateAssignmentEpic = (action$) => action$.pipe(
    ofType(actions.MC_CONSOLIDATE_ASSIGNMENT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_consolidate_assignment.method,
        END_POINT.mc_consolidate_assignment.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.masterId
        ),
        action.payload.body
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.mcConsolidateAssignmentSuccess({
              mcConsolidateAssignmentSuccess: true,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcConsolidateAssignmentFailed({
              mcConsolidateAssignmentFailed: error?.response?.errors,
            })
          ))
      )
    )
  );

const consolidateQuizEpic = (action$) => action$.pipe(
    ofType(actions.MC_CONSOLIDATE_QUIZ),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_consolidate_quiz.method,
        END_POINT.mc_consolidate_quiz.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.masterId
        ),
        action.payload.body
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.mcConsolidateQuizSuccess({
              mcConsolidateQuizSuccess: true,
              nonGeneratedSections: data?.response?.nonGeneratedSections,
            })
          )),
        catchError((error) => of(
            myCoursesActions.mcConsolidateQuizFailed({
              mcConsolidateQuizFailed: error?.response?.errors,
            })
          ))
      )
    )
  );

const relinkShadowItem = (action$) => action$.pipe(
    ofType(actions.RELINK_SHADOW_ITEM),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.relink_shadow_item.method,
        END_POINT.relink_shadow_item.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.type,
          action.payload.shadowId
        ),
        action.payload.data
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.relinkShadowItemSuccess({
              relinkShadowItemSuccess: true,
              isRelinkingShadowItem: false,
            })
          )),
        catchError((error) => of(
            myCoursesActions.relinkShadowItemFailed({
              error: error?.response?.errors,
              isRelinkingShadowItem: false,
            })
          ))
      )
    )
  );

const getSectionDetail = (action$) => action$.pipe(
    ofType(actions.GET_SECTION_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_section_detail.method,
        END_POINT.get_section_detail.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.courseDayId,
          action.payload.sectionId,
          action.payload.urlParams
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.getSectionDetailSuccess({
              sectionDetail: data.response,
            })
          )),
        catchError((error) => of(
            myCoursesActions.getSectionDetailFailed({
              error: error?.response?.errors,
            })
          ))
      )
    )
  );

const getReleaseListStudentSubmissionEpic = (action$) => action$.pipe(
    ofType(actions.GET_RELEASE_LIST_STUDENT_SUBMISSION),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.mc_get_assignment_student_submission.method,
        END_POINT.mc_get_assignment_student_submission.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.assignmentId,
          action.payload.urlParams
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.getReleaseListStudentSubmissionSuccess({
              releaseListStudentSubmission: data.response.data,
              currentTermId: data.response.currentTermId,
            })
          )),
        catchError((error) => of(
            myCoursesActions.getReleaseListStudentSubmissionFailed({
              error: error?.response?.errors,
            })
          ))
      )
    )
  );

const releaseGradeStudentSubmissionEpic = (action$) => action$.pipe(
    ofType(actions.RELEASE_GRADE_STUDENT_SUBMISSION),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.release_grade_student_submission.method,
        END_POINT.release_grade_student_submission.url(action.payload.courseId),
        {
          listAssignmentSubmissionIds:
            action.payload.listAssignmentSubmissionIds,
          listQuizSubmissionIds: action.payload.listQuizSubmissionIds,
          listParticipationIds: action.payload.listParticipationIds,
        }
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.releaseGradeStudentSubmissionSuccess({
              releaseGradeStudentSubmissionSuccess: true,
            }),
            myCoursesActions.calculatePublicOverallCourseGrade({
              courseId: action.payload.courseId,
              termId: action.payload.currentTermId,
              listStudentId: action.payload.selectedPublicStudentIds,
            })
          )),
        catchError((error) => of(
            myCoursesActions.releaseGradeStudentSubmissionFailed({
              error: error?.response?.errors,
            })
          ))
      )
    )
  );

const calculatePublicOverallCourseGradeEpic = (action$) => action$.pipe(
    ofType(actions.CALCULATE_PUBLIC_OVERALL_COURSE_GRADE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.calculate_public_overall_course_grade.method,
        END_POINT.calculate_public_overall_course_grade.url(
          action.payload.courseId,
          action.payload.termId
        ),
        {
          listStudentId: action.payload.listStudentId,
        }
      ).pipe(
        mergeMap(() => of(
            myCoursesActions.releaseGradeStudentSubmissionSuccess({
              calculatePublicOverallCourseGradeSuccess: true,
            })
          )),
        catchError((error) => of(
            myCoursesActions.releaseGradeStudentSubmissionFailed({
              error: error?.response?.errors,
            })
          ))
      )
    )
  );
  const checkTeacherGoogleConnectEpic = (action$) =>
  action$.pipe(
    ofType(actions.CHECK_TEACHER_GOOGLE_CONNECT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.check_teacher_google_connect.method,
        END_POINT.check_teacher_google_connect.url(
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => of( myCoursesActions.checkTeacherGoogleConnectSuccess({
              teacherGoogleConnect: data.response.data.isConnected,
            }))),
        catchError(() => of(
            myCoursesActions.checkTeacherGoogleConnectFailed({
              teacherGoogleConnect: false
            })
          ))
      )
    )
  );

export default [
  getAssignmentDetailEpic,
  createNewAssignmentEpic,
  editAssignmentEpic,
  deleteAssignmentEpic,
  getShadowAssignmentDetailEpic,
  editShadowAssignmentEpic,

  getMyCoursesListEpic,
  getSyllabusEpic,
  updateSyllabusEpic,
  // getGradeWeightEpic,
  // updateGradWeightEpic,
  createNewUnitEpic,
  getTermsListByCourseEpic,
  getLinkedContentsEpic,
  getUnitByCourseEpic,
  getCoursePermissionEpic,
  createQuizEpic,

  editUnitEpic,
  deleteLessonEpic,
  getQuizEpic,
  editQuizEpic,
  deleteQuizEpic,
  deleteUnitEpic,
  getCourseDayListEpic,
  getAllCourseDaysEpic,
  getShadowLessonDetailEpic,
  getShadowQuizDetailEpic,

  // Planning Tab
  getUnitsByTermEpic,
  getCourseItemByUnitEpic,
  getCourseDayByGradingPeriodEpic,
  getCourseDayDetailEpic,
  updateMasterItemEpic,
  updateShadowLessonEpic,
  updateShadowQuizzesEpic,
  updateShadowAssignmentsEpic,

  // Student
  getCourseContentEpic,
  getLessonDetailsEpic,
  studentViewShadowAssignmentEpic,
  studentEditShadowAssignmentEpic,
  getQuizDetailsEpic,
  getAssignmentStudentSubmissionEpic,
  getActivitiesByUnitEpic,
  checkTeacherGoogleConnectEpic,
  // getGraderDetailEpic,

  // Publish shadow lessons, assignments, quizzes at the master level
  getShadowItemValidationsEpic,
  changeShadowItemsStatusAtMasterLevelEpic,
  consolidateAssignmentEpic,
  consolidateQuizEpic,

  relinkShadowItem,
  getSectionDetail,
  getReleaseListStudentSubmissionEpic,
  releaseGradeStudentSubmissionEpic,
  calculatePublicOverallCourseGradeEpic,
  ...gradeWeightingEpics,
  ...gradeBookEpics,
];
