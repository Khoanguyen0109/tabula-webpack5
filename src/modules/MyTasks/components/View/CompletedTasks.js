/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblButton from 'components/TblButton';

import clsx from 'clsx';
import { handleURLToViewCompletedTaskDetails } from 'modules/MyTasks/utils';
import moment from 'moment';
import PropTypes from 'prop-types';
import { fixedDecimalNumber } from 'utils';

// sub component

import { completedByType, infoByType, taskTimeBlockStatus, turnInStatus } from '../../constants';
import TaskTable from '../TaskTable';

function CompletedTasks({
  t,
  match,
  currentUser,
  isFetchingCompleted,
  completedTasks,
  totalCompletedTasks,
  getCompletedTasks,
  schoolYearSelected,
  setSort,
  currentSort,
  setPaging,
  paging,
  taskJustCompleted,
  resetMyTasksReducer
}) {

  const history = useHistory();

  const { studentId } = match.params;

  const getCompleted = React.useCallback((fieldSort, typeSort, page, limit) => {
    const params = {
      schoolYearId: schoolYearSelected,
      timezone: currentUser?.timezone,
      sort: typeSort || currentSort.typeSort,
      fieldSort: fieldSort || currentSort.fieldSort
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
  }, [schoolYearSelected, currentUser, currentSort]);

  const clearTaskJustCompleted = () => {
    if (taskJustCompleted) {
      resetMyTasksReducer({ taskJustCompleted: null });
    }
  };

  useEffect(() => clearTaskJustCompleted, []);

  // eslint-disable-next-line
  const rowFormat = row => [taskJustCompleted == row.id && 'task-activated'];
  const onSort = (fieldSort, typeSort) => {
    getCompleted(fieldSort, typeSort, paging.page, paging.limit);
    setSort(fieldSort, typeSort);
  };

  const onPaging = (page, limit) => {
    getCompleted(currentSort.fieldSort, currentSort.typeSort, page, limit);
    setPaging(page, limit);
  };

  // const onRetract = row => {
  //   // if (!!studentId) {
  //   //   return;
  //   // }
  //   // getActivityDetails(row);
  // };

  const onViewDetail = (row) => {
    handleURLToViewCompletedTaskDetails(history, row.id, studentId);
  };

  const onExpandCollapse = () => { };

  const tableFormat = [
    {
      xsCol: 6, mdCol: 6, lgCol: 6, xlCol: 6,
      columnStyle: 'taskName',
      headerColumnFormat: 'th-task_and_course',
      bodyColumnFormat: (row) => {
        const { typeLabel } = infoByType(row.type) || {};
        return (
          <Box display='flex' flexDirection='column' width='100%'>
            <Box component='div' display='flex' alignItems='center'>
              {/* <span className={typeIcon} /> */}
              <TblActivityIcon type={row.type} />
              <span>{typeLabel}:</span>
            </Box>
            <Typography component='a' className='text-ellipsis font-weight-semi'>{row.name}</Typography>
            <Typography component='p' className='text-ellipsis'>{row.courseName}</Typography>
          </Box>
        );
      }
    }, {
      xsCol: 2, mdCol: 2, lgCol: 2, xlCol: 2,
      columnStyle: 'columnText',
      headerColumnFormat: 'th-turn_in_status',
      bodyColumnFormat: (row) => t(turnInStatus(row?.turnIn))
    }, {
      xsCol: 2, mdCol: 2, lgCol: 2, xlCol: 2,
      columnStyle: 'columnText',
      sortable: true,
      fieldSort: 'completedBy',
      headerColumnFormat: 'th-complete_by',
      bodyColumnFormat: (row) => {
        const completedBy = completedByType(row.opportunityType, row.type);
        const formatCompletedBy = moment(row.completedBy);
        return (
          <Box component='div' display='flex' flexDirection='column'>
            <span>{t(completedBy)}:</span>
            <Box component='div' display='flex' flexWrap='wrap' className='font-weight-semi'>
              <span>{formatCompletedBy.format('ddd, MMM DD, YYYY')}</span>
              <Box component='span' ml={0.5} mr={0.5}>-</Box>
              <span>{formatCompletedBy.format('h:mm a')}</span>
            </Box>
          </Box>
        );
      }
    }, {
      xsCol: 1, mdCol: 1, lgCol: 1, xlCol: 1,
      columnStyle: 'columnIcon',
      bodyColumnFormat: (row) => 
        // if (!!studentId) {
        //   return;
        // }
         (
          <Box component='div' bgcolor='white'>
            <TblButton
              variant='outlined'
              color='primary'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onViewDetail(row);
              }}
            >
              {t('btn-view-details')}
            </TblButton>
          </Box>
        )
      
    },
    {
      xsCol: 1, mdCol: 1, lgCol: 1, xlCol: 1,
      columnStyle: 'columnIcon',
      bodyColumnFormat: (row, isExpanded) =>
        row?.timeBlocks.length > 0 &&
        <Box component='div' width='100%' display='flex' justifyContent='flex-end' mr={1}>
          <span className={clsx('icon-icn_arrow_left', isExpanded && 'expanded')} />
        </Box>
    }
  ];

  const collapseFormat = [
    {
      xsCol: 3, mdCol: 3, lgCol: 3, xlCol: 3,
      headerColumnFormat: 'myTasks:th-start',
      bodyColumnFormat: (subRow) => {
        const startTime = moment(subRow.startTime);
        return (
          <Box component='div' display='flex' flexWrap='wrap'>
            <span>{startTime.format('ddd, MMM DD, YYYY')}</span>
            <Box component='span' ml={0.5} mr={0.5}>-</Box>
            <span>{startTime.format('hh:mm a')}</span>
          </Box>
        );
      }
    }, {
      xsCol: 3, mdCol: 3, lgCol: 3, xlCol: 3,
      headerColumnFormat: 'myTasks:th-end',
      bodyColumnFormat: (subRow) => {
        const endTime = moment(subRow.endTime);
        return (
          <Box component='div' display='flex' flexWrap='wrap'>
            <span>{endTime.format('ddd, MMM DD, YYYY')}</span>
            <Box component='span' ml={0.5} mr={0.5}>-</Box>
            <span>{endTime.format('hh:mm a')}</span>
          </Box>
        );
      }
    }, {
      xsCol: 2, mdCol: 2, lgCol: 2, xlCol: 2,
      headerColumnFormat: 'myTasks:th-scheduled',
      bodyColumnFormat: (subRow) => `${fixedDecimalNumber(subRow?.duration)} ${subRow?.duration !== 1 ? 'mins' : 'min'}`
    }, {
      xsCol: 4, mdCol: 4, lgCol: 4, xlCol: 4,
      headerColumnFormat: 'myTasks:th-time_block_status',
      bodyColumnFormat: (subRow) => t(taskTimeBlockStatus(subRow?.status))
    }
  ];

  return useMemo(() => (
    <TaskTable
      sortInfo={{
        defaultSort: {
          fieldSort: currentSort.fieldSort,
          typeSort: currentSort.typeSort
        },
        onSort
      }}
      taskList={completedTasks}
      tableHeader={false}
      tableFormat={tableFormat}
      rowSettings={{
        tags: {
          visible: true,
          format: null
        },
        showTags: true,
        format: rowFormat,
        onClick: null
      }}
      rowCollapseSettings={{
        visibleCollapse: true,
        visibleCollapseByRow: (row) => row?.timeBlocks?.length,
        list: (row) => row?.timeBlocks || [],
        format: collapseFormat,
        onExpand: onExpandCollapse
      }}
      skeletons={completedTasks.length || 3}
      isLoading={isFetchingCompleted}
      pagination={{
        visible: true,
        onPaging,
        total: totalCompletedTasks,
        defaultPaging: {
          page: paging.page,
          limit: paging.limit
        }
      }}
    />
  ), [completedTasks]);
}

CompletedTasks.propTypes = {
  t: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
  currentUser: PropTypes.object,
  isFetchingCompleted: PropTypes.bool,
  completedTasks: PropTypes.array,
  totalCompletedTasks: PropTypes.number,
  getCompletedTasks: PropTypes.func,
  schoolYearSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setSort: PropTypes.func,
  currentSort: PropTypes.object,
  paging: PropTypes.object,
  getActivityDetails: PropTypes.func,
  taskJustCompleted: PropTypes.array
};

export default withTranslation(['myTasks', 'common'])(CompletedTasks);