import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import allCoursesActions from './actions';
import { END_POINT, actions } from './constants';

const getAllCoursesListEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_ALL_COURSES_LIST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_all_courses_list.method,
        END_POINT.get_all_courses_list.url(
          action.payload.id,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            allCoursesActions.getAllCoursesListSuccess({
              allCoursesList: data?.response?.courses,
              isBusy: false,
              total: data?.response?.total,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error: error.response } },
            allCoursesActions.getAllCoursesListFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isBusy: false,
            })
          ))
      )
    )
  );
const createDraftCourseEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_DRAFT_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.create_draft_course.method,
        END_POINT.create_draft_course.url(action.payload.orgId),
        action.payload.params
      ).pipe(
        mergeMap((data) => {
          if (data?.response?.errors) {
            return allCoursesActions.createDraftCourseFailed({
              error: data?.response?.errors,
              isBusy: false,
            });
          }
          return of(
            allCoursesActions.createDraftCourseSuccess({
              isBusy: false,
              isCreatingCourse: false,
              createDraftCourseSuccess: data?.response,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.createDraftCourseFailed({
              error: error?.response?.errors,
              errorCode: error.status,
              isCreatingCourse: false,
            })
          ))
      )
    )
  );
const deleteDraftCourseEpic = (action$, state$) => action$.pipe(
    ofType(actions.DELETE_DRAFT_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_draft_course.method,
        END_POINT.delete_draft_course.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap(() => {
          const allCoursesList = state$.value.AllCourses.allCoursesList.filter(
            (course) => course.id !== parseInt(action.payload.courseId)
          );
          return of(
            allCoursesActions.deleteDraftCourseSuccess({
              allCoursesList,
              deletingDraftCourse: false,
              deleteDraftCourseSuccess: true,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.deleteDraftCourseFailed({
              error: error?.response?.errors,
              errorCode: error.status,
              deletingDraftCourse: false,
            })
          ))
      )
    )
  );

const getBasicInfoEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_BASIC_INFO),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_basic_info.method,
        END_POINT.get_basic_info.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.getBasicInfoFailed({
              getBasicInfoFailed: data.response.errors,
              errorCode: data?.error?.status,
            });
          }
          return of(
            allCoursesActions.getBasicInfoSuccess({
              basicInfo: data?.response?.basicInfo,
              getBasicInfoSuccess: true,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.getBasicInfoFailed({
              getBasicInfoFailed: error?.response?.errors,
              errorCode: error?.status,
            })
          ))
      )
    )
  );

const updateBasicInfoEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_BASIC_INFO),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.update_basic_info.method,
        END_POINT.update_basic_info.url(
          action.payload.orgId,
          action.payload.courseId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.updateBasicInfoFailed({
              updateBasicInfoFailed: data?.response?.errors,
              errorCode: data?.error?.status,
            });
          }
          return of(
            allCoursesActions.updateBasicInfoSuccess({
              updateBasicInfoSuccess: true,
            }),
            allCoursesActions.getBasicInfo({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            }),
            allCoursesActions.getCourseValidation({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.updateBasicInfoFailed({
              updateBasicInfoFailed: error?.response?.errors,
              errorCode: error?.status,
            })
          ))
      )
    )
  );

const getTeachersEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_TEACHERS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_teachers.method,
        END_POINT.get_teachers.url(action.payload.id)
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.getTeachersFailed({
              error: data.response.errors,
              isBusyGetTeachers: false,
            });
          }
          return of(
            allCoursesActions.getTeachersSuccess({
              teachers: data?.response?.teachers,
              isBusyGetTeachers: false,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.getTeachersFailed({
              error: error.response.errors,
              errorCode: error.status,
              isBusyGetTeachers: false,
            })
          ))
      )
    )
  );

const getStudentsEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_STUDENTS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_students.method,
        END_POINT.get_students.url(action.payload.id)
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.getStudentsFailed({
              error: data.response.errors,
              isBusyGetStudents: false,
            });
          }
          return of(
            allCoursesActions.getStudentsSuccess({
              students: data?.response?.students,
              isBusyGetStudents: false,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.getStudentsFailed({
              error: error.response.errors,
              errorCode: error.status,
              isBusyGetStudents: false,
            })
          ))
      )
    )
  );

const getSectionsAndMeetingTimesEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SECTIONS_AND_MEETING_TIMES),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_sections_and_meeting_times.method,
        END_POINT.get_sections_and_meeting_times.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.studentId
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.getSectionsAndMeetingTimesFailed({
              getSectionsAndMeetingTimesFailed: data?.response?.errors,
            });
          }
          return of(
            allCoursesActions.getSectionsAndMeetingTimesSuccess({
              sectionsAndMeetingTimes: data?.response?.section,
              getSectionsAndMeetingTimesSuccess: true,
              isUpdatingSectionsAndMeetingTimes: false,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.getSectionsAndMeetingTimesFailed({
              getSectionsAndMeetingTimesFailed: error?.response?.errors,
              errorCode: error?.status,
            })
          ))
      )
    )
  );

const getTeacherOfCourseEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_TEACHER_OF_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_course_info.method,
        END_POINT.get_course_info.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.getTeacherOfCourseFailed({
              error: data.response.errors,
              isBusyGetTeacherOfCourse: false,
            });
          }
          return of(
            allCoursesActions.getTeacherOfCourseSuccess({
              primaryTeacher: data?.response?.teacher,
              assistantTeachers: data?.response?.teachingAssistants,
              isBusyGetTeacherOfCourse: false,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.getTeacherOfCourseFailed({
              error: error.response.errors,
              errorCode: error.status,
              isBusyGetTeacherOfCourse: false,
            })
          ))
      )
    )
  );

const getSectionsOfCourseEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SECTIONS_OF_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_sections_of_course.method,
        END_POINT.get_sections_of_course.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.getSectionsOfCourseFailed({
              error: data.response.errors,
              isBusyGetSectionsOfCourse: false,
            });
          }
          return of(
            allCoursesActions.getSectionsOfCourseSuccess({
              sectionsInCourse: data?.response?.sections,
              // assistantTeachers: data?.response?.teachingAssistants,
              isBusyGetSectionsOfCourse: false,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.getSectionsOfCourseFailed({
              error: error.response.errors,
              errorCode: error.status,
              isBusyGetSectionsOfCourse: false,
            })
          ))
      )
    )
  );

const getStudentsOfCourseEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_STUDENTS_OF_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_course_info.method,
        END_POINT.get_course_info.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.getStudentsOfCourseFailed({
              error: data.response.errors,
              isBusyGetStudentsOfCourse: false,
            });
          }
          return of(
            allCoursesActions.getStudentsOfCourseSuccess({
              studentsInSections: data?.response?.student,
              // assistantTeachers: data?.response?.teachingAssistants,
              isBusyGetStudentsOfCourse: false,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.getStudentsOfCourseFailed({
              error: error.response.errors,
              errorCode: error.status,
              isBusyGetStudentsOfCourse: false,
            })
          ))
      )
    )
  );

const getStudentsInSectionOfCourseEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_STUDENTS_IN_SECTION_OF_COURSE),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.get_students_in_section_of_course.method,
        END_POINT.get_students_in_section_of_course.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.sectionId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.getStudentsInSectionOfCourseFailed({
              error: data?.response?.errors,
              isBusyGetStudentsInSectionOfCourse: false,
            });
          }
          return of(
            allCoursesActions.getStudentsInSectionOfCourseSuccess({
              studentInSectionInCourse: data?.response?.students,
              sectionId: action.payload.sectionId,

              // assistantTeachers: data?.response?.teachingAssistants,
              isBusyGetStudentsInSectionOfCourse: false,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.getStudentsInSectionOfCourseFailed({
              error: error?.response?.errors,
              errorCode: error?.status,
              isBusyGetStudentsInSectionOfCourse: false,
            })
          ))
      )
    )
  );

const updateTeacherInfoEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_TEACHERS_IN_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.update_course_info.method,
        END_POINT.update_course_info.url(
          action.payload.orgId,
          action.payload.courseId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.updateCourseInfoFailed({
              updateTeacherInfoFailed: data.response.errors,
              isBusy: false,
            });
          }
          return of(
            allCoursesActions.updateCourseInfoSuccess({
              updateTeacherInfoSuccess: true,
              isBusy: false,
            }),
            allCoursesActions.getCourseValidation({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            })
            // allCoursesActions.getCourseValidation({
            //   orgId: action.payload.orgId, courseId: action.payload.courseId
            // })
          );
        }),
        catchError((error) => of(
            allCoursesActions.updateCourseInfoFailed({
              updateTeacherInfoFailed: error.response.errors,
              errorCode: error.status,
            })
          ))
      )
    )
  );

const updateStudentsInfoEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_STUDENTS_IN_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.update_course_info.method,
        END_POINT.update_course_info.url(
          action.payload.orgId,
          action.payload.courseId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.updateCourseInfoFailed({
              updateStudentsInfoFailed: data.response.errors,
              isBusy: false,
            });
          }
          return of(
            allCoursesActions.updateCourseInfoSuccess({
              updateStudentsInfoSuccess: true,
              sectionId: action.payload.data.student.sectionId,
              isBusy: false,
            }),
            allCoursesActions.getCourseValidation({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.updateCourseInfoFailed({
              updateTeacherInfoFailed: error.response.errors,
              errorCode: error.status,
              isBusy: false,
            })
          ))
      )
    )
  );

const updateSectionsAndMeetingTimesEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_SECTIONS_AND_MEETING_TIMES),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.update_sections_and_meeting_times.method,
        END_POINT.update_sections_and_meeting_times.url(
          action.payload.orgId,
          action.payload.courseId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.updateSectionsAndMeetingTimesFailed({
              updateSectionsAndMeetingTimesFailed: data?.response?.errors,
              isUpdatingSectionsAndMeetingTimes: false,
            });
          }
          return of(
            allCoursesActions.updateSectionsAndMeetingTimesSuccess({
              isUpdatingSectionsAndMeetingTimes: false,
              updateSectionsAndMeetingTimesSuccess: true,
            }),
            allCoursesActions.getSectionsAndMeetingTimes({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
              isUpdatingSectionsAndMeetingTimes: true,
            }),
            allCoursesActions.getCourseValidation({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.updateSectionsAndMeetingTimesFailed({
              updateSectionsAndMeetingTimesFailed: {
                ...error?.response?.errors,
                sectionId: action?.payload?.data?.section?.id,
              },
              errorCode: error?.status,
              isUpdatingSectionsAndMeetingTimes: false,
            })
          ))
      )
    )
  );

const getCourseValidationEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_COURSE_VALIDATION),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_course_validation.method,
        END_POINT.get_course_validation.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => of(
            allCoursesActions.getCourseValidationSuccess({
              courseValidation: data.response.validation,
              courseStatus: data.response.status,
            })
          ))
      )
    )
  );
const deleteSectionEpic = (action$) =>
  action$.pipe(
    ofType(actions.DELETE_SECTION),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_section.method,
        END_POINT.delete_section.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.sectionId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return allCoursesActions.deleteSectionFailed({
              deleteSectionFailed: data?.response?.errors,
            });
          }
          return of(
            allCoursesActions.deleteSectionSuccess({
              deleteSectionSuccess: true,
            }),
            allCoursesActions.getSectionsAndMeetingTimes({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            }),
            allCoursesActions.getCourseValidation({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            })
          );
        }),
        catchError((error) => of(
            allCoursesActions.deleteSectionFailed({
              deleteSectionFailed: error?.response?.errors,
              errorCode: error?.status,
            })
          ))
      )
    )
  );
const getAssessmentMethodInCourseEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_ASSESSMENT_METHOD_IN_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_assessment_method_in_course.method,
        END_POINT.get_assessment_method_in_course.url(
          action.payload.orgId,
          action.payload.courseId
        )
      ).pipe(
        mergeMap((data) => of(
            allCoursesActions.getAssessmentMethodInCourseSuccess({
              assessmentMethod: data?.response?.assessmentMethod,
              isGetAssessmentMethodInCourseSuccess: true,
            })
          )),
        catchError((error) => of(
            allCoursesActions.getAssessmentMethodInCourseFailed({
              getAssessmentMethodInCourseFailed: error?.response?.errors,
            })
          ))
      )
    )
  );

const updateAssessmentMethodInCourseEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_ASSESSMENT_METHOD_IN_COURSE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.update_assessment_method_in_course.method,
        END_POINT.update_assessment_method_in_course.url(
          action.payload.orgId,
          action.payload.courseId
        ),
        action.payload.data
      ).pipe(
        mergeMap(() => of(
            allCoursesActions.updateAssessmentMethodInCourseSuccess({
              isUpdateAssessmentMethodInCourseSuccess: true,
            }),
            allCoursesActions.getCourseValidation({
              orgId: action.payload.orgId,
              courseId: action.payload.courseId,
            })
          )),
        catchError((error) => of(
            allCoursesActions.updateAssessmentMethodInCourseFailed({
              updateAssessmentMethodInCourseFailed: error?.response?.errors,
            })
          ))
      )
    )
  );

const saveAsTemplateEpic = (action$) =>
  action$.pipe(
    ofType(actions.SAVE_AS_TEMPLATE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.save_as_template.method,
        END_POINT.save_as_template.url(action.payload.organizationId),
        action.payload.data
      ).pipe(
        mergeMap((data) => of(allCoursesActions.saveAsTemplateSuccess({
            canFetching: true,
            templateDetail: data.response.data,
          }))),
        catchError(() => of(allCoursesActions.saveAsTemplateFailed({})))
      )
    )
  );

export default [
  getAllCoursesListEpic,
  getBasicInfoEpic,
  updateBasicInfoEpic,
  getTeachersEpic,
  getStudentsEpic,
  getTeacherOfCourseEpic,
  getSectionsOfCourseEpic,
  getStudentsOfCourseEpic,
  getStudentsInSectionOfCourseEpic,
  updateTeacherInfoEpic,
  updateStudentsInfoEpic,
  createDraftCourseEpic,
  deleteDraftCourseEpic,
  getSectionsAndMeetingTimesEpic,
  updateSectionsAndMeetingTimesEpic,
  getAssessmentMethodInCourseEpic,
  updateAssessmentMethodInCourseEpic,
  getCourseValidationEpic,
  deleteSectionEpic,
  saveAsTemplateEpic,
];
