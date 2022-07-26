/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo } from 'react';
import { withTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblButton from 'components/TblButton';

import clsx from 'clsx';
import { getImportanceLevelInfo, handleURLToSchedulePage, handleURLToViewUnscheduleTaskDetails } from 'modules/MyTasks/utils';
import moment from 'moment';
import PropTypes from 'prop-types';
import { fixedDecimalNumber } from 'utils';

import { completedByType, infoByType, taskTimeBlockStatus } from '../../constants';
import { formatTimeNeeded } from '../../utils';
import TaskTable from '../TaskTable';

import ImportanceIcon from './ImportanceIcon';

function UnscheduledTasks({
  t,
  match,
  history,
  getUnscheduledTasks,
  currentUser,
  isFetchingUnscheduled,
  unscheduledTasks,
  schoolYearSelected,
  setSort,
  currentSort
}) {
  const { studentId } = match.params;

  const onSort = useCallback((fieldSort, typeSort) => {
    setSort(fieldSort, typeSort);
    getUnscheduledList(fieldSort, typeSort);
  }, []);

  const getUnscheduledList = useCallback((fieldSort, typeSort) => {
    const params = {
      schoolYearId: schoolYearSelected,
      timezone: currentUser?.timezone,
      sort: typeSort || currentSort.typeSort,
      fieldSort: fieldSort || currentSort.fieldSort
    };
    if (!!studentId) {
      params.studentId = studentId;
    }
    getUnscheduledTasks({
      orgId: currentUser?.organizationId,
      params,
      // unscheduledTasks: [],
      // isFetchingUnscheduled
    });
  }, [schoolYearSelected]);

  const rowFormat = (row) => {
    const { completedBy, importanceLevel } = row;
    const info = getImportanceLevelInfo(completedBy, importanceLevel);
    // const isCurrentDay = moment().isSame(completedBy, 'day');
    // const isTomorrowDay = moment().add(1, 'd').isSame(completedBy, 'day');
    // return [isCurrentDay ? 'task-urgent' : isTomorrowDay ? 'task-pressing' : 'task-upcoming'];
    return [info?.class];
  };
  // const rowFormat = row => [];

  const onClickRow = () => {
    // setRowSelected(row?.id);
    // console.log(rowSelected);
  };

  const onSchedule = useCallback((row) => {
    handleURLToSchedulePage(history, row?.id, schoolYearSelected);
  }, [schoolYearSelected]);

  const onViewDetail = useCallback((row) => {
    handleURLToViewUnscheduleTaskDetails(history, row.id, studentId);
  }, [studentId]);

  const onExpandCollapse = () => { };

  const tableFormat = [
    {
      xsCol: 3, mdCol: 3, lgCol: 3, xlCol: 3,
      columnStyle: 'taskName',
      headerColumnFormat: 'th-task_and_course',
      bodyColumnFormat: (row) => {
        const { typeLabel } = infoByType(row?.type) || {};
        return (
          <Box display='flex' flexDirection='column' width='100%'>
            <Box component='div' display='flex' alignItems='center'>
              <TblActivityIcon type={row?.type} />
              <span>{typeLabel}:</span>
            </Box>
            <Typography component='a' className='text-ellipsis font-weight-semi'>{row?.name}</Typography>
            <Typography component='p' className='text-ellipsis'>{row?.courseName}</Typography>
          </Box>
        );
      }
    }, {
      xsCol: 2, mdCol: 2, lgCol: 2, xlCol: 2,
      columnStyle: 'columnText',
      headerColumnFormat: 'th-time_needed',
      bodyColumnFormat: (row) =>
        <Typography component='p' className='text-ellipsis'>
          {/* NOTE: Change "timeNeeded" to "originalTimeNeeded" => confirm by Quynh Le */}
          {/* {fixedDecimalNumber(row?.originalTimeNeeded)} {row?.originalTimeNeeded !== 1 ? 'mins' : 'min'} */}
          {formatTimeNeeded(row?.originalTimeNeeded)}
        </Typography>
    }, {
      xsCol: 2, mdCol: 2, lgCol: 2, xlCol: 2,
      columnStyle: 'columnText',
      headerColumnFormat: 'th-task_importance',
      bodyColumnFormat: (row) => (
          <Box display='flex' flexDirection='column' width='100%'>
            <ImportanceIcon time={row.completedBy} importanceLevel={row.importanceLevel} />
          </Box>
        )
    }, {
      xsCol: 2, mdCol: 2, lgCol: 2, xlCol: 2,
      columnStyle: 'columnText',
      sortable: true,
      fieldSort: 'completedBy',
      headerColumnFormat: 'th-complete_by',
      bodyColumnFormat: (row) => {
        const completedBy = completedByType(row.opportunityType, row.type);
        const formatCompletedBy = moment(row?.completedBy);
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
      xsCol: 2, mdCol: 2, lgCol: 2, xlCol: 2,
      columnStyle: 'columnText',
      bodyColumnFormat: (row) => 
        // if (!!studentId) {retractable
        //   return;
        // };
         (
          <Box component='div' width='100%' display='flex' justifyContent='end'>
            {!!!studentId && <TblButton
              variant='contained'
              color='primary'
              onClick={() => onSchedule(row)}
            >
              {t('btn-schedule-task')}
            </TblButton>}
            <Box component='div' ml={3} mr={2}>
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
          </Box>
        )
      
    }, {
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
      xsCol: 4, mdCol: 4, lgCol: 4, xlCol: 4,
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
      xsCol: 2, mdCol: 2, lgCol: 2, xlCol: 2,
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
      taskList={unscheduledTasks}
      tableHeader={false}
      tableFormat={tableFormat}
      rowSettings={{
        tags: {
          visible: true,
          format: null
        },
        showTags: true,
        format: rowFormat,
        onClick: onClickRow
      }}
      rowCollapseSettings={{
        visibleCollapse: true,
        visibleCollapseByRow: (row) => row?.timeBlocks?.length,
        list: (row) => row?.timeBlocks || [],
        format: collapseFormat,
        onExpand: onExpandCollapse
      }}
      skeletons={unscheduledTasks.length || 3}
      isLoading={isFetchingUnscheduled}
    />
  ), [unscheduledTasks, isFetchingUnscheduled, currentSort]);
}

UnscheduledTasks.propTypes = {
  t: PropTypes.func,
  match: PropTypes.object,
  getUnscheduledTasks: PropTypes.func,
  currentUser: PropTypes.object,
  isFetchingUnscheduled: PropTypes.bool,
  unscheduledTasks: PropTypes.array,
  schoolYearSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setSort: PropTypes.func,
  currentSort: PropTypes.object
};

export default withTranslation(['myTasks', 'common'])(UnscheduledTasks);