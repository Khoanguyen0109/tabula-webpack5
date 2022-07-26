export const actions = {

  RESET_STATE_LESSON: 'RESET_STATE_LESSON',

  CREATE_NEW_LESSON: 'CREATE_NEW_LESSON',
  CREATE_NEW_LESSON_SUCCESS: 'CREATE_NEW_LESSON_SUCCESS',
  CREATE_NEW_LESSON_FAILED: 'CREATE_NEW_LESSON_FAILED',

  EDIT_LESSON: 'EDIT_LESSON',
  EDIT_LESSON_SUCCESS: 'EDIT_LESSON_SUCCESS',
  EDIT_LESSON_FAILED: 'EDIT_LESSON_FAILED',

  GET_LESSON_DETAIL: 'GET_LESSON_DETAIL',
  GET_LESSON_DETAIL_SUCCESS: 'GET_LESSON_DETAIL_SUCCESS',
  GET_LESSON_DETAIL_FAILED: 'GET_LESSON_DETAIL_FAILED',

};

export const TYPE_OF_CREATE = {
  CREATE_AS_DRAFT: 0,
  CREATE_AND_PUBLISH: 1
};

export const END_POINT = {
  create_new_lesson: {
    url: (orgId, courseId, unitId) => `${process.env.REACT_APP_API_URL
        }/organizations/${orgId}/courses/${courseId}/units/${unitId}/lessons`,
    method: 'POST',
  },

  edit_lesson: {
    url: (orgId, courseId, unitId, lessonId) => `${process.env.REACT_APP_API_URL
        }/organizations/${orgId}/courses/${courseId}/units/${unitId}/lessons/${lessonId}`,
    method: 'PUT',
  },

  get_lesson_detail: {
    url: (orgId, courseId, unitId, lessonId) => `${process.env.REACT_APP_API_URL
        }/organizations/${orgId}/courses/${courseId}/units/${unitId}/lessons/${lessonId}`,
    method: 'GET',
  },
};

export const LESSON_STATUS = {
  DRAFT: 0,
  PUBLIC: 1
};