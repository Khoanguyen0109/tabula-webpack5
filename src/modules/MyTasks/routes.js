import withReducer from 'components/TblWithReducer';

import { GuardianMW } from 'utils/middlewareRoute';
import { GUARDIAN, STUDENT, isGuardian } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_myTasks.svg';

import { EmptyStudentPage, ForbiddenPage } from './components/ErrorPage';
import { ROUTE_TASKS } from './constantsRoute';
import reducer from './reducers';

const ViewMyTask = loadable(() => import('./containers'));
const ScheduleTask = loadable(() => import('./containers/ScheduleTask'));
const RescheduleTask = loadable(() => import('./containers/RescheduleTask'));

const UnscheduledTaskDetails = loadable(() =>
  import('./containers/ViewDetails/UnscheduledTaskDetails')
);
const ScheduledTaskDetails = loadable(() =>
  import('./containers/ViewDetails/ScheduledTaskDetails')
);
const CompletedTaskDetails = loadable(() =>
  import('./containers/ViewDetails/CompletedTaskDetails')
);
const TaskInProgress = loadable(() =>
  import('./containers/ViewDetails/TaskInProgress')
);

// const { EmptyStudentPage, ForbiddenPage } = loadable(() => import('./components/ErrorPage'));

export default [
  {
    path: ROUTE_TASKS.DEFAULT,
    component: withReducer('MyTasks', reducer)(ViewMyTask),
    private: true,
    exact: true,
    menu: {
      title: 'My Tasks',
      group: 'noname',
      icon: IcnMenu,
      order: 1,
    },
    roles: [STUDENT],
  },
  {
    path: ROUTE_TASKS.SCHEDULE_TASK(':taskId'),
    component: withReducer('MyTasks', reducer)(ScheduleTask),
    private: true,
    exact: true,
    roles: [STUDENT],
  },
  {
    path: ROUTE_TASKS.RESCHEDULE_TASK(':taskId'),
    component: withReducer('MyTasks', reducer)(RescheduleTask),
    private: true,
    exact: true,
    roles: [STUDENT],
  },
  {
    path: ROUTE_TASKS.SCHEDULE_TASK_DETAILS(':taskId'),
    component: withReducer('MyTasks', reducer)(ScheduledTaskDetails),
    private: true,
    exact: true,
    roles: [STUDENT],
  },
  {
    path: ROUTE_TASKS.UNSCHEDULE_TASK_DETAILS(':taskId'),
    component: withReducer('MyTasks', reducer)(UnscheduledTaskDetails),
    private: true,
    exact: true,
    roles: [STUDENT],
  },
  {
    path: ROUTE_TASKS.TASK_IN_PROGRESS(':taskId'),
    component: withReducer('MyTasks', reducer)(TaskInProgress),
    private: true,
    exact: true,
    roles: [STUDENT],
  },
  {
    path: ROUTE_TASKS.COMPLETED_TASK_DETAILS(':taskId'),
    component: withReducer('MyTasks', reducer)(CompletedTaskDetails),
    private: true,
    exact: true,
    roles: [STUDENT],
  },
  {
    path: [
      ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(':studentId'),
      ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS_NO_STUDENT(),
    ],
    component: withReducer(
      'MyTasks',
      reducer
    )(
      GuardianMW(
        {
          defaultPath: ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(':studentId'),
          defaultRedirect: (studentId) =>
            ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(studentId),
          DefaultComponent: ViewMyTask,
        },
        {
          errorPath: ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS_NO_STUDENT(),
          errorRedirect: () =>
            ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS_NO_STUDENT(),
          ErrorComponent: EmptyStudentPage,
        }
      )
    ),
    roles: [GUARDIAN],
    menu: {
      title: 'Tasks',
      group: 'noname',
      icon: IcnMenu,
      order: 1,
    },
    exact: true,
    private: true,
    getSelectedPath: (context) => {
      if (isGuardian(context?.currentUser)) {
        if (!!context?.currentStudentId) {
          return ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(context.currentStudentId);
        }
        return ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS_NO_STUDENT();
      }
      return ROUTE_TASKS.DEFAULT;
    },
  },
  {
    path: [
      ROUTE_TASKS.GUARDIAN_VIEW_UNSCHEDULE_TASK_DETAILS(
        ':taskId',
        ':studentId'
      ),
      ROUTE_TASKS.GUARDIAN_VIEW_UNSCHEDULE_TASK_DETAILS_NO_STUDENT(':taskId'),
    ],
    component: withReducer(
      'MyTasks',
      reducer
    )(
      GuardianMW(
        {
          defaultPath: ROUTE_TASKS.GUARDIAN_VIEW_UNSCHEDULE_TASK_DETAILS(
            ':taskId',
            ':studentId'
          ),
          defaultRedirect: (studentId, params) =>
            ROUTE_TASKS.GUARDIAN_VIEW_UNSCHEDULE_TASK_DETAILS(
              params?.taskId,
              studentId
            ),
          DefaultComponent: UnscheduledTaskDetails,
        },
        {
          errorPath:
            ROUTE_TASKS.GUARDIAN_VIEW_UNSCHEDULE_TASK_DETAILS_NO_STUDENT(
              ':taskId'
            ),
          errorRedirect: null,
          ErrorComponent: ForbiddenPage,
        }
      )
    ),
    private: true,
    exact: true,
    roles: [GUARDIAN],
  },
  {
    path: [
      ROUTE_TASKS.GUARDIAN_VIEW_SCHEDULE_TASK_DETAILS(':taskId', ':studentId'),
      ROUTE_TASKS.GUARDIAN_VIEW_SCHEDULE_TASK_DETAILS_NO_STUDENT(':taskId'),
    ],
    component: withReducer(
      'MyTasks',
      reducer
    )(
      GuardianMW(
        {
          defaultPath: ROUTE_TASKS.GUARDIAN_VIEW_SCHEDULE_TASK_DETAILS(
            ':taskId',
            ':studentId'
          ),
          defaultRedirect: (studentId, params) =>
            ROUTE_TASKS.GUARDIAN_VIEW_SCHEDULE_TASK_DETAILS(
              params?.taskId,
              studentId
            ),
          DefaultComponent: ScheduledTaskDetails,
        },
        {
          errorPath:
            ROUTE_TASKS.GUARDIAN_VIEW_SCHEDULE_TASK_DETAILS_NO_STUDENT(
              ':taskId'
            ),
          errorRedirect: null,
          ErrorComponent: ForbiddenPage,
        }
      )
    ),
    private: true,
    exact: true,
    roles: [GUARDIAN],
  },
  {
    path: [
      ROUTE_TASKS.GUARDIAN_VIEW_COMPLETED_TASK_DETAILS(':taskId', ':studentId'),
      ROUTE_TASKS.GUARDIAN_VIEW_COMPLETED_TASK_DETAILS_NO_STUDENT(':taskId'),
    ],
    component: withReducer(
      'MyTasks',
      reducer
    )(
      GuardianMW(
        {
          defaultPath: ROUTE_TASKS.GUARDIAN_VIEW_COMPLETED_TASK_DETAILS(
            ':taskId',
            ':studentId'
          ),
          defaultRedirect: (studentId, params) =>
            ROUTE_TASKS.GUARDIAN_VIEW_COMPLETED_TASK_DETAILS(
              params?.taskId,
              studentId
            ),
          DefaultComponent: CompletedTaskDetails,
        },
        {
          errorPath:
            ROUTE_TASKS.GUARDIAN_VIEW_COMPLETED_TASK_DETAILS_NO_STUDENT(
              ':taskId'
            ),
          errorRedirect: null,
          ErrorComponent: ForbiddenPage,
        }
      )
    ),
    private: true,
    exact: true,
    roles: [GUARDIAN],
  },
];
