import { objectToParams } from 'utils';

export const actions = {
  AGENDA_SET_STATE: 'AGENDA_SET_STATE',

  GET_AGENDA_LIST: 'GET_AGENDA_LIST',
  GET_AGENDA_LIST_FAILED: 'GET_AGENDA_LIST_FAILED',
  GET_AGENDA_LIST_SUCCESS: 'GET_AGENDA_LIST_SUCCESS',

  GET_AGENDA_DETAIL: 'GET_AGENDA_DETAIL',
  GET_AGENDA_DETAIL_FAILED: 'GET_AGENDA_DETAIL_FAILED',
  GET_AGENDA_DETAIL_SUCCESS: 'GET_AGENDA_DETAIL_SUCCESS',

  STUDENT_GET_AGENDA_DETAIL: 'STUDENT_GET_AGENDA_DETAIL',
  STUDENT_GET_AGENDA_DETAIL_FAILED: 'STUDENT_GET_AGENDA_DETAIL_FAILED',
  STUDENT_GET_AGENDA_DETAIL_SUCCESS: 'STUDENT_GET_AGENDA_DETAIL_SUCCESS',

  EDIT_AGENDA_DETAIL: 'EDIT_AGENDA_DETAIL',
  EDIT_AGENDA_DETAIL_FAILED: 'EDIT_AGENDA_DETAIL_FAILED',
  EDIT_AGENDA_DETAIL_SUCCESS: 'EDIT_AGENDA_DETAIL_SUCCESS',

  MARK_AGENDA_ACTIVITY_COMPLETE: 'MARK_AGENDA_ACTIVITY_COMPLETE',
  MARK_AGENDA_ACTIVITY_COMPLETE_FAILED: 'MARK_AGENDA_ACTIVITY_COMPLETE_FAILED',
  MARK_AGENDA_ACTIVITY_COMPLETE_SUCCESS:
    'MARK_AGENDA_ACTIVITY_COMPLETE_SUCCESS',
};

export const END_POINT = {
  get_agenda_list: {
    url: (orgId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/agendas?${objectToParams(urlParams)}`,
    method: 'GET',
  },

  get_agenda_detail: {
    url: (orgId, agendaId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/agendas/${agendaId}?${objectToParams(
        urlParams
      )}`,
    method: 'GET',
  },

  student_get_agenda_detail: {
    url: (orgId, courseId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/courses/${courseId}/agendas?${objectToParams(
        urlParams
      )}`,
    method: 'GET',
  },

  edit_agenda_detail: {
    url: (orgId, agendaId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/agendas/${agendaId}`,
    method: 'PUT',
  },

  mark_agenda_activity_complete: {
    url: (orgId, id) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/agenda-items/${id}`,
    method: 'PUT',
  },
};

export const AGENDA_ACTIVITY_TYPE = {
  ASSIGNMENT: 1,
  PARTICIPATION: 2,
  QUIZ: 3,
  LESSON: 0,
  ATTENDANCE: -1,
  ADJOURN: 5,
};
