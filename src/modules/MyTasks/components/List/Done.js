import React, { useCallback, useEffect, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/styles';

import TblButton from 'components/TblButton';

import { turnInStatusLabel } from 'modules/MyTasks/constants';
import { handleURLToViewCompletedTaskDetails } from 'modules/MyTasks/utils';
import PropTypes from 'prop-types';

import TaskTags from '../TaskTags';

import TaskList from './TaskList';
Done.propTypes = {
  t: PropTypes.func,
  match: PropTypes.object,
  currentUser: PropTypes.object,
  isFetchingCompleted: PropTypes.bool,
  completedTasks: PropTypes.array,
  totalCompletedTasks: PropTypes.number,
  getCompletedTasks: PropTypes.func,
  schoolYearSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  currentSort: PropTypes.object,
  paging: PropTypes.object,
  setPaging: PropTypes.func,
  taskJustCompleted: PropTypes.array,
  resetMyTasksReducer: PropTypes.func,
};
function Done({
  t,
  match,
  currentUser,
  isFetchingCompleted,
  completedTasks,
  totalCompletedTasks,
  getCompletedTasks,
  schoolYearSelected,
  currentSort,
  setPaging,
  paging,
  taskJustCompleted,
  resetMyTasksReducer,
}) {
  const history = useHistory();
  const theme = useTheme();

  const { studentId } = match.params;

  const getCompleted = useCallback(
    (fieldSort, typeSort, page, limit) => {
      const params = {
        schoolYearId: schoolYearSelected,
        timezone: currentUser?.timezone,
        sort: typeSort || currentSort.typeSort,
        fieldSort: fieldSort || currentSort.fieldSort,
      };
      if (!!studentId) {
        params.studentId = studentId;
      }
      if (!!page) {
        params.page = page;
      }
      if (!!limit) {
        params.limit = limit;
      }
      getCompletedTasks({
        orgId: currentUser?.organizationId,
        params,
        // completedTasks: [],
        // isFetchingCompleted
      });
    },
    [
      schoolYearSelected,
      currentUser.timezone,
      currentUser.organizationId,
      currentSort.typeSort,
      currentSort.fieldSort,
      studentId,
      getCompletedTasks,
    ]
  );

  const clearTaskJustCompleted = useCallback(() => {
    if (taskJustCompleted) {
      resetMyTasksReducer({ taskJustCompleted: null });
    }
  }, [resetMyTasksReducer, taskJustCompleted]);

  useEffect(() => clearTaskJustCompleted, [clearTaskJustCompleted]);

  const onPaging = useCallback(
    (page, limit) => {
      getCompleted(currentSort.fieldSort, currentSort.typeSort, page, limit);
      setPaging(page, limit);
    },
    [currentSort.fieldSort, currentSort.typeSort, getCompleted, setPaging]
  );

  const onViewDetail = useCallback(
    (row) => {
      handleURLToViewCompletedTaskDetails(history, row.id, studentId);
    },
    [history, studentId]
  );

  return useMemo(
    () => (
      <TaskList
        t={t}
        data={completedTasks}
        activeCollapId={taskJustCompleted}
        subTitleEmptyContent={t('empty_done_content')}
        showBorder={false}
        isLoading={isFetchingCompleted}
        pagination={{
          visible: true,
          onPaging,
          total: totalCompletedTasks,
          defaultPaging: {
            page: paging.page,
            limit: paging.limit,
          },
        }}
        getButtons={(task) => [
          <TblButton
            variant='outlined'
            color='primary'
            onClick={() => onViewDetail(task)}
          >
            View Details{' '}
          </TblButton>,
        ]}
        getTaskLabel={(task) => {
          const taskInfo = turnInStatusLabel(task?.turnIn);
          const { label, IconComponent, color } = taskInfo;
          if (isEmpty(taskInfo)) {
            return <></>;
          }
          return (
            <Typography
              variant='bodySmall'
              display='flex'
              alignItems='center'
              className='task-label'
              style={{
                backgroundColor: theme.openColors[color][0],
              }}
            >
              <IconComponent />
              <span>{t(label)}</span>
            </Typography>
          );
        }}
        getTags={(task) =>
          task?.opportunityType?.length
            ? [<TaskTags opportunities={task.opportunityType} t={t} />]
            : []
        }
      />
    ),
    [
      completedTasks,
      isFetchingCompleted,
      onPaging,
      onViewDetail,
      paging.limit,
      paging.page,
      t,
      taskJustCompleted,
      theme.openColors,
      totalCompletedTasks,
    ]
  );
}

export default withTranslation(['myTasks', 'common'])(Done);
