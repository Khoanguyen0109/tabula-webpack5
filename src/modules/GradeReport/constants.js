import { objectToParams } from 'utils';

export const actions = {
  GET_GRADE_REPORT: 'GET_GRADE_REPORT',
  GET_GRADE_REPORT_SUCCESS: 'GET_GRADE_REPORT_SUCCESS',
  GET_GRADE_REPORT_FAILED: 'GET_GRADE_REPORT_FAILED',

  GET_GRADE_REPORT_ASSIGNMENT_DETAIL: 'GET_GRADE_REPORT_ASSIGNMENT_DETAIL',
  GET_GRADE_REPORT_ASSIGNMENT_DETAIL_SUCCESS: 'GET_GRADE_REPORT_ASSIGNMENT_DETAIL_SUCCESS',
  GET_GRADE_REPORT_ASSIGNMENT_DETAIL_FAILED: 'GET_GRADE_REPORT_ASSIGNMENT_DETAIL_FAILED',

  GET_GRADE_REPORT_QUIZ_DETAIL: 'GET_GRADE_REPORT_QUIZ_DETAIL',
  GET_GRADE_REPORT_QUIZ_DETAIL_SUCCESS: 'GET_GRADE_REPORT_QUIZ_DETAIL_SUCCESS',
  GET_GRADE_REPORT_QUIZ_DETAIL_FAILED: 'GET_GRADE_REPORT_ASSIGNMENT_DETAIL_FAILED',

  GRADE_REPORT_SET_STATE: 'GRADE_REPORT_SET_STATE',

  GRADE_REPORT_RESET_STATE: 'GRADE_REPORT_RESET_STATE'
};
const api = process.env.REACT_APP_API_URL;
export const END_POINT = {
  get_grade_report: {
    url: ( courseId, termId , urlParams) => `${api}/grade-report/courses/${courseId}/terms/${termId}?${objectToParams(urlParams)}`,
    method: 'GET',
  },
  get_grade_report_assignment_detail: {
    url: ( shadowId , urlParams) => `${api}/grade-report/shadow-assignments/${shadowId}?${objectToParams(urlParams)}`,
    method: 'GET',
  },
  get_grade_report_quiz_detail: {
    url: ( shadowId , urlParams) => `${api}/grade-report/shadow-quizzes/${shadowId}?${objectToParams(urlParams)}`,
    method: 'GET',
  }
};
