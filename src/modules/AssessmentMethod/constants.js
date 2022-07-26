import { objectToParams } from 'utils';
export const actions = {
  GET_ASSESSMENT_METHOD_LIST: 'GET_LIST_OF_ASSESSMENT_METHOD_LIST',
  GET_ASSESSMENT_METHOD_LIST_SUCCESS: 'GET_ASSESSMENT_METHOD_LIST_SUCCESS',
  GET_ASSESSMENT_METHOD_LIST_FAILED: 'GET_ASSESSMENT_METHOD_LIST_FAILED',

  GET_ASSESSMENT_METHOD_DETAIL: 'GET_ASSESSMENT_METHOD_DETAIL',
  GET_ASSESSMENT_METHOD_DETAIL_SUCCESS: 'GET_ASSESSMENT_METHOD_DETAIL_SUCCESS',
  GET_ASSESSMENT_METHOD_DETAIL_FAILED: 'GET_ASSESSMENT_METHOD_DETAIL_FAILED',

  CREATE_ASSESSMENT_METHOD: 'CREATE_ASSESSMENT_METHOD',
  CREATE_ASSESSMENT_METHOD_SUCCESS: 'CREATE_ASSESSMENT_METHOD_SUCCESS',
  CREATE_ASSESSMENT_METHOD_FAILED: 'CREATE_ASSESSMENT_METHOD_FAILED',

  EDIT_ASSESSMENT_METHOD: 'EDIT_ASSESSMENT_METHOD',
  EDIT_ASSESSMENT_METHOD_SUCCESS: 'EDIT_ASSESSMENT_METHOD_SUCCESS',
  EDIT_ASSESSMENT_METHOD_FAILED: 'EDIT_ASSESSMENT_METHOD_FAILED',

  SET_DEFAULT_ASSESSMENT_METHOD: 'SET_DEFAULT_ASSESSMENT_METHOD',
  SET_DEFAULT_ASSESSMENT_METHOD_SUCCESS:
    'SET_DEFAULT_ASSESSMENT_METHOD_SUCCESS',
  SET_DEFAULT_ASSESSMENT_METHOD_FAILED: 'SET_DEFAULT_ASSESSMENT_METHOD_FAILED',

  DELETE_ASSESSMENT_METHOD: 'DELETE_ASSESSMENT_METHOD',
  DELETE_ASSESSMENT_METHOD_SUCCESS: 'DELETE_ASSESSMENT_METHOD_SUCCESS' ,
  DELETE_ASSESSMENT_METHOD_FAILED: 'DELETE_ASSESSMENT_METHOD_FAILED',

  RESET_ASSESSMENT_METHOD_ACTIONS: 'RESET_ASSESSMENT_METHOD_ACTIONS',

};

export const END_POINT = {
  get_assessment_method_list: {
    url: (orgId, urlParams) => {
      let url = `${
        process.env.REACT_APP_API_URL
      }/organization/${orgId}/assessment-method?${objectToParams(urlParams)}`;
      return url;
    },
    method: 'GET',
  },
  get_assessment_method_detail: {
    url: (orgId, gradeScaleId) => {
      let url = `${process.env.REACT_APP_API_URL}/organization/${orgId}/assessment-method/${gradeScaleId}`;
      return url;
    },
    method: 'GET',
  },
  create_assessment_method: {
    url: (orgId) => {
      let url = `${process.env.REACT_APP_API_URL}/organization/${orgId}/assessment-method`;
      return url;
    },
    method: 'POST',
  },
  edit_assessment_method: {
    url: (orgId, gradeScaleId) => {
      let url = `${process.env.REACT_APP_API_URL}/organization/${orgId}/assessment-method/${gradeScaleId}`;
      return url;
    },
    method: 'PUT',
  },
  set_default_assessment_method: {
    url: (orgId, gradeScaleId) => {
      let url = `${process.env.REACT_APP_API_URL}/organization/${orgId}/assessment-method/${gradeScaleId}/set-default`;
      return url;
    },
    method: 'PUT',
  },
  delete_assessment_method: {
    url: (orgId, methodId) => {
      let url = `${
        process.env.REACT_APP_API_URL
        }/organization/${orgId}/assessment-method/${methodId}`;
      return url;
    },
    method: 'DELETE'
  },
};
