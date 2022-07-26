import { objectToParamsNew } from 'utils';

export const actions = {
  CREATE_COURSE_TEMPLATE: 'CREATE_COURSE_TEMPLATE',
  CREATE_COURSE_TEMPLATE_SUCCESS: 'CREATE_COURSE_TEMPLATE_SUCCESS',
  CREATE_COURSE_TEMPLATE_FAILED: 'CREATE_COURSE_TEMPLATE_FAILED',
  GET_COURSE_TEMPLATE_LIST: 'GET_COURSE_TEMPLATE_LIST',
  GET_COURSE_TEMPLATE_LIST_SUCCESS: 'GET_COURSE_TEMPLATE_LIST_SUCCESS',
  GET_COURSE_TEMPLATE_LIST_FAILED: 'GET_COURSE_TEMPLATE_LIST_FAILED',
  GET_SCHOOL_SETTING: 'GET_SCHOOL_SETTING',
  GET_SCHOOL_SETTING_SUCCESS: 'GET_SCHOOL_SETTING_SUCCESS',
  GET_SCHOOL_SETTING_FAILED: 'GET_SCHOOL_SETTING_FAILED',
  MANAGE_COURSE_TEMPLATE_SET_STATE: 'MANAGE_COURSE_TEMPLATE_SET_STATE',
  GET_COURSE_TEMPLATE_DETAIL: 'GET_COURSE_TEMPLATE_DETAIL',
  GET_COURSE_TEMPLATE_DETAIL_SUCCESS: 'GET_COURSE_TEMPLATE_DETAIL_SUCCESS',
  GET_COURSE_TEMPLATE_DETAIL_FAILED: 'GET_COURSE_TEMPLATE_DETAIL_FAILED',
  UPDATE_COURSE_TEMPLATE: 'UPDATE_COURSE_TEMPLATE',
  UPDATE_COURSE_TEMPLATE_SUCCESS: 'UPDATE_COURSE_TEMPLATE_SUCCESS',
  UPDATE_COURSE_TEMPLATE_FAILED: 'UPDATE_COURSE_TEMPLATE_FAILED',
  VIEW_TEMPLATE_DETAIL_GET_TERMS: 'VIEW_TEMPLATE_DETAIL_GET_TERMS',
  VIEW_TEMPLATE_DETAIL_GET_TERMS_SUCCESS: 'VIEW_TEMPLATE_DETAIL_GET_TERMS_SUCCESS',
  VIEW_TEMPLATE_DETAIL_GET_TERMS_FAILED: 'VIEW_TEMPLATE_DETAIL_GET_TERMS_FAILED',
  VIEW_TEMPLATE_DETAIL_GET_UNIT: 'VIEW_TEMPLATE_DETAIL_GET_UNIT',
  VIEW_TEMPLATE_DETAIL_GET_UNIT_SUCCESS: 'VIEW_TEMPLATE_DETAIL_GET_UNIT_SUCCESS',
  VIEW_TEMPLATE_DETAIL_GET_UNIT_FAILED: 'VIEW_TEMPLATE_DETAIL_GET_UNIT_FAILED',
  PUBLISH_TO_SCHOOL_LIBRARY: 'PUBLISH_TO_SCHOOL_LIBRARY',
  PUBLISH_TO_SCHOOL_LIBRARY_SUCCESS: 'PUBLISH_TO_SCHOOL_LIBRARY_SUCCESS',
  PUBLISH_TO_SCHOOL_LIBRARY_FAILED: 'PUBLISH_TO_SCHOOL_LIBRARY_FAILED',
  UN_PUBLISH_TO_SCHOOL_LIBRARY: 'UN_PUBLISH_TO_SCHOOL_LIBRARY',
  UN_PUBLISH_TO_SCHOOL_LIBRARY_SUCCESS: 'UN_PUBLISH_TO_SCHOOL_LIBRARY_SUCCESS',
  UN_PUBLISH_TO_SCHOOL_LIBRARY_FAILED: 'UN_PUBLISH_TO_SCHOOL_LIBRARY_FAILED',
  PUBLISH_TO_DISTRICT_LIBRARY: 'PUBLISH_TO_DISTRICT_LIBRARY',
  PUBLISH_TO_DISTRICT_LIBRARY_SUCCESS: 'PUBLISH_TO_DISTRICT_LIBRARY_SUCCESS',
  PUBLISH_TO_DISTRICT_LIBRARY_FAILED: 'PUBLISH_TO_DISTRICT_LIBRARY_FAILED',
  DELETE_COURSE_TEMPLATE: 'DELETE_COURSE_TEMPLATE',
  DELETE_COURSE_TEMPLATE_SUCCESS: 'DELETE_COURSE_TEMPLATE_SUCCESS',
  DELETE_COURSE_TEMPLATE_FAILED: 'DELETE_COURSE_TEMPLATE_FAILED',
  GET_SCHOOL_GRADE_LEVEL: 'GET_SCHOOL_GRADE_LEVEL',
  GET_SCHOOL_GRADE_LEVEL_SUCCESS: 'GET_SCHOOL_GRADE_LEVEL_SUCCESS',
  GET_SCHOOL_GRADE_LEVEL_FAILED: 'GET_SCHOOL_GRADE_LEVEL_FAILED'
};

export const TAB_ENUM_COURSE_TEMPLATE_DETAIL = {
  PLAN: {
    key: 0,
    name: 'plan',
  },

  INFORMATION: {
    key: 1,
    name: 'information',
  },
};
export const END_POINT = {
  create_course_template: {
    url: (organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-course-templates/organizations/${organizationId}`,
    method: 'POST',
  },
  get_course_template_list: {
    url: (organizationId, urlParams) => `${
        process.env.REACT_APP_SCHOOL_PORTAL_URL
      }/school-course-templates/organizations/${organizationId}?${objectToParamsNew(
        urlParams
      )}`,
    method: 'GET',
  },
  get_school_setting: {
    url: (organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-settings/organizations/${organizationId}`,
    method: 'GET',
  },
  get_course_template_detail: {
    url: (templateId, organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-course-templates/${templateId}/organizations/${organizationId}/info`,
    method: 'GET',
  },
  update_course_template: {
    url: (templateId, organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-course-templates/${templateId}/organizations/${organizationId}`,
    method: 'PUT',
  },
  publish_to_school_library: {
    url: (templateId, organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-course-templates/${templateId}/organizations/${organizationId}/publish-school-library`,
    method: 'PUT'
  },
  view_template_detail_get_terms: {
    url: (templateId, organizationId) => `${
        process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-course-templates/${templateId}/organizations/${organizationId}/terms`
  },
  view_template_detail_get_unit: {
    url: (templateId, organizationId, gradingPeriodId) => `${
        process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-course-templates/${templateId}/organizations/${organizationId}/grading-periods/${gradingPeriodId}/units`,
    method: 'GET'
  },
  un_publish_to_school_library: {
    url: (templateId, organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-course-templates/${templateId}/organizations/${organizationId}/unpublish-school-library`,
    method: 'PUT',
  },
  publish_to_district_library: {
    url: (templateId, organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-course-templates/${templateId}/organizations/${organizationId}/publish-district-library`,
    method: 'PUT',
  },
  delete_course_template: {
    url: (templateId, organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/school-course-templates/${templateId}/organizations/${organizationId}`,
    method: 'DELETE',
  },
  get_school_grade_level: {
    url: (organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/grade-levels/organizations/${organizationId}`,
    method: 'GET',
  }
};
