import { objectToParams } from 'utils';

export default {
  mc_get_column_grade_book: {
    url: (id, courseId) =>
      `${process.env.REACT_APP_API_URL}/organization/${id}/courses/${courseId}?attribute=gradeWeight`,
    method: 'GET',
  },
  mc_get_grade_book: {
    url: (courseId, termId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/grade-book/teacher/term/${termId}/course/${courseId}/students?${objectToParams(
        urlParams
      )}`,
    method: 'GET',
  },
  mc_grade_book_edit_submission_status: {
    url: (courseId, submissionId) =>
      `${process.env.REACT_APP_API_URL}/grade-book/teacher/course/${courseId}/student-progress/status/${submissionId}`,
    method: 'PUT',
  },
  mc_input_overall_grade: {
    method: 'POST',
    url: (courseId, shadowAssignmentId, progressId) =>
      `${process.env.REACT_APP_API_URL}/grader/teacher/courses/${courseId}/shadow-assignments/${shadowAssignmentId}/student-submissions/${progressId}`,
  },
  mc_input_overall_grade_test: {
    method: 'POST',
    url: (courseId, shadowQuizId, quizSubmissionId) =>
      `${process.env.REACT_APP_API_URL}/grader/quiz/teacher/courses/${courseId}/shadow-quiz/${shadowQuizId}/quiz-submissions/${quizSubmissionId}`,
  },
  get_grader_detail: {
    method: 'GET',
    url: (orgId, courseId, shadowId, studentId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/shadow-assignments/${shadowId}/student-submissions/${studentId}`,
  },
  get_quiz_grader_detail: {
    method: 'GET',
    url: (orgId, courseId, shadowId, studentId) =>
      `${process.env.REACT_APP_API_URL}/organizations/courses/${courseId}/shadow-quiz/${shadowId}/quiz-submissions/${studentId}`,
  },
  create_quiz_attempt: {
    method: 'POST',
    url: ( courseId, shadowId, studentId) =>
    `${process.env.REACT_APP_API_URL}/organizations/courses/${courseId}/shadow-quiz/${shadowId}/quiz-submissions/${studentId}/attempts`,
  }, 
  input_grade_quiz_attempt: {
    method: 'PUT',
    url: ( courseId, shadowId, studentId , attemptId) =>
      `${process.env.REACT_APP_API_URL}/grader/teacher/courses/${courseId}/shadow-quiz/${shadowId}/quiz-submissions/${studentId}/attempts/${attemptId}`,
  },
  remove_quiz_attempt: {
    method: 'DELETE',
    url: ( courseId, shadowId, studentId , attemptId) =>
      `${process.env.REACT_APP_API_URL}/organizations/courses/${courseId}/shadow-quiz/${shadowId}/quiz-submissions/${studentId}/attempts/${attemptId}`,
  },
  mc_input_student_participation: {
    method: 'PUT',
    url: (courseId, termId) =>
      `${process.env.REACT_APP_API_URL}/grader/teacher/${courseId}/terms/${termId}/participations`,
  },
  mc_calculate_overall_course_grade: {
    method: 'PUT',
    url: (courseId, termId) => `${process.env.REACT_APP_API_URL}/grader/teacher/overallCourseGrade/courses/${courseId}/terms/${termId}`
  },
  mc_get_release_grade_of_grade_book: {
    method: 'GET',
    url: (courseId, termId , urlParams) => `${process.env.REACT_APP_API_URL}/grade-book/teacher/term/${termId}/course/${courseId}/release?${objectToParams(urlParams)}`
  },
};
