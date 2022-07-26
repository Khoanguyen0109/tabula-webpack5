import { objectToParams } from 'utils';
export const actions = {
  ALL_COURSES_SET_STATE: 'ALL_COURSES_SET_STATE',

  GET_ALL_COURSES_LIST: 'GET_ALL_COURSES_LIST',
  GET_ALL_COURSES_LIST_SUCCESS: 'GET_ALL_COURSES_LIST_SUCCESS',
  GET_ALL_COURSES_LIST_FAILED: 'GET_ALL_COURSES_LIST_FAILED',

  CREATE_DRAFT_COURSE: 'CREATE_DRAFT_COURSE',
  CREATE_DRAFT_COURSE_SUCCESS: 'CREATE_DRAFT_COURSE_SUCCESS',
  CREATE_DRAFT_COURSE_FAILED: 'CREATE_DRAFT_COURSE_FAILED',

  DELETE_DRAFT_COURSE: 'DELETE_DRAFT_COURSE',
  DELETE_DRAFT_COURSE_SUCCESS: 'DELETE_DRAFT_COURSE_SUCCESS',
  DELETE_DRAFT_COURSE_FAILED: 'DELETE_DRAFT_COURSE_FAILED',

  GET_BASIC_INFO: 'GET_BASIC_INFO',
  GET_BASIC_INFO_SUCCESS: 'GET_BASIC_INFO_SUCCESS',
  GET_BASIC_INFO_FAILED: 'GET_BASIC_INFO_FAILED',

  UPDATE_BASIC_INFO: 'UPDATE_BASIC_INFO',
  UPDATE_BASIC_INFO_SUCCESS: 'UPDATE_BASIC_INFO_SUCCESS',
  UPDATE_BASIC_INFO_FAILED: 'UPDATE_BASIC_INFO_FAILED',

  UPDATE_COURSE_INFO: 'UPDATE_COURSE_INFO',
  UPDATE_COURSE_INFO_SUCCESS: 'UPDATE_COURSE_INFO_SUCCESS',
  UPDATE_COURSE_INFO_FAILED: 'UPDATE_COURSE_INFO_FAILED',

  UPDATE_TEACHERS_IN_COURSE: 'UPDATE_TEACHERS_IN_COURSE',
  UPDATE_TEACHERS_IN_COURSE_SUCCESS: 'UPDATE_TEACHERS_IN_COURSE_SUCCESS',
  UPDATE_TEACHERS_IN_COURSE_FAILED: 'UPDATE_TEACHERS_IN_COURSE_FAILED',

  UPDATE_STUDENTS_IN_COURSE: 'UPDATE_STUDENTS_IN_COURSE',
  UPDATE_STUDENTS_IN_COURSE_SUCCESS: 'UPDATE_STUDENTS_IN_COURSE_SUCCESS',
  UPDATE_STUDENTS_IN_COURSE_FAILED: 'UPDATE_STUDENTS_IN_COURSE_FAILED',

  GET_TEACHERS: 'GET_TEACHERS',
  GET_TEACHERS_SUCCESS: 'GET_TEACHERS_SUCCESS',
  GET_TEACHERS_FAILED: 'GET_TEACHERS_FAILED',

  GET_STUDENTS: 'GET_STUDENTS',
  GET_STUDENTS_SUCCESS: 'GET_STUDENTS_SUCCESS',
  GET_STUDENTS_FAILED: 'GET_STUDENTS_FAILED',

  GET_TEACHER_OF_COURSE: 'GET_TEACHER_OF_COURSE',
  GET_TEACHER_OF_COURSE_SUCCESS: 'GET_TEACHER_OF_COURSE_SUCCESS',
  GET_TEACHER_OF_COURSE_FAILED: 'GET_TEACHER_OF_COURSE_FAILED',

  GET_SECTIONS_OF_COURSE: 'GET_SECTIONS_OF_COURSE',
  GET_SECTIONS_OF_COURSE_SUCCESS: 'GET_SECTIONS_OF_COURSE_SUCCESS',
  GET_SECTIONS_OF_COURSE_FAILED: 'GET_SECTIONS_OF_COURSE_FAILED',

  GET_STUDENTS_OF_COURSE: 'GET_STUDENTS_OF_COURSE',
  GET_STUDENTS_OF_COURSE_SUCCESS: 'GET_STUDENTS_OF_COURSE_SUCCESS',
  GET_STUDENTS_OF_COURSE_FAILED: 'GET_STUDENTS_OF_COURSE_FAILED',

  GET_STUDENTS_IN_SECTION_OF_COURSE: 'GET_STUDENTS_IN_SECTION_OF_COURSE',
  GET_STUDENTS_IN_SECTION_OF_COURSE_SUCCESS: 'GET_STUDENTS_IN_SECTION_OF_COURSE_SUCCESS',
  GET_STUDENTS_IN_SECTION_OF_COURSE_FAILED: 'GET_STUDENTS_IN_SECTION_OF_COURSE_FAILED',

  GET_SECTIONS_AND_MEETING_TIMES: 'GET_SECTIONS_AND_MEETING_TIMES',
  GET_SECTIONS_AND_MEETING_TIMES_SUCCESS: 'GET_SECTIONS_AND_MEETING_TIMES_SUCCESS',
  GET_SECTIONS_AND_MEETING_TIMES_FAILED: 'GET_SECTIONS_AND_MEETING_TIMES_FAILED',

  UPDATE_SECTIONS_AND_MEETING_TIMES: 'UPDATE_SECTIONS_AND_MEETING_TIMES',
  UPDATE_SECTIONS_AND_MEETING_TIMES_SUCCESS: 'UPDATE_SECTIONS_AND_MEETING_TIMES_SUCCESS',
  UPDATE_SECTIONS_AND_MEETING_TIMES_FAILED: 'UPDATE_SECTIONS_AND_MEETING_TIMES_FAILED',

  GET_ASSESSMENT_METHOD_IN_COURSE: 'GET_ASSESSMENT_METHOD_IN_COURSE',
  GET_ASSESSMENT_METHOD_IN_COURSE_SUCCESS: 'GET_ASSESSMENT_METHOD_IN_COURSE_SUCCESS',
  GET_ASSESSMENT_METHOD_IN_COURSE_FAILED: 'GET_ASSESSMENT_METHOD_IN_COURSE_FAILED',

  UPDATE_ASSESSMENT_METHOD_IN_COURSE: 'UPDATE_ASSESSMENT_METHOD_IN_COURSE',
  UPDATE_ASSESSMENT_METHOD_IN_COURSE_SUCCESS: 'UPDATE_ASSESSMENT_METHOD_IN_COURSE_SUCCESS',
  UPDATE_ASSESSMENT_METHOD_IN_COURSE_FAILED: 'UPDATE_ASSESSMENT_METHOD_IN_COURSE_FAILED',
  GET_COURSE_VALIDATION: 'GET_COURSE_VALIDATION',
  GET_COURSE_VALIDATION_SUCCESS: 'GET_COURSE_VALIDATION_SUCCESS',
  GET_COURSE_VALIDATION_FAILED: 'GET_COURSE_VALIDATION_FAILED',
  DELETE_SECTION: 'DELETE_SECTION',
  SAVE_AS_TEMPLATE: 'SAVE_AS_TEMPLATE',
  SAVE_AS_TEMPLATE_SUCCESS: 'SAVE_AS_TEMPLATE_SUCCESS',
  SAVE_AS_TEMPLATE_FAILED: 'SAVE_AS_TEMPLATE_FAILED',

  DELETE_SECTION_SUCCESS: 'DELETE_SECTION_SUCCESS',
  DELETE_SECTION_FAILED: 'DELETE_SECTION_FAILED',

  RESET_ALL_COURSE_REDUCER: 'RESET_ALL_COURSE_REDUCER'
};

const getAllCourseDetailAPI = (methodName, attribute) => ({
    url: (id, courseId, studentId = null) =>
      `${process.env.REACT_APP_API_URL}/organization/${id}/courses/${courseId}?attribute=${attribute}${!!studentId ? `&studentId=${studentId}`: ''}`,
    method: methodName
  });

const updateAllCourseDetailAPI = (methodName) => ({
    url: (id, courseId) =>
      `${process.env.REACT_APP_API_URL}/organization/${id}/courses/${courseId}`,
    method: methodName
  });

export const END_POINT = {
  get_all_courses_list: {
    url: (id, urlParams) =>
      `${process.env.REACT_APP_API_URL}/organization/${id}/courses?${objectToParams(urlParams)}`,
    method: 'GET'
  },
  // get_basic_info: {
  //   url: (id, courseId) =>
  //     `${process.env.REACT_APP_API_URL}/organization/${id}/courses/${courseId}?attribute=basicInfo`,
  //   method: 'GET'
  // },

  get_course_info: {
    url: (orgId, courseId, urlParams) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/courses/${courseId}?${objectToParams(urlParams)}`,
    method: 'GET'
  },
  
  get_sections_of_course: {
    url: (orgId, courseId, urlParams) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/sections?${objectToParams(urlParams)}`,
    method: 'GET'
  },
  get_section_info_of_course: {
    url: (orgId, courseId,sectionId, urlParams) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/sections/${sectionId}?${objectToParams(urlParams)}`,
    method: 'GET'
  },
  get_students_in_section_of_course: {
    url: (orgId, courseId,sectionId, urlParams) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/sections/${sectionId}/students?${objectToParams(urlParams)}`,
    method: 'GET'
  },

  update_course_info: {
    url: (orgId, courseId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/courses/${courseId}`,
    method: 'PUT'
  },
  
  // update_basic_info: {
  //   url: (id, courseId) =>
  //     `${process.env.REACT_APP_API_URL}/organization/${id}/courses/${courseId}`,
  //   method: 'PUT'
  // },
  get_teachers: {
    url: (id) =>
      `${process.env.REACT_APP_API_URL}/organization/${id}/course/teachers`,
    method: 'GET'
  },
  get_students: {
    url: (id) =>
      `${process.env.REACT_APP_API_URL}/organization/${id}/course/students`,
    method: 'GET'
  },
  get_basic_info: getAllCourseDetailAPI('GET', 'basicInfo'),
  update_basic_info: updateAllCourseDetailAPI('PUT'),
  create_draft_course: {
    url: (orgId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/courses`,
    method: 'POST'
  },
  delete_draft_course: {
    url: (orgId , courseId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/courses/${courseId}`,
    method: 'DELETE'
  },

  get_sections_and_meeting_times: getAllCourseDetailAPI('GET', 'section'),
  update_sections_and_meeting_times: updateAllCourseDetailAPI('PUT'),
  get_assessment_method_in_course: getAllCourseDetailAPI('GET', 'assessmentMethod'),
  update_assessment_method_in_course: updateAllCourseDetailAPI('PUT'),
  get_course_validation: {
    method: 'GET',
    url: (orgId, courseId) => `${process.env.REACT_APP_API_URL}/organization/${orgId}/courses/${courseId}/validation`
  },
  delete_section: {
    url: (id, courseId, sectionId) =>
      `${process.env.REACT_APP_API_URL}/organization/${id}/courses/${courseId}/section/${sectionId}`,
    method: 'DELETE'
  },
  save_as_template: {
    url: (organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-course-templates/organizations/${organizationId}`,
    method: 'POST',
  }
};
