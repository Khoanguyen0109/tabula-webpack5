const GUARDIAN = 'Guardian';

const STUDENT = 'Student';

const TEACHER = 'Teacher';

const COURSE_MANAGER = 'Course Manager';

const USER_MANAGER = 'User Manager';

const SCHOOL_MANAGER = 'School Manager';

const OWNER = 'Owner';

const DOMAIN_OWNER = 'Domain Owner';

const STUDENT_ASSIST_MANAGER = 'Student Assist Manager';

const isStudent = (currentUser = {}) => currentUser?.roles?.find(({ roleName }) => roleName === STUDENT);

const isTeacher = (currentUser = {}) => currentUser?.roles?.find(({ roleName }) => roleName === TEACHER);

const isGuardian = (currentUser = {}) => currentUser?.roles?.find(({ roleName }) => roleName === GUARDIAN);

const COURSE_ROLE = {
  TEACHER: 'Teacher',
  TEACHING_ASSISTANT: 'Teaching Assistant',
  STUDENT: 'Student',
  GUARDIAN: 'Guardian'
};

export {
  GUARDIAN,
  STUDENT,
  TEACHER,
  COURSE_MANAGER,
  USER_MANAGER,
  SCHOOL_MANAGER,
  OWNER,
  DOMAIN_OWNER,
  STUDENT_ASSIST_MANAGER,
  COURSE_ROLE,
  isStudent, isTeacher, isGuardian
};
