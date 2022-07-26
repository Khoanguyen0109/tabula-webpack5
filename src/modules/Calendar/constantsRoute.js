export const ROUTE_CALENDAR = {
    DEFAULT: '/calendar',
    CALENDAR_GUARDIAN: (studentID) => `/calendar/guardian/${ studentID}`,
    CALENDAR_GUARDIAN_NO_STUDENT: () => '/calendar/guardian'
};
