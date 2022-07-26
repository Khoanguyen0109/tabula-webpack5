export const USER_STATUS = {
  PENDING: 0,
  ACTIVE: 1,
  RESET_PWD: -1,
  SUSPEND: -2,
  CHANGE_EMAIL: -3,
  EXPIRED: -4
};

export const USER_BEHAVIOR = {
  HAVE_SET_UP_PROFILE: 'have_set_up_profile',
  HAVE_ACCESSED_SET_UP_REQUIRED: 'have_accessed_set_up_required',
  HAVE_ACCESSED_COURSE_LIST: 'have_accessed_course_list',
  HAVE_FINISHED_SET_UP_COURSE: 'have_finished_set_up_course',
  HAVE_ACCESSED_COURSE: 'have_access_course',
  HAVE_CREATED_ASSIGNMENT: 'have_created_assignment',
  HAVE_CREATED_LESSON: 'have_created_lesson',
  HAVE_CREATED_POP_QUIZ: 'have_created_pop_quiz',
  HAVE_CREATED_ANNOUNCE_QUIZ: 'have_created_announce_quiz',
  HAVE_PLANED: 'have_planed',
};