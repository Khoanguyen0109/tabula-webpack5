// import { objectToParams } from 'utils';

export const actions = {

  GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN: 'GET_IMPORT_FILE',
  GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_SUCCESS: 'GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_SUCCESS',
  GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_FAILED: 'GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_FAILED',

  GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_PROGRESS: 'GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_PROGRESS',
  GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_PROGRESS_SUCCESS: 'GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_PROGRESS_SUCCESS',
  GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_PROGRESS_FAILED: 'GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_PROGRESS_FAILED',

  IMPORT_SET_STATE: 'IMPORT_SET_STATE'

};

export const END_POINT = {
  get_import_queue_student_and_guardian: {
    url: (orgId) => `${process.env.REACT_APP_API_URL}/organization/${orgId}/import-students`,
    method: 'GET',
  },
  get_import_queue_student_and_guardian_progress: {
    url: (orgId , importKey) => `${process.env.REACT_APP_API_URL}/organization/${orgId}/import-students/${importKey}`,
    method: 'GET',
  },
};
