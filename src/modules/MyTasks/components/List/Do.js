import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';

import TblButton from 'components/TblButton';
import TblConfirmDialog from 'components/TblConfirmDialog';

import { isStudent } from 'utils/roles';

import { TIME_BLOCK_STT } from 'shared/MyTasks/constants';

import {
  handleURLToReschedulePage,
  handleURLToSchedulePage,
  handleURLToViewScheduleTaskDetails,
} from 'modules/MyTasks/utils';
import PropTypes from 'prop-types';

import { formatTimeNeeded } from '../../utils';
import TaskTags from '../TaskTags';
import ImportanceIcon from '../View/ImportanceIcon';

import TaskList from './TaskList';
const styles = (theme) => ({
  footerFormat: {
    fontSize: theme.fontSize.normal,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '& span': {
      color: theme.mainColors.primary2[0],
      '&.icon-icn_plus': {
        borderRadius: '50%',
        padding: 7,
        border: `1px solid ${theme.mainColors.primary2[0]}`,
        marginRight: theme.spacing(1),
      },
    },
  },
});
Do.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  currentUser: PropTypes.object,
  isFetchingScheduled: PropTypes.bool,
  scheduledTasks: PropTypes.array,
  schoolYearSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  startTimeBlock: PropTypes.func,
  taskJustScheduled: PropTypes.array,
  deleteTimeBlock: PropTypes.func,
  isFetchingDeleteTimeBlock: PropTypes.bool,
  resetMyTasksReducer: PropTypes.func,
  isStudentRole: PropTypes.bool,
};
function Do({
  t,
  classes,
  match,
  history,
  currentUser,
  isFetchingScheduled,
  scheduledTasks,
  schoolYearSelected,
  startTimeBlock,
  taskJustScheduled,
  deleteTimeBlock,
  isFetchingDeleteTimeBlock,
  resetMyTasksReducer,
  isStudentRole,
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

  const clearTaskJustScheduled = useCallback(() => {
    if (taskJustScheduled) {
      resetMyTasksReducer({ taskJustScheduled: null });
    }
  }, [resetMyTasksReducer, taskJustScheduled]);

  useEffect(() => clearTaskJustScheduled, [clearTaskJustScheduled]);

  const onViewDetail = useCallback(
    (row) => {
      clearTaskJustScheduled();
      handleURLToViewScheduleTaskDetails(history, row.id, studentId);
    },
    [clearTaskJustScheduled, history, studentId]
  );

  const onStart = useCallback(
    (subRow, row) => {
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
    },
    [currentUser.organizationId, startTimeBlock]
  );

  const onAddTimeBlock = useCallback(
    (row) => {
      handleURLToSchedulePage(history, row?.id, schoolYearSelected, 'add');
    },
    [history, schoolYearSelected]
  );

  const footerColumnFormat = useCallback(
    (row) =>
      !!!studentId && (
        <div
          className={classes.footerFormat}
          onClick={() => onAddTimeBlock(row)}
        >
          <span className='icon-icn_plus' />
          <span className='add-time-block'>{t('myTasks:add-time-block')}</span>
        </div>
      ),
    [classes.footerFormat, onAddTimeBlock, studentId, t]
  );

  const onReschedule = useCallback(
    (row, subRow) => {
      const paramsObj = {
        type: row?.type,
        courseId: row?.courseId,
        schoolYearId: schoolYearSelected,
        timeBlockId: subRow?.id,
      };
      handleURLToReschedulePage(history, paramsObj, row?.id);
    },
    [history, schoolYearSelected]
  );

  const onDelete = useCallback(
    (row, subRow) => {
      // last upcoming in timeBlock list
      const countUpcoming = row?.timeBlocks.filter(
        (e) => e.status === TIME_BLOCK_STT.UPCOMING
      );
      if (countUpcoming.length === 1) {
        setConfirmDeleteTimeBlock(true);
      } else {
        deleteTimeBlock(row, subRow, false);
      }
    },
    [deleteTimeBlock]
  );

  const onCancelConfirm = () => {
    setConfirmDeleteTimeBlock(false);
  };

  const onConfirmed = useCallback(
    () => {
      setConfirmDeleteTimeBlock(false);
      deleteTimeBlock(menuRowSelected, menuSubRowSelected, true);
    },
    [deleteTimeBlock, menuRowSelected, menuSubRowSelected]
  );

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
        <TaskList
          t={t}
          data={scheduledTasks}
          isLoading={isFetchingScheduled}
          isStudentRole={isStudentRole}
          subTitleEmptyContent={t('empty_do_content')}
          selectedRow={selectedRow}
          activeCollapId={taskJustScheduled}
          footerColumnFormat={footerColumnFormat}
          setAnchorEl={setAnchorEl}
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
          getButtons={(task) => [
            <TblButton
              variant='outlined'
              color='primary'
              onClick={() => onViewDetail(task)}
            >
              View Details{' '}
            </TblButton>,
          ]}
          getTaskLabel={(task) => (
            <Typography
              variant='bodySmall'
              display='flex'
              alignItems='center'
              className='task-label'
            >
              {t('estimate')} · {formatTimeNeeded(task?.originalTimeNeeded)}
            </Typography>
          )}
          getTags={(task) => {
            const tagList = [
              <ImportanceIcon
                time={task.completedBy}
                importanceLevel={task.importanceLevel}
              />,
            ];
            if (task?.opportunityType?.length) {
              tagList.push(
                <TaskTags opportunities={task.opportunityType} t={t} />
              );
            }
            return tagList;
          }}
          onStart={onStart}
        />
      </React.Fragment>
    ),
    [
      confirmDeleteTimeBlock,
      isFetchingDeleteTimeBlock,
      t,
      onConfirmed,
      scheduledTasks,
      isFetchingScheduled,
      isStudentRole,
      onViewDetail,
      onReschedule,
      footerColumnFormat,
      menuRowSelected,
      menuSubRowSelected,
      anchorEl,
      onStart,
      selectedRow,
      taskJustScheduled,
      currentUser,
      onDelete,
    ]
  );
}

export default withTranslation(['myTasks', 'common'])(withStyles(styles)(Do));
