export const ROUTE_MY_COURSES = {
    DEFAULT: '/my-courses',
    MY_COURSES_DETAIL: (courseID) => `/my-courses/${ courseID}`,
    MY_COURSES_GUARDIAN: (studentID) => `/my-courses/guardian/${ studentID}`,
    MY_COURSES_GUARDIAN_NO_STUDENT: () => '/my-courses/guardian',
    MY_COURSES_DETAIL_GUARDIAN: (studentID, courseID) => `/my-courses/guardian/${studentID}/course/${courseID}`,
    MY_COURSES_DETAIL_GUARDIAN_NO_STUDENT: (courseID) => `/my-courses/guardian/course/${courseID}`
};
