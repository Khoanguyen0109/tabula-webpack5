import {
  actions as allCourseActions,
  END_POINT as allCourseEndPoint,
} from 'shared/AllCourses/constants';
import {
  actions as lessonActions,
  END_POINT as lessonEndPoint,
} from 'shared/Lesson/constants';

import { objectToParams } from 'utils';

import gradeBookActions from './actionConstants/gradeBookActions';
import gradeWeightingActions from './actionConstants/gradeWeightingActions';
import gradeBookEndPoint from './endPoints/gradeBookEnPoints';
export const actions = {
  ...allCourseActions,
  ...gradeWeightingActions,
  ...gradeBookActions,
  MY_COURSES_SET_STATE: 'MY_COURSES_SET_STATE',

  GET_MY_COURSES_LIST: 'GET_MY_COURSES_LIST',
  GET_MY_COURSES_LIST_SUCCESS: 'GET_MY_COURSES_LIST_SUCCESS',
  GET_MY_COURSES_LIST_FAILED: 'GET_MY_COURSES_LIST_FAILED',

  GET_LINKED_CONTENTS: 'GET_LINKED_CONTENTS',
  GET_LINKED_CONTENTS_SUCCESS: 'GET_LINKED_CONTENTS_SUCCESS',
  GET_LINKED_CONTENTS_FAILED: 'GET_LINKED_CONTENTS_FAILED',

  MC_GET_COURSE_DETAIL: 'GET_COURSE_DETAIL',
  MC_GET_COURSE_DETAIL_SUCCESS: 'GET_COURSE_DETAIL_SUCCESS',
  MC_GET_COURSE_DETAIL_FAILED: 'GET_COURSE_DETAIL_FAILED',

  CREATE_NEW_UNIT: 'CREATE_NEW_UNIT',
  CREATE_NEW_UNIT_SUCCESS: 'CREATE_NEW_UNIT_SUCCESS',
  CREATE_NEW_UNIT_FAILED: 'CREATE_NEW_UNIT_FAILED',

  CREATE_NEW_ASSIGNMENT: 'CREATE_NEW_ASSIGNMENT',
  CREATE_NEW_ASSIGNMENT_SUCCESS: 'CREATE_NEW_ASSIGNMENT_SUCCESS',
  CREATE_NEW_ASSIGNMENT_FAILED: 'CREATE_NEW_ASSIGNMENT_FAILED',

  EDIT_ASSIGNMENT: 'EDIT_ASSIGNMENT',
  EDIT_ASSIGNMENT_SUCCESS: 'EDIT_ASSIGNMENT_SUCCESS',
  EDIT_ASSIGNMENT_FAILED: 'EDIT_ASSIGNMENT_FAILED',

  DELETE_ASSIGNMENT: 'DELETE_ASSIGNMENT',
  DELETE_ASSIGNMENT_SUCCESS: 'DELETE_ASSIGNMENT_SUCCESS',
  DELETE_ASSIGNMENT_FAILED: 'DELETE_ASSIGNMENT_FAILED',

  GET_ASSIGNMENT_DETAIL: 'GET_ASSIGNMENT_DETAIL',
  GET_ASSIGNMENT_DETAIL_SUCCESS: 'GET_ASSIGNMENT_DETAIL_SUCCESS',
  GET_ASSIGNMENT_DETAIL_FAILED: 'GET_ASSIGNMENT_DETAIL_FAILED',

  GET_SHADOW_ASSIGNMENT_DETAIL: 'GET_SHADOW_ASSIGNMENT_DETAIL',
  GET_SHADOW_ASSIGNMENT_DETAIL_SUCCESS: 'GET_SHADOW_ASSIGNMENT_DETAIL_SUCCESS',
  GET_SHADOW_ASSIGNMENT_DETAIL_FAILED: 'GET_SHADOW_ASSIGNMENT_DETAIL_FAILED',

  EDIT_SHADOW_ASSIGNMENT: 'EDIT_SHADOW_ASSIGNMENT',
  EDIT_SHADOW_ASSIGNMENT_SUCCESS: 'EDIT_SHADOW_ASSIGNMENT_SUCCESS',
  EDIT_SHADOW_ASSIGNMENT_FAILED: 'EDIT_SHADOW_ASSIGNMENT_FAILED',

  GET_TERMS_LIST_BY_COURSE: 'GET_TERMS_LIST_BY_COURSE',
  GET_TERMS_LIST_BY_COURSE_SUCCESS: 'GET_TERMS_LIST_BY_COURSE_SUCCESS',
  GET_TERMS_LIST_BY_COURSE_FAILED: 'GET_TERMS_LIST_BY_COURSE_FAILED',

  GET_UNITS_BY_TERM: 'GET_UNITS_BY_TERM',
  GET_UNITS_BY_TERM_SUCCESS: 'GET_UNITS_BY_TERM_SUCCESS',
  GET_UNITS_BY_TERM_FAILED: 'GET_UNITS_BY_TERM_FAILED',

  MC_GET_SYLLABUS: 'MC_GET_SYLLABUS',
  MC_GET_SYLLABUS_SUCCESS: 'MC_GET_SYLLABUS_SUCCESS',
  MC_GET_SYLLABUS_FAILED: 'MC_GET_SYLLABUS_FAILED',
  MC_UPDATE_SYLLABUS: 'MC_UPDATE_SYLLABUS',
  MC_UPDATE_SYLLABUS_SUCCESS: 'MC_UPDATE_SYLLABUS_SUCCESS',
  MC_UPDATE_SYLLABUS_FAILED: 'MC_UPDATE_SYLLABUS_FAILED',
  MC_GET_PERMISSION_COURSE: 'MC_GET_PERMISSION_COURSE',
  MC_GET_PERMISSION_COURSE_SUCCESS: 'MC_GET_PERMISSION_COURSE_SUCCESS',
  MC_GET_PERMISSION_COURSE_FAILED: 'MC_GET_PERMISSION_COURSE_FAILED',

  MC_GET_UNIT_BY_COURSE: 'MC_GET_UNIT_BY_COURSE',
  MC_GET_UNIT_BY_COURSE_SUCCESS: 'MC_GET_UNIT_BY_COURSE_SUCCESS',
  MC_GET_UNIT_BY_COURSE_FAILED: 'MC_GET_UNIT_BY_COURSE_FAILED',

  MC_GET_COURSE_ITEM_BY_UNIT: 'MC_GET_COURSE_ITEM_BY_UNIT',
  MC_GET_COURSE_ITEM_BY_UNIT_SUCCESS: 'MC_GET_COURSE_ITEM_BY_UNIT_SUCCESS',
  MC_GET_COURSE_ITEM_BY_UNIT_FAILED: 'MC_GET_COURSE_ITEM_BY_UNIT_FAILED',

  EDIT_UNIT: 'EDIT_UNIT',
  EDIT_UNIT_SUCCESS: 'EDIT_UNIT_SUCCESS',
  EDIT_UNIT_FAILED: 'EDIT_UNIT_FAILED',
  MC_CREATE_QUIZ: 'MC_CREATE_QUIZ',
  MC_CREATE_QUIZ_SUCCESS: 'MC_CREATE_QUIZ_SUCCESS',
  MC_CREATE_QUIZ_FAILED: 'MC_CREATE_QUIZ_FAILED',

  MC_EDIT_QUIZ: 'MC_EDIT_QUIZ',
  MC_EDIT_QUIZ_SUCCESS: 'MC_EDIT_QUIZ_SUCCESS',
  MC_EDIT_QUIZ_FAILED: 'MC_EDIT_QUIZ_FAILED',
  MC_GET_QUIZ: 'MC_GET_QUIZ',
  MC_GET_QUIZ_SUCCESS: 'MC_GET_QUIZ_SUCCESS',
  MC_GET_QUIZ_FAILED: 'MC_GET_QUIZ_FAILED',

  MC_DELETE_QUIZ: 'MC_DELETE_QUIZ',
  MC_DELETE_QUIZ_SUCCESS: 'MC_DELETE_QUIZ_SUCCESS',
  MC_DELETE_QUIZ_FAILED: 'MC_DELETE_QUIZ_FAILED',

  DELETE_UNIT: 'DELETE_UNIT',
  DELETE_UNIT_SUCCESS: 'DELETE_UNIT_SUCCESS',
  DELETE_UNIT_FAILED: 'DELETE_UNIT_FAILED',

  DELETE_LESSON: 'DELETE_LESSON',
  DELETE_LESSON_SUCCESS: 'DELETE_LESSON_SUCCESS',
  DELETE_LESSON_FAILED: 'DELETE_LESSON_FAILED',

  MC_GET_COURSE_DAY_BY_GRADING_PERIOD: 'MC_GET_COURSE_DAY_BY_GRADING_PERIOD',
  MC_GET_COURSE_DAY_BY_GRADING_PERIOD_SUCCESS:
    'MC_GET_COURSE_DAY_BY_GRADING_PERIOD_SUCCESS',
  MC_GET_COURSE_DAY_BY_GRADING_PERIOD_FAILED:
    'MC_GET_COURSE_DAY_BY_GRADING_PERIOD_FAILED',

  MC_GET_COURSE_DAY_DETAIL: 'MC_GET_COURSE_DAY_DETAIL',
  MC_GET_COURSE_DAY_DETAIL_SUCCESS: 'MC_GET_COURSE_DAY_DETAIL_SUCCESS',
  MC_GET_COURSE_DAY_DETAIL_FAILED: 'MC_GET_COURSE_DAY_BY_GRADING_PERIOD_FAILED',

  MC_GET_COURSE_DAY_LIST: 'MC_GET_COURSE_DAY_LIST',
  MC_GET_COURSE_DAY_LIST_SUCCESS: 'MC_GET_COURSE_DAY_LIST_SUCCESS',
  MC_GET_COURSE_DAY_LIST_FAILED: 'MC_GET_COURSE_DAY_LIST_FAILED',

  GET_ALL_COURSE_DAYS: 'GET_ALL_COURSE_DAYS',
  GET_ALL_COURSE_DAYS_SUCCESS: 'GET_ALL_COURSE_DAYS_SUCCESS',
  GET_ALL_COURSE_DAYS_FAILED: 'GET_ALL_COURSE_DAYS_FAILED',

  MC_GET_SHADOW_LESSON_DETAIL: 'MC_GET_SHADOW_LESSON_DETAIL',
  MC_GET_SHADOW_LESSON_DETAIL_SUCCESS: 'MC_GET_SHADOW_LESSON_DETAIL_SUCCESS',
  MC_GET_SHADOW_LESSON_DETAIL_FAILED: 'MC_GET_SHADOW_LESSON_DETAIL_FAILED',

  MC_UPDATE_MASTER_ITEM: 'MC_UPDATE_MASTER_ITEM',
  MC_UPDATE_MASTER_ITEM_SUCCESS: 'MC_UPDATE_MASTER_ITEM_SUCCESS',
  MC_UPDATE_MASTER_ITEM_FAILED: 'MC_UPDATE_MASTER_ITEM_FAILED',

  MC_UPDATE_SHADOW_LESSON: 'MC_UPDATE_SHADOW_LESSON',
  MC_UPDATE_SHADOW_LESSON_SUCCESS: 'MC_UPDATE_SHADOW_LESSON_SUCCESS',
  MC_UPDATE_SHADOW_LESSON_FAILED: 'MC_UPDATE_SHADOW_LESSON_FAILED',

  MC_UPDATE_SHADOW_QUIZZES: 'MC_UPDATE_SHADOW_QUIZZES',
  MC_UPDATE_SHADOW_QUIZZES_SUCCESS: 'MC_UPDATE_SHADOW_QUIZZES_SUCCESS',
  MC_UPDATE_SHADOW_QUIZZES_FAILED: 'MC_UPDATE_SHADOW_QUIZZES_FAILED',

  MC_GET_SHADOW_QUIZ_DETAIL: 'MC_GET_SHADOW_QUIZ_DETAIL',
  MC_GET_SHADOW_QUIZ_DETAIL_SUCCESS: 'MC_GET_SHADOW_QUIZ_DETAIL_SUCCESS',
  MC_GET_SHADOW_QUIZ_DETAIL_FAILED: 'MC_GET_SHADOW_QUIZ_DETAIL_FAILED',

  MC_UPDATE_SHADOW_ASSIGNMENTS: 'MC_UPDATE_SHADOW_ASSIGNMENTS',
  MC_UPDATE_SHADOW_ASSIGNMENTS_SUCCESS: 'MC_UPDATE_SHADOW_ASSIGNMENTS_SUCCESS',
  MC_UPDATE_SHADOW_ASSIGNMENTS_FAILED: 'MC_UPDATE_SHADOW_ASSIGNMENTS_FAILED',

  // Student

  STUDENT_GET_SHADOW_ASSIGNMENT: 'STUDENT_GET_SHADOW_ASSIGNMENT',
  STUDENT_GET_SHADOW_ASSIGNMENT_SUCCESS:
    'STUDENT_GET_SHADOW_ASSIGNMENT_SUCCESS',
  STUDENT_GET_SHADOW_ASSIGNMENT_FAILED: 'STUDENT_GET_SHADOW_ASSIGNMENT_FAILED',

  STUDENT_EDIT_SHADOW_ASSIGNMENT: 'STUDENT_EDIT_SHADOW_ASSIGNMENT',
  STUDENT_EDIT_SHADOW_ASSIGNMENT_SUCCESS:
    'STUDENT_EDIT_SHADOW_ASSIGNMENT_SUCCESS',
  STUDENT_EDIT_SHADOW_ASSIGNMENT_FAILED:
    'STUDENT_EDIT_SHADOW_ASSIGNMENT_FAILED',

  MC_GET_COURSE_CONTENT: 'MC_GET_COURSE_CONTENT',
  MC_GET_COURSE_CONTENT_SUCCESS: 'MC_GET_COURSE_CONTENT_SUCCESS',
  MC_GET_COURSE_CONTENT_FAILED: 'MC_GET_COURSE_CONTENT_FAILED',

  MC_GET_COURSE_ACTIVITIES_BY_SECTION_SCHEDULE:
    'MC_GET_COURSE_ACTIVITIES_BY_SECTION_SCHEDULE',
  MC_GET_COURSE_ACTIVITIES_BY_SECTION_SCHEDULE_SUCCESS:
    'MC_GET_COURSE_ACTIVITIES_BY_SECTION_SCHEDULE_SUCCESS',
  MC_GET_COURSE_ACTIVITIES_BY_SECTION_SCHEDULE_FAILED:
    'MC_GET_COURSE_ACTIVITIES_BY_SECTION_SCHEDULE_FAILED',

  MC_GET_LESSON_DETAILS: 'MC_GET_LESSON_DETAILS',
  MC_GET_QUIZ_DETAILS: 'MC_GET_QUIZ_DETAILS',

  MC_GET_ACTIVITY_DETAILS_SUCCESS: 'MC_GET_ACTIVITY_DETAILS_SUCCESS',
  MC_GET_ACTIVITY_DETAILS_FAILED: 'MC_GET_ACTIVITY_DETAILS_FAILED',

  MC_GET_ASSIGNMENT_STUDENT_SUBMISSION: 'MC_GET_ASSIGNMENT_STUDENT_SUBMISSION',
  MC_GET_ASSIGNMENT_STUDENT_SUBMISSION_SUCCESS:
    'MC_GET_ASSIGNMENT_STUDENT_SUBMISSION_SUCCESS',
  MC_GET_ASSIGNMENT_STUDENT_SUBMISSION_FAILED:
    'MC_GET_ASSIGNMENT_STUDENT_SUBMISSION_FAILED',

  MC_GET_ACTIVITIES_BY_UNIT: 'MC_GET_ACTIVITIES_BY_UNIT',
  MC_GET_ACTIVITIES_BY_UNIT_SUCCESS: 'MC_GET_ACTIVITIES_BY_UNIT_SUCCESS',
  MC_GET_ACTIVITIES_BY_UNIT_FAILED: 'MC_GET_ACTIVITIES_BY_UNIT_FAILED',

  MC_GET_SHADOW_ITEM_VALIDATIONS: 'MC_GET_SHADOW_ITEM_VALIDATIONS',
  MC_GET_SHADOW_ITEM_VALIDATIONS_SUCCESS:
    'MC_GET_SHADOW_ITEM_VALIDATIONS_SUCCESS',
  MC_GET_SHADOW_ITEM_VALIDATIONS_FAILED:
    'MC_GET_SHADOW_ITEM_VALIDATIONS_FAILED',

  MC_CHANGE_SHADOW_ITEMS_STATUS_AT_MASTER_LEVEL:
    'MC_CHANGE_SHADOW_ITEMS_STATUS_AT_MASTER_LEVEL',
  MC_CHANGE_SHADOW_ITEMS_STATUS_AT_MASTER_LEVEL_SUCCESS:
    'MC_CHANGE_SHADOW_ITEMS_STATUS_AT_MASTER_LEVEL_SUCCESS',
  MC_CHANGE_SHADOW_ITEMS_STATUS_AT_MASTER_LEVEL_FAILED:
    'MC_CHANGE_SHADOW_ITEMS_STATUS_AT_MASTER_LEVEL_FAILED',

  MC_CONSOLIDATE_ASSIGNMENT: 'MC_CONSOLIDATE_ASSIGNMENT',
  MC_CONSOLIDATE_ASSIGNMENT_SUCCESS: 'MC_CONSOLIDATE_ASSIGNMENT_SUCCESS',
  MC_CONSOLIDATE_ASSIGNMENT_FAILED: 'MC_CONSOLIDATE_ASSIGNMENT_FAILED',

  MC_CONSOLIDATE_QUIZ: 'MC_CONSOLIDATE_QUIZ',
  MC_CONSOLIDATE_QUIZ_SUCCESS: 'MC_CONSOLIDATE_QUIZ_SUCCESS',
  MC_CONSOLIDATE_QUIZ_FAILED: 'MC_CONSOLIDATE_QUIZ_FAILED',

  RELINK_SHADOW_ITEM: 'RELINK_SHADOW_ITEM',
  RELINK_SHADOW_ITEM_SUCCESS: 'RELINK_SHADOW_ITEM_SUCCESS',
  RELINK_SHADOW_ITEM_FAILED: 'RELINK_SHADOW_ITEM_FAILED',

  GET_SECTION_DETAIL: 'GET_SECTION_DETAIL',
  GET_SECTION_DETAIL_SUCCESS: 'GET_SECTION_DETAIL_SUCCESS',
  GET_SECTION_DETAIL_FAILED: 'GET_SECTION_DETAIL_FAILED',

  GET_RELEASE_LIST_STUDENT_SUBMISSION: 'GET_RELEASE_LIST_STUDENT_SUBMISSION',
  GET_RELEASE_LIST_STUDENT_SUBMISSION_SUCCESS:
    'GET_RELEASE_LIST_STUDENT_SUBMISSION_SUCCESS',
  GET_RELEASE_LIST_STUDENT_SUBMISSION_FAILED:
    'GET_RELEASE_LIST_STUDENT_SUBMISSION_FAILED',

  RELEASE_GRADE_STUDENT_SUBMISSION: 'RELEASE_GRADE_STUDENT_SUBMISSION',
  RELEASE_GRADE_STUDENT_SUBMISSION_SUCCESS:
    'RELEASE_GRADE_STUDENT_SUBMISSION_SUCCESS',
  RELEASE_GRADE_STUDENT_SUBMISSION_FAILED:
    'RELEASE_GRADE_STUDENT_SUBMISSION_FAILED',

  CALCULATE_PUBLIC_OVERALL_COURSE_GRADE:
    'CALCULATE_PUBLIC_OVERALL_COURSE_GRADE',
  CALCULATE_PUBLIC_OVERALL_COURSE_GRADE_SUCCESS:
    'CALCULATE_PUBLIC_OVERALL_COURSE_GRADE_SUCCESS',
  CALCULATE_PUBLIC_OVERALL_COURSE_GRADE_FAILED:
    'CALCULATE_PUBLIC_OVERALL_COURSE_GRADE_FAILED',
  GET_TEACHER_OF_COURSE: 'GET_TEACHER_OF_COURSE',
  GET_TEACHER_OF_COURSE_SUCCESS: 'GET_TEACHER_OF_COURSE_SUCCESS',
  GET_TEACHER_OF_COURSE_FAILED: 'GET_TEACHER_OF_COURSE_FAILED',

  CHECK_TEACHER_GOOGLE_CONNECT: 'CHECK_TEACHER_GOOGLE_CONNECT',
  CHECK_TEACHER_GOOGLE_CONNECT_SUCCESS: 'CHECK_TEACHER_GOOGLE_CONNECT_SUCCESS',
  CHECK_TEACHER_GOOGLE_CONNECT_FAILED: 'CHECK_TEACHER_GOOGLE_CONNECT_FAILED',
  ...lessonActions,
};

export const QUIZ_TYPE = {
  ANNOUNCED: 1,
  POP: 2,
};

export const TabNameEnumTeacher = {
  UNIT_COURSE_ACTIVITIES: {
    key: 0,
    name: 'unit_course_activities',
  },
  PLAN: {
    key: 1,
    name: 'plan',
  },
  // STUDENT_SUBMISSIONS: {
  //   key: 2,
  //   name: 'student_submissions',
  // },
  GRADEBOOK: {
    key: 2,
    name: 'gradebook',
  },
  INFORMATION: {
    key: 3,
    name: 'information',
  },
};

export const TabNameEnumAssisTantTeacher = {
  UNIT_COURSE_ACTIVITIES: {
    key: 0,
    name: 'unit_course_activities',
  },
  PLAN: {
    key: 1,
    name: 'plan',
  },
  INFORMATION: {
    key: 2,
    name: 'information',
  },
};

export const TabNameEnumStudent = {
  COURSE_CONTENT: {
    key: 0,
    name: 'course_contents',
  },
  INFORMATION: {
    key: 1,
    name: 'information',
  },
};

export const getMyCourseDetailAPI = (methodName, attribute) => ({
  url: (id, courseId) =>
    `${process.env.REACT_APP_API_URL}/organization/${id}/courses/${courseId}?attribute=${attribute}`,
  method: methodName,
});

export const END_POINT = {
  ...allCourseEndPoint,
  ...gradeBookEndPoint,
  get_my_courses_list: {
    url: (orgId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organization/${orgId}/user/courses?${objectToParams(urlParams)}`,
    method: 'GET',
  },
  get_linked_contents: {
    url: (orgId, courseId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/all-items?${objectToParams(
        urlParams
      )}`,
    method: 'GET',
  },
  get_assignment_detail: {
    url: (orgId, courseId, unitId, assignmentId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/assignments/${assignmentId}`,
    method: 'GET',
  },
  get_all_course_days: {
    url: (orgId, courseId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/course-days`,
    method: 'GET',
  },
  get_shadow_assignment_detail: {
    url: (orgId, courseId, shadowId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-assignments/${shadowId}`,
    method: 'GET',
  },
  edit_assignment: {
    url: (orgId, courseId, unitId, assignmentId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/assignments/${assignmentId}`,
    method: 'PUT',
  },
  create_new_assignment: {
    url: (orgId, courseId, unitId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/assignments`,
    method: 'POST',
  },
  edit_shadow_assignment: {
    url: (orgId, courseId, shadowId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-assignments/${shadowId}`,
    method: 'PUT',
  },
  delete_assignment: {
    url: (orgId, courseId, unitId, assignmentId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/assignments/${assignmentId}`,
    method: 'DELETE',
  },
  mc_get_course_detail: (attribute) => getMyCourseDetailAPI('GET', attribute),
  get_terms_list_by_course: {
    url: (orgId, courseId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organization/${orgId}/courses/${courseId}?${objectToParams(urlParams)}`,
    method: 'GET',
  },
  create_new_unit: {
    url: (orgId, courseId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units`,
    method: 'POST',
  },

  mc_get_syllabus: getMyCourseDetailAPI('GET', 'syllabus'),
  mc_update_syllabus: getMyCourseDetailAPI('PUT', 'syllabus'),

  mc_get_permission_course: {
    method: 'GET',
    url: (orgId, courseId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/courses/${courseId}/users/permissions`,
  },

  get_units_by_term: {
    url: (orgId, courseId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/units?${objectToParams(
        urlParams
      )}`,
    method: 'GET',
  },
  edit_unit: {
    url: (orgId, courseId, unitId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}`,
    method: 'PUT',
  },
  create_quiz: {
    url: (orgId, courseId, unitId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/quizzes`,
    method: 'POST',
  },
  get_quiz: {
    url: (orgId, courseId, unitId, quizId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/quizzes/${quizId}`,
    method: 'GET',
  },
  edit_quiz: {
    url: (orgId, courseId, unitId, quizId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/quizzes/${quizId}`,
    method: 'PUT',
  },
  delete_quiz: {
    url: (orgId, courseId, unitId, quizId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/quizzes/${quizId}`,
    method: 'DELETE',
  },
  delete_unit: {
    url: (orgId, courseId, unitId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}`,
    method: 'DELETE',
  },
  delete_lesson: {
    url: (orgId, courseId, unitId, lessonId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/lessons/${lessonId}`,
    method: 'DELETE',
  },
  // Planning Tab
  mc_get_unit_by_course: {
    method: 'GET',
    url: (orgId, courseId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units`,
  },
  mc_get_course_item_by_unit: {
    method: 'GET',
    url: (orgId, courseId, unitId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/units/${unitId}?${objectToParams(
        urlParams
      )}`,
  },
  mc_get_course_day_by_grading_period: {
    method: 'GET',
    url: (orgId, courseId, gradingPeriodId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/grading-periods/${gradingPeriodId}`,
  },
  mc_get_course_day_detail: {
    method: 'GET',
    url: (orgId, courseId, courseDayId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/course-days/${courseDayId}`,
  },
  mc_get_course_day_list: {
    method: 'GET',
    url: (orgId, courseId, sectionId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/sections/${sectionId}/schedules?${objectToParams(
        urlParams
      )}`,
  },
  mc_get_shadow_lesson_detail: {
    method: 'GET',
    url: (orgId, courseId, shadowId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-lessons/${shadowId}`,
  },
  mc_update_master_item: {
    method: 'PUT',
    url: (orgId, courseId, courseDayId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/course-days/${courseDayId}`,
  },
  mc_update_shadow_lesson: {
    method: 'PUT',
    url: (orgId, courseId, shadowId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-lessons/${shadowId}`,
  },

  mc_update_shadow_quizzes: {
    method: 'PUT',
    url: (orgId, courseId, shadowId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-quizzes/${shadowId}`,
  },
  mc_get_shadow_quiz_detail: {
    method: 'GET',
    url: (orgId, courseId, shadowId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-quizzes/${shadowId}`,
  },

  mc_update_shadow_assignments: {
    method: 'PUT',
    url: (orgId, courseId, shadowId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-assignments/${shadowId}`,
  },

  // Student
  student_get_shadow_assignment: {
    url: (orgId, courseId, shadowId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/shadow-assignments/${shadowId}/student-submission?${objectToParams(
        urlParams
      )}`,
    method: 'GET',
  },
  student_edit_shadow_assignment: {
    url: (orgId, courseId, shadowId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-assignments/${shadowId}/student-submission`,
    method: 'PUT',
  },
  mc_get_course_content: {
    method: 'GET',
    url: (orgId, courseId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/content?${objectToParams(
        urlParams
      )}`,
  },
  mc_get_course_activities_by_section_schedule: {
    method: 'GET',
    url: (orgId, courseId, sectionSchedulesId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/all-items/${sectionSchedulesId}?${objectToParams(
        urlParams
      )}`,
  },
  mc_get_lesson_details: {
    method: 'GET',
    url: (orgId, courseId, shadowId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/shadow-lessons/${shadowId}/view?${objectToParams(
        urlParams
      )}`,
  },
  mc_get_quiz_details: {
    method: 'GET',
    url: (orgId, courseId, shadowId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/shadow-quizzes/${shadowId}/student-view?${objectToParams(
        urlParams
      )}`,
  },
  mc_unplaned_master: {
    method: 'DELETE',
    url: (orgId, courseId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/course-days`,
  },
  mc_get_assignment_student_submission: {
    method: 'GET',
    url: (orgId, courseId, unitId, assignmentId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/units/${unitId}/assignments/${assignmentId}/student-submissions?${objectToParams(
        urlParams
      )}`,
  },
  mc_get_activities_by_unit: {
    method: 'GET',
    url: (orgId, courseId, unitId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/units/${unitId}/items?${objectToParams(
        urlParams
      )}`,
  },
  mc_get_grader_detail: {
    method: 'GET',
    url: (orgId, courseId, shadowId, studentId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-assignments/${shadowId}/student-submissions/${studentId}`,
  },
  mc_get_shadow_item_validations: {
    method: 'GET',
    url: (orgId, courseId, unitId, courseItemType, masterId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/${courseItemType}/${masterId}/validation`,
  },
  mc_change_shadow_items_status_at_master_level: {
    method: 'PUT',
    url: (orgId, courseId, unitId, courseItemType, masterId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/${courseItemType}/${masterId}`,
  },
  mc_consolidate_assignment: {
    method: 'PUT',
    url: (orgId, courseId, unitId, masterId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/assignments/${masterId}/consolidate`,
  },
  mc_consolidate_quiz: {
    method: 'PUT',
    url: (orgId, courseId, unitId, masterId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}/quizzes/${masterId}/consolidate`,
  },
  relink_shadow_item: {
    method: 'PUT',
    url: (orgId, courseId, type, shadowId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-${type}/${shadowId}`,
  },
  get_section_detail: {
    method: 'GET',
    url: (orgId, courseId, courseDayId, sectionId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/course-days/${courseDayId}/sections/${sectionId}?${objectToParams(
        urlParams
      )}`,
  },
  release_grade_student_submission: {
    method: 'PUT',
    url: (courseId) =>
      `${process.env.REACT_APP_API_URL}/grader/teacher/courses/${courseId}/publicFinalGrade`,
  },
  calculate_public_overall_course_grade: {
    method: 'PUT',
    url: (courseId, termId) =>
      `${process.env.REACT_APP_API_URL}/grader/teacher/overallCourseGrade/students/courses/${courseId}/terms/${termId}`,
  },
  get_teacher_of_course: {
    url: (orgId, courseId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/courses/${courseId}?attribute=teacher`,
    method: 'GET',
  },
  check_teacher_google_connect: {
    url: (courseId) =>
      `${process.env.REACT_APP_API_URL}/courses/${courseId}/teacher/connect-google`,
    method: 'GET',
  },
  ...lessonEndPoint,
};

export const GRADE_WEIGHT_TYPE = {
  1: 'assignment',
  2: 'participation',
  3: 'test',
  lesson: 'lesson',
  ASSIGNMENT: 1,
  PARTICIPATION: 2,
  TEST: 3,
};

export const GRADE_WEIGHT_TYPE_NUMBER = {
  ASSIGNMENT: 1,
  PARTICIPATION: 2,
  TEST: 3,
  LESSON: 0,
};

export const LESSON_STATUS = {
  DRAFT: 0,
  PUBLIC: 1,
};

export const QUIZ_STATUS = {
  CLOSED: -1,
  DRAFT: 0,
  PUBLIC: 1,
  PUBLIC_VISIBLE: 2,
  PUBLISHED: 3,
};
export const ASSIGNMENT_STATUS = {
  ASSIGNED_LATE: -2,
  CLOSED: -1,
  DRAFT: 0,
  READY_TO_ASSIGN: 1,
  ASSIGNED: 2,
};

export const PLANNING_STATUS = {
  0: {
    0: {
      name: 'draft',
      color: 'draft',
    },
    1: {
      name: 'published',
      color: 'published',
    },
  },
  1: {
    '-2': {
      name: 'assigned_late',
      color: 'published',
    },
    '-1': {
      name: 'closed',
      color: 'published',
    },
    0: {
      name: 'draft',
      color: 'draft',
    },
    1: {
      name: 'ready_to_assign',
      color: 'published',
    },
    2: {
      name: 'assigned',
      color: 'published',
    },
  },
  3: {
    '-1': {
      name: 'closed',
      color: 'published',
    },
    0: {
      name: 'draft',
      color: 'draft',
    },
    1: {
      name: 'published',
      color: 'published',
    },
    2: {
      name: 'published',
      color: 'published',
    },
    3: {
      name: 'published',
      color: 'published',
    },
  },
};

export const STATUS_STUDENT_ASSIGNMENT = {
  '-3': {
    name: 'missing',
    background: 'bg-red',
    color: '#ffffff',
  },
  '-2': {
    name: 'missed',
    background: 'bg-red',
    color: '#ffffff',
  },
  // '-1': {
  //   name: 'turn_in_late',
  //   background: 'bg-blue-gray',
  //   color: 'primary-1'
  // },
  '-1': {
    name: 'turn_in_late',
    background: 'bg-primary-2',
    color: '#ffffff',
  },
  0: {
    name: 'not_turn_in',
    background: 'bg-gray-600',
    color: '#ffffff',
  },
  // '1': {
  //   name: 'in_progress',
  //   background: 'bg-blue-gray',
  //   color: '#43425d'
  // },
  2: {
    name: 'completed',
    background: 'bg-blue-gray',
    color: '#43425d',
  },
  3: {
    name: 'turn_in',
    background: 'bg-primary-2',
    color: '#ffffff',
  },
  // '4': {
  //   name: 'graded',
  //   background: 'bg-green',
  //   color: '#ffffff'
  // }
};

export const STATUS_STUDENT_QUIZ_SUBMISSION = {
  0: {
    name: 'not_graded',
  },
  1: {
    name: 'graded',
  },
};

export const STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST = {
  '-3': {
    name: 'missing',
    background: '#FFF5F5',
    color: '#C92A2A',
    sort: 5,
  },
  '-2': {
    name: 'missed',
    background: '#F03E3E',
    color: '#ffffff',
    sort: 6,
  },
  // '-1': {
  //   name: 'turn_in_late',
  //   background: 'bg-blue-gray',
  //   color: 'primary-1'
  // },
  3: {
    name: 'turn_in',
    background: '#E6FCF5',
    color: '#087F5B',
    sort: 1,
  },
  '-1': {
    name: 'late_turn_in',
    background: '#FFF9DB',
    color: '#E67700',
    sort: 2,
  },
  0: {
    name: 'not_turn_in',
    background: '#CED4DA',
    color: '#ffffff',
    sort: 3,
  },
  // '1': {
  //   name: 'in_progress',
  //   background: 'bg-blue-gray',
  //   color: '#43425d'
  // },
  2: {
    name: 'completed',
    background: 'bg-blue-gray',
    color: '#43425d',
  },

  4: {
    name: 'graded',
    background: '#1A7AE6',
    color: '#ffffff',
    sort: 4,
  },
  5: {
    name: 'rejected',
    background: '#FAB005',
    color: '#FAB005',
  },
};

export const STUDENT_PROGRESS_STATUS = {
  MISSING: -3,
  MISSED: -2,
  LATE_TURN_IN: -1,
  NOT_TURN_IN: 0,
  COMPLETED: 2,
  TURN_IN: 3,
  GRADED: 4,
  REJECTED: 5,
};

export const LINKED_COLORS = {
  0: '#d64531',
  1: '#2fb800',
  3: '#258fd6',
};

export const MASTER_ITEM_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
};
