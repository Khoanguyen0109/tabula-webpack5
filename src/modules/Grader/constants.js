import { TEACHER } from 'utils/roles';

import { objectToParams } from 'utils';

export const ROLE_CAN_GRADER = [TEACHER];

export const actions = {
    GET_BASIC_INFO: 'GET_BASIC_INFO',
    GET_BASIC_INFO_SUCCESS: 'GET_BASIC_INFO_SUCCESS',
    GET_BASIC_INFO_FAILED: 'GET_BASIC_INFO_FAILED',
    GET_TO_GRADE_LIST: 'GET_TO_GRADE_LIST',
    GET_TO_GRADE_LIST_SUCCESS: 'GET_TO_GRADE_LIST_SUCCESS',
    GET_TO_GRADE_LIST_FAILED: 'GET_TO_GRADE_LIST_FAILED',

    GET_PERMISSION_COURSE: 'GET_PERMISSION_COURSE',
    GET_PERMISSION_COURSE_SUCCESS: 'GET_PERMISSION_COURSE_SUCCESS',
    GET_PERMISSION_COURSE_FAILED: 'GET_PERMISSION_COURSE_FAILED',

    GET_ACTIVITIES_IN_GRADER: 'GET_ACTIVITIES_IN_GRADER',
    GET_ACTIVITIES_IN_GRADER_SUCCESS: 'GET_ACTIVITIES_IN_GRADER_SUCCESS',
    GET_ACTIVITIES_IN_GRADER_FAILED: 'GET_ACTIVITIES_IN_GRADER_FAILED',

    GET_SECTIONS_BY_ACTIVITY_GRADER: 'GET_SECTIONS_BY_ACTIVITY_GRADER',
    GET_SECTIONS_BY_ACTIVITY_GRADER_SUCCESS: 'GET_SECTIONS_BY_ACTIVITY_GRADER_SUCCESS',
    GET_SECTIONS_BY_ACTIVITY_GRADER_FAILED: 'GET_SECTIONS_BY_ACTIVITY_GRADER_FAILED',

    GET_GRADING_LIST: 'GET_GRADING_LIST',
    GET_GRADING_LIST_SUCCESS: 'GET_GRADING_LIST_SUCCESS',
    GET_GRADING_LIST_FAILED: 'GET_GRADING_LIST_FAILED',

    GET_TOTAL_GRADED: 'GET_TOTAL_GRADED',
    GET_TOTAL_GRADED_SUCCESS: 'GET_TOTAL_GRADED_SUCCESS',
    GET_TOTAL_GRADED_FAILED: 'GET_TOTAL_GRADED_FAILED',
    
    GET_GRADER_DETAIL: 'GET_GRADER_DETAIL',
    GET_GRADER_DETAIL_SUCCESS: 'GET_GRADER_DETAIL_SUCCESS',
    GET_GRADER_DETAIL_FAILED: 'GET_GRADER_DETAIL_FAILED',

    GRADER_SET_STATE: 'GRADER_SET_STATE',
    GRADER_RESET_STATE: 'GRADER_RESET_STATE',
    INPUT_GRADE: 'INPUT_GRADE',
    INOUT_GRADE_SUCCESS: 'INOUT_GRADE_SUCCESS',
    INPUT_OVERALL_GRADE: 'INPUT_OVERALL_GRADE'
};

export const END_POINT = {
    get_to_grade_list: {
        method: 'GET',
        url: (orgId ) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/grader/grade-list`
    },
    get_activities_in_grader: {
        method: 'GET',
        url: (orgId, courseId ) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/grader/activities`

    },
    get_sections_by_activity_grader: {
        method: 'GET',
        url: (orgId, courseId , activityId ) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/grader/activities/${activityId}/sections`
    },
    get_total_graded: {
        method: 'GET',
        url: (orgId, courseId, assignmentId, urlParams) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/assignments/${assignmentId}/grader/total-graded?${objectToParams(urlParams)}`

    },
    get_grading_list: {
        method: 'GET',
        url: (orgId, courseId, assignmentId, urlParams) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/assignments/${assignmentId}/student-submissions?${objectToParams(urlParams)}`
    },

    get_grader_detail: {
        method: 'GET',
        url: (orgId, courseId, shadowId, studentId) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-assignments/${shadowId}/student-submissions/${studentId}`  
    },

    input_grade: {
        method: 'POST',
        url: (courseId, shadowAssignmentId, progressId, submissionAttemptId) => `${process.env.REACT_APP_API_URL}/grader/teacher/courses/${courseId}/shadow-assignments/${shadowAssignmentId}/student-submissions/${progressId}/submission-attemps/${submissionAttemptId}`
    },
    get_attempt_detail: {
        method: 'GET',
        url: (orgId, courseId, shadowId, studentId) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-assignments/${shadowId}/student-submissions/${studentId}`
    },
    input_overall_grade: {
        method: 'POST',
        url: (courseId, shadowAssignmentId, progressId) => `${process.env.REACT_APP_API_URL}/grader/teacher/courses/${courseId}/shadow-assignments/${shadowAssignmentId}/student-submissions/${progressId}`
    }
};
