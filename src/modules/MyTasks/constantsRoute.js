const ROUTE_TASKS = {
  DEFAULT: '/my-tasks',
  SCHEDULE_TASK: (id) => `/my-tasks/schedule-task/${id}`,
  RESCHEDULE_TASK: (id) => `/my-tasks/reschedule-task/${id}`,
  UNSCHEDULE_TASK_DETAILS: (taskId) => `/my-tasks/unschedule-task-details/${taskId}`,
  SCHEDULE_TASK_DETAILS: (taskId) => `/my-tasks/schedule-task-details/${taskId}`,
  TASK_IN_PROGRESS: (taskId) => `/my-tasks/task-in-progress/${taskId}`,
  COMPLETED_TASK_DETAILS: (taskId) => `/my-tasks/completed-task-details/${taskId}`,

  GUARDIAN_VIEW_MY_TASKS: (studentId) => `/my-tasks/guardian/${studentId}`,
  GUARDIAN_VIEW_MY_TASKS_NO_STUDENT: () => '/my-tasks/guardian',

  GUARDIAN_VIEW_UNSCHEDULE_TASK_DETAILS: (taskId, studentId) => `/my-tasks/guardian/${studentId}/unschedule-task-details/${taskId}`,
  GUARDIAN_VIEW_UNSCHEDULE_TASK_DETAILS_NO_STUDENT: (taskId) => `/my-tasks/guardian/unschedule-task-details/${taskId}`,

  GUARDIAN_VIEW_SCHEDULE_TASK_DETAILS: (taskId, studentId) => `/my-tasks/guardian/${studentId}/schedule-task-details/${taskId}`,
  GUARDIAN_VIEW_SCHEDULE_TASK_DETAILS_NO_STUDENT: (taskId) => `/my-tasks/guardian/schedule-task-details/${taskId}`,

  GUARDIAN_VIEW_COMPLETED_TASK_DETAILS: (taskId, studentId) => `/my-tasks/guardian/${studentId}/completed-task-details/${taskId}`,
  GUARDIAN_VIEW_COMPLETED_TASK_DETAILS_NO_STUDENT: (taskId) => `/my-tasks/guardian/completed-task-details/${taskId}`,
};

export { ROUTE_TASKS };