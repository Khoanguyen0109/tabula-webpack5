export const actions = {
  GET_SUBJECT_LIST: 'GET_SUBJECT_LIST',
  GET_SUBJECT_LIST_SUCCESS: 'GET_SUBJECT_LIST_SUCCESS',
  GET_SUBJECT_LIST_FAILED: 'GET_SUBJECT_LIST_FAILED',

  CREATE_NEW_SUBJECT: 'CREATE_NEW_SUBJECT',
  CREATE_NEW_SUBJECT_SUCCESS: 'CREATE_NEW_SUBJECT_SUCCESS',
  CREATE_NEW_SUBJECT_FAILED: 'CREATE_NEW_SUBJECT_FAILED',

  EDIT_SUBJECT: 'EDIT_SUBJECT',
  EDIT_SUBJECT_SUCCESS: 'CREATE_NEW_SUBJECT_SUCCESS',
  EDIT_SUBJECT_FAILED: 'CREATE_NEW_SUBJECT_FAILED'
};

export const END_POINT = {
  get_subject_list: {
    url: (orgId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/subjects`,
    method: 'GET'
  },
  create_new_subject: {
    url: (orgId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/subject`,
    method: 'POST'
  },
  edit_subject: {
    url: (orgId, subjectId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/subject/${subjectId}`,
    method: 'PUT'
  }
};
