import React, { useEffect, useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblButton from 'components/TblButton';
import TblConfirmDialog from 'components/TblConfirmDialog';

import { isStudent } from 'utils/roles';

import { TIME_BLOCK_STT } from 'shared/MyTasks/constants';

import clsx from 'clsx';
import {
  getImportanceLevelInfo,
  handleURLToReschedulePage,
  handleURLToSchedulePage,
  handleURLToViewScheduleTaskDetails,
} from 'modules/MyTasks/utils';
import moment from 'moment';
import PropTypes from 'prop-types';
import { fixedDecimalNumber } from 'utils';

import {
  completedByType,
  infoByType,
  taskTimeBlockStatus,
} from '../../constants';
import TaskTable from '../TaskTable';

import ImportanceIcon from './ImportanceIcon';

function ScheduledTasks({
  t,
  match,
  history,
  currentUser,
  isFetchingScheduled,
  scheduledTasks,
  getScheduledTasks,
  schoolYearSelected,
  setSort,
  currentSort,
  taskJustScheduled,
  startTimeBlock,
  deleteTimeBlock,
  isFetchingDeleteTimeBlock,
  resetMyTasksReducer,
}) {
  const { studentId } = match.params;
  const [{ anchorEl, menuRowSelected, menuSubRowSelected }, setAnchorEl] =
    useState({
      anchorEl: null,
      menuRowSelected: null,
      menuSubRowSelected: null,
    });
  const [confirmDeleteTimeBlock, setConfirmDeleteTimeBlock] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const getScheduled = React.useCallback(
    (fieldSort, typeSort) => {
      const params = {
        schoolYearId: schoolYearSelected,
        timezone: currentUser?.timezone,
        sort: typeSort || currentSort.typeSort,
        fieldSort: fieldSort || currentSort.fieldSort,
      };
      if (!!studentId) {
        params.studentId = studentId;
      }
      getScheduledTasks({
        orgId: currentUser?.organizationId,
        params,
        // scheduledTasks: [],
        // isFetchingScheduled
      });
    },
    [schoolYearSelected, currentUser, currentSort]
  );

  const onSort = (fieldSort, typeSort) => {
    setSort(fieldSort, typeSort);
    getScheduled(fieldSort, typeSort);
    clearTaskJustScheduled();
  };

  const clearTaskJustScheduled = () => {
    if (taskJustScheduled) {
      resetMyTasksReducer({ taskJustScheduled: null });
    }
  };

  useEffect(() => clearTaskJustScheduled, []);

  const onClickRow = () => {
    // setRowSelected(row.id);
    // console.log(rowSelected);
  };

  const onViewDetail = (row) => {
    clearTaskJustScheduled();
    handleURLToViewScheduleTaskDetails(history, row.id, studentId);
  };

  const onStart = (subRow, row) => {
    startTimeBlock({
      payload: {
        payloadWorkingOnTimeBlock: {
          orgId: currentUser?.organizationId,
          taskId: row?.id,
          timeBlockId: subRow?.id,
          body: {
            status: TIME_BLOCK_STT.IN_PROGRESS,
            completed: false,
          },
        },
        isFetchingWorkingOnTimeBlock: true,
        taskId: row?.id,
      },
      task: row,
    });
    setSelectedRow(row);
  };

  // const rowFormat = row => [taskJustScheduled == row.id && 'task-activated'];
  const rowFormat = (row) => {
    const { completedBy, importanceLevel } = row;
    // const isCurrentDay = moment().isSame(completedBy, 'day');
    // const isTomorrowDay = moment().add(1, 'd').isSame(completedBy, 'day');
    // return [isCurrentDay ? 'task-urgent' : isTomorrowDay ? 'task-pressing' : taskJustScheduled == row.id ? 'task-activated' : 'task-upcoming'];
    const info = getImportanceLevelInfo(completedBy, importanceLevel);
    return [taskJustScheduled === row.id ? 'task-activated' : info?.class];
  };

  const onExpandCollapse = () => {};

  const tableFormat = [
    {
      xsCol: 4,
      mdCol: 4,
      lgCol: 4,
      xlCol: 4,
      columnStyle: 'taskName',
      headerColumnFormat: 'th-task_and_course',
      bodyColumnFormat: (row) => {
        const { typeLabel } = infoByType(row.type) || {};
        return (
          <Box display='flex' flexDirection='column' width='100%'>
            <Box component='div' display='flex' alignItems='center'>
              <TblActivityIcon type={row.type} />
              <span>{typeLabel}:</span>
            </Box>
            <Typography
              component='a'
              className='text-ellipsis font-weight-semi'
            >
              {row.name}
            </Typography>
            <Typography component='p' className='text-ellipsis'>
              {row.courseName}
            </Typography>
          </Box>
        );
      },
    },
    {
      xsCol: 2,
      mdCol: 2,
      lgCol: 2,
      xlCol: 2,
      columnStyle: 'columnText',
      headerColumnFormat: 'th-task_importance',
      bodyColumnFormat: (row) => (
        <Box display='flex' flexDirection='column' width='100%'>
          <ImportanceIcon
            time={row?.completedBy}
            importanceLevel={row.importanceLevel}
          />
        </Box>
      ),
    },
    {
      xsCol: 4,
      mdCol: 4,
      lgCol: 4,
      xlCol: 4,
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
            <Box
              component='div'
              display='flex'
              flexWrap='wrap'
              className='font-weight-semi'
            >
              <span>{formatCompletedBy.format('ddd, MMM DD, YYYY')}</span>
              <Box component='span' ml={0.5} mr={0.5}>
                -
              </Box>
              <span>{formatCompletedBy.format('h:mm a')}</span>
            </Box>
          </Box>
        );
      },
    },
    {
      xsCol: 1,
      mdCol: 1,
      lgCol: 1,
      xlCol: 1,
      columnStyle: 'columnIcon',
      bodyColumnFormat: (row) => (
        // if (!!studentId) {
        //   return;
        // }
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
      ),
    },
    {
      xsCol: 1,
      mdCol: 1,
      lgCol: 1,
      xlCol: 1,
      columnStyle: 'columnIcon',
      bodyColumnFormat: (row, isExpanded) =>
        row?.timeBlocks.length > 0 && (
          <Box
            component='div'
            width='100%'
            display='flex'
            justifyContent='flex-end'
            mr={1}
          >
            <span
              className={clsx('icon-icn_arrow_left', isExpanded && 'expanded')}
            />
          </Box>
        ),
    },
  ];

  const collapseFormat = [
    {
      xsCol: 3,
      mdCol: 3,
      lgCol: 3,
      xlCol: 3,
      headerColumnFormat: 'myTasks:th-start',
      bodyColumnFormat: (subRow) => {
        const startTime = moment(subRow.startTime);
        return (
          <Box
            component='div'
            display='flex'
            flexWrap='wrap'
            className={subRow?.disabled && 'text-disabled'}
          >
            <span>{startTime.format('ddd, MMM DD, YYYY')}</span>
            <Box component='span' ml={0.5} mr={0.5}>
              -
            </Box>
            <span>{startTime.format('hh:mm a')}</span>
          </Box>
        );
      },
    },
    {
      xsCol: 3,
      mdCol: 3,
      lgCol: 3,
      xlCol: 3,
      headerColumnFormat: 'myTasks:th-end',
      bodyColumnFormat: (subRow) => {
        const endTime = moment(subRow.endTime);
        return (
          <Box
            component='div'
            display='flex'
            flexWrap='wrap'
            className={subRow?.disabled && 'text-disabled'}
          >
            <span>{endTime.format('ddd, MMM DD, YYYY')}</span>
            <Box component='span' ml={0.5} mr={0.5}>
              -
            </Box>
            <span>{endTime.format('hh:mm a')}</span>
          </Box>
        );
      },
    },
    {
      xsCol: 2,
      mdCol: 2,
      lgCol: 2,
      xlCol: 2,
      headerColumnFormat: 'myTasks:th-scheduled',
      bodyColumnFormat: (subRow) => (
        <Box
          component='div'
          display='flex'
          flexWrap='wrap'
          className={subRow?.disabled && 'text-disabled'}
        >
          {fixedDecimalNumber(subRow?.duration)}{' '}
          {subRow?.duration !== 1 ? 'mins' : 'min'}
        </Box>
      ),
    },
    {
      xsCol: 2,
      mdCol: 2,
      lgCol: 2,
      xlCol: 2,
      headerColumnFormat: 'myTasks:th-time_block_status',
      bodyColumnFormat: (subRow) => t(taskTimeBlockStatus(subRow?.status)),
    },
    {
      xsCol: 1,
      mdCol: 1,
      lgCol: 1,
      xlCol: 1,
      bodyColumnFormat: (subRow, row) => {
        if (!!studentId) {
          return;
        }
        if (subRow?.isFirstUpcoming) {
          return (
            <Box component='div' width='100%' ml={1}>
              <TblButton
                variant='contained'
                color='primary'
                onClick={() => onStart(subRow, row)}
                isShowCircularProgress={row.id === selectedRow}
              >
                {t('myTasks:btn-start')}
              </TblButton>
            </Box>
          );
        }
        return null;
      },
    },
    {
      xsCol: 1,
      mdCol: 1,
      lgCol: 1,
      xlCol: 1,
      bodyColumnFormat: (subRow, row) => {
        if (!!studentId) {
          return;
        }
        return (
          <Box
            component='div'
            width='100%'
            display='flex'
            justifyContent='flex-end'
            fontSize='24px'
          >
            <span
              className='icon-icn_more'
              onClick={(e) =>
                setAnchorEl({
                  anchorEl: e.currentTarget,
                  menuRowSelected: row,
                  menuSubRowSelected: subRow,
                })
              }
            />
          </Box>
        );
      },
    },
  ];

  const onAddTimeBlock = (row) => {
    handleURLToSchedulePage(history, row?.id, schoolYearSelected, 'add');
  };

  const footerColumnFormat = (row) =>
    !!!studentId && (
      <div className='footer-column' onClick={() => onAddTimeBlock(row)}>
        <span className='icon-icn_plus' />
        <span className='add-time-block'>{t('myTasks:add-time-block')}</span>
      </div>
    );

  const convertTimeBlocks = (row) => {
    const convertedTimeBlocks = [];
    let countUpcoming = 0;
    for (let i = 0; i < row?.timeBlocks.length; i++) {
      const timeBlock = row?.timeBlocks[i];
      if (timeBlock.status === TIME_BLOCK_STT.UPCOMING) {
        if (countUpcoming === 0) {
          timeBlock.isFirstUpcoming = true;
        }
        countUpcoming++;
        timeBlock.indUpcoming = countUpcoming;
      } else if (
        timeBlock.status === TIME_BLOCK_STT.ENDED ||
        timeBlock.status === TIME_BLOCK_STT.SKIPPED
      ) {
        timeBlock.disabled = true;
      }
      convertedTimeBlocks.push(timeBlock);
    }
    return convertedTimeBlocks;
  };

  const onReschedule = (row, subRow) => {
    const paramsObj = {
      type: row?.type,
      courseId: row?.courseId,
      schoolYearId: schoolYearSelected,
      timeBlockId: subRow?.id,
    };
    handleURLToReschedulePage(history, paramsObj, row?.id);
  };

  const onDelete = (row, subRow) => {
    // last upcoming in timeBlock list
    const countUpcoming = row?.timeBlocks.filter(
      (e) => e.status === TIME_BLOCK_STT.UPCOMING
    );
    if (countUpcoming.length === 1) {
      setConfirmDeleteTimeBlock(true);
    } else {
      deleteTimeBlock(row, subRow, false);
    }
  };

  const onCancelConfirm = () => {
    setConfirmDeleteTimeBlock(false);
  };

  const onConfirmed = () => {
    setConfirmDeleteTimeBlock(false);
    deleteTimeBlock(menuRowSelected, menuSubRowSelected, true);
  };

  return useMemo(
    () => (
      <React.Fragment>
        <TblConfirmDialog
          open={confirmDeleteTimeBlock}
          progressing={isFetchingDeleteTimeBlock}
          title={t('common:confirmation')}
          message={t('myTasks:confirm_delete-time-block')}
          okText={t('myTasks:btn_delete-time-block')}
          onCancel={onCancelConfirm}
          onConfirmed={onConfirmed}
        />
        <TaskTable
          contextMenu={{
            id: 'more-menu',
            menuRowSelected,
            menuSubRowSelected,
            anchorEl,
            isOpen: !!anchorEl,
            onClose: () =>
              setAnchorEl({
                anchorEl: null,
                menuRowSelected,
                menuSubRowSelected,
              }),
            menuItems: (row, subRow) => [
              {
                label: 'menu-reschedule',
                onSelectMenu: onReschedule,
                disabled:
                  subRow?.status !== TIME_BLOCK_STT.UPCOMING ||
                  !isStudent(currentUser),
              },
              {
                label: 'menu-delete',
                onSelectMenu: onDelete,
                disabled:
                  subRow?.status !== TIME_BLOCK_STT.UPCOMING ||
                  !isStudent(currentUser),
              },
            ],
          }}
          sortInfo={{
            defaultSort: {
              fieldSort: currentSort.fieldSort,
              typeSort: currentSort.typeSort,
            },
            onSort,
          }}
          taskList={scheduledTasks}
          tableHeader={false}
          tableFormat={tableFormat}
          rowSettings={{
            tags: {
              visible: true,
              format: null,
            },
            showTags: true,
            format: rowFormat,
            onClick: onClickRow,
            taskJustScheduled,
          }}
          rowCollapseSettings={{
            visibleCollapse: true,
            list: convertTimeBlocks,
            format: collapseFormat,
            footerColumnFormat,
            onExpand: onExpandCollapse,
          }}
          skeletons={scheduledTasks.length || 3}
          isLoading={isFetchingScheduled}
        />
      </React.Fragment>
    ),
    [
      scheduledTasks,
      taskJustScheduled,
      confirmDeleteTimeBlock,
      isFetchingDeleteTimeBlock,
      anchorEl,
    ]
  );
}

ScheduledTasks.propTypes = {
  t: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
  currentUser: PropTypes.object,
  isFetchingScheduled: PropTypes.bool,
  scheduledTasks: PropTypes.array,
  getScheduledTasks: PropTypes.func,
  schoolYearSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setSort: PropTypes.func,
  currentSort: PropTypes.object,
  startTimeBlock: PropTypes.func,
  taskJustScheduled: PropTypes.array,
};

export default withTranslation(['myTasks', 'common'])(ScheduledTasks);
