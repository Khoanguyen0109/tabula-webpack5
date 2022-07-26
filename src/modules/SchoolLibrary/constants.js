import { objectToParamsNew } from 'utils';

export const actions = {
    GET_COURSE_TEMPLATE_LIST_SCHOOL_LIBRARY: 'GET_COURSE_TEMPLATE_LIST_SCHOOL_LIBRARY',
    GET_COURSE_TEMPLATE_LIST_SCHOOL_LIBRARY_SUCCESS: 'GET_COURSE_TEMPLATE_LIST_SCHOOL_LIBRARY_SUCCESS',
    GET_COURSE_TEMPLATE_LIST_SCHOOL_LIBRARY_FAILED: 'GET_COURSE_TEMPLATE_LIST_SCHOOL_LIBRARY_FAILED',
};

export const END_POINT = {

    get_course_template_list_school_library: {
      url: (organizationId, urlParams) => `${
          process.env.REACT_APP_SCHOOL_PORTAL_URL
        }/school-course-templates/organizations/${organizationId}?${objectToParamsNew(
          urlParams
        )}`,
      method: 'GET',
    },
   
  };