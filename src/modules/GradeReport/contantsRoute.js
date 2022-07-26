export const ROUTE_GRADE_REPORT = {
    DEFAULT: '/grade-report',

    GUARDIAN_VIEW_GRADE_REPORT: (studentId) => `/grade-report/guardian/${studentId}`,
    GUARDIAN_VIEW_GRADE_REPORT_NO_STUDENT: () => '/grade-report/guardian',
};
