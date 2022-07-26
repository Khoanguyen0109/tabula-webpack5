/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router';

import isEqual from 'lodash/isEqual';

import { isStudent } from 'utils/roles';

import PropTypes from 'prop-types';

import ScheduledTasks from '../List/Do';
import CompletedTasks from '../List/Done';
import UnscheduledTasks from '../List/Schedule';

const TabContent = React.memo(
  ({
    history,
    location,
    match,
    currentUser,

    isFetchingScheduled,
    scheduledTasks,
    getScheduledTasks,
    startTimeBlock,

    isFetchingUnscheduled,
    unscheduledTasks,
    getUnscheduledTasks,

    isFetchingCompleted,
    completedTasks,
    totalCompletedTasks,
    getCompletedTasks,

    isFetchingDeleteTimeBlock,
    deleteTimeBlock,

    taskJustScheduled,
    taskJustCompleted,

    setSortUnscheduled,
    setSortScheduled,
    setSortCompleted,
    setPagingCompleted,
    resetMyTasksReducer,

    schoolYearSelected,
    sortScheduled,
    sortUnscheduled,
    sortCompleted,
    pagingCompleted,
    currentTab,
  }) => {
    const authProps = {
      match,
      history,
      location,
      currentUser,
      schoolYearSelected,
      resetMyTasksReducer,
    };
    const isStudentRole = !!isStudent(currentUser);

    switch (currentTab) {
      case 0:
        return (
          <UnscheduledTasks
            {...authProps}
            isFetchingUnscheduled={isFetchingUnscheduled}
            unscheduledTasks={unscheduledTasks}
            currentSort={sortUnscheduled}
            getUnscheduledTasks={getUnscheduledTasks}
            setSort={setSortUnscheduled}
            isStudentRole={isStudentRole}
          />
        );
      case 1:
        return (
          <ScheduledTasks
            {...authProps}
            isFetchingDeleteTimeBlock={isFetchingDeleteTimeBlock}
            deleteTimeBlock={deleteTimeBlock}
            isFetchingScheduled={isFetchingScheduled}
            scheduledTasks={scheduledTasks}
            currentSort={sortScheduled}
            taskJustScheduled={taskJustScheduled}
            startTimeBlock={startTimeBlock}
            getScheduledTasks={getScheduledTasks}
            setSort={setSortScheduled}
            isStudentRole={isStudentRole}
          />
        );
      case 2:
        return (
          <CompletedTasks
            {...authProps}
            isFetchingCompleted={isFetchingCompleted}
            completedTasks={completedTasks}
            totalCompletedTasks={totalCompletedTasks}
            currentSort={sortCompleted}
            paging={pagingCompleted}
            getCompletedTasks={getCompletedTasks}
            setSort={setSortCompleted}
            setPaging={setPagingCompleted}
            taskJustCompleted={taskJustCompleted}
            isStudentRole={isStudentRole}
          />
        );
      default:
        return null;
    }
  },
  isEqual
);

TabContent.propTypes = {
  t: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  currentUser: PropTypes.object,

  isFetchingScheduled: PropTypes.bool,
  scheduledTasks: PropTypes.array,
  getScheduledTasks: PropTypes.func,
  startTimeBlock: PropTypes.func,

  isFetchingUnscheduled: PropTypes.bool,
  unscheduledTasks: PropTypes.array,
  getUnscheduledTasks: PropTypes.func,

  isFetchingCompleted: PropTypes.bool,
  completedTasks: PropTypes.array,
  totalCompletedTasks: PropTypes.number,
  getCompletedTasks: PropTypes.func,

  isFetchingDeleteTimeBlock: PropTypes.bool,
  deleteTimeBlock: PropTypes.func,

  resetMyTasksReducer: PropTypes.func,
  taskJustScheduled: PropTypes.array,
  taskJustCompleted: PropTypes.array,

  setSortUnscheduled: PropTypes.func,
  setSortScheduled: PropTypes.func,
  setSortCompleted: PropTypes.func,
  setPagingCompleted: PropTypes.func,

  schoolYearSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sortScheduled: PropTypes.object,
  sortUnscheduled: PropTypes.object,
  sortCompleted: PropTypes.object,
  pagingCompleted: PropTypes.object,
  currentTab: PropTypes.number,
};

export default withRouter(TabContent);
