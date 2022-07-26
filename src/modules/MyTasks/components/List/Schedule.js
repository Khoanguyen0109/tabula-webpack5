import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Typography } from '@mui/material';

import TblButton from 'components/TblButton';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import {
  handleURLToSchedulePage,
  handleURLToViewUnscheduleTaskDetails,
} from 'modules/MyTasks/utils';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import myTasksActions from '../../actions';
import { TASK_IMPORTANCE_LEVEL, TASK_STATUS } from '../../constants';
import { formatTimeNeeded } from '../../utils';
import LoadingScheduleGif from '../LoadingScheduleGif';
import TaskTags from '../TaskTags';
import ImportanceIcon from '../View/ImportanceIcon';

import TaskList from './TaskList';

Schedule.propTypes = {
  t: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
  isFetchingUnscheduled: PropTypes.bool,
  unscheduledTasks: PropTypes.array,
  schoolYearSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isStudentRole: PropTypes.bool,
};
function Schedule({
  t,
  match,
  history,
  isFetchingUnscheduled,
  unscheduledTasks,
  schoolYearSelected,
  isStudentRole,
}) {
  const authContext = useContext(AuthDataContext);
  const { studentId } = match.params;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const mtStartUrgentTaskSuccess = useSelector((state) => state.MyTasks.mtStartUrgentTaskSuccess);
  const errorStartUrgentTask = useSelector((state) => state.MyTasks.errorStartUrgentTask);
  
  const { enqueueSnackbar } = useSnackbar();
  const onSchedule = useCallback(
    (row) => {
      handleURLToSchedulePage(history, row?.id, schoolYearSelected);
    },
    [history, schoolYearSelected]
  );
  const onViewDetail = useCallback(
    (row) => {
      handleURLToViewUnscheduleTaskDetails(history, row.id, studentId);
    },
    [history, studentId]
  );

  const startUrgentTask = (task) => {
    setOpen(true);
    dispatch(
      myTasksActions.mtStartUrgentTask({
        taskId: task.id,
      })
    );
    setTimeout(() => {
      setOpen(false);
    }, 5000);
  };
  useEffect(() => {
    if(!open){
      if(mtStartUrgentTaskSuccess){
          const {
            currentUser: { organizationId },
          } = authContext;
          dispatch(
          myTasksActions.mtGetTaskInProgress({
            orgId: organizationId,
            isFetchingMTTaskInProgress: true,
          })
        );
        }else if(errorStartUrgentTask=== 6){
          
          return enqueueSnackbar(t('myTasks:assignment_has_been_closed') , { variant: 'error' });
        }
    }
    return () => {
      dispatch(myTasksActions.myTasksSetState({
        errorStartUrgentTask: null,
        mtStartUrgentTaskSuccess: null
      }));

    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[open]);

  const TaskListMemo = useMemo(
    () => (
      <TaskList
        t={t}
        isLoading={isFetchingUnscheduled}
        subTitleEmptyContent={t('empty_schedule_content')}
        data={unscheduledTasks}
        isStudentRole={isStudentRole}
        getButtons={(task) => {
          const canStartUrgentTask = (task.status =
            TASK_STATUS.UNSCHEDULED &&
            task.importanceLevel === TASK_IMPORTANCE_LEVEL.URGENT && isStudentRole );
          const btnList = [
            <TblButton
              variant='outlined'
              color='primary'
              onClick={() => onViewDetail(task)}
            >
              {t('common:view_details')}{' '}
            </TblButton>,
          ];
          if (canStartUrgentTask) {
            btnList.push(
              <TblButton
                variant='outlined'
                color='primary'
                onClick={() => startUrgentTask(task)}
              >
                {t('start_now')}
              </TblButton>
            );
          }
          if (isStudentRole) {
            btnList.push(
              <TblButton
                variant='contained'
                color='primary'
                onClick={() => onSchedule(task)}
              >
                {t('btn-schedule-task')}
              </TblButton>
            );
          }
          return btnList;
        }}
        getTaskLabel={(task) => (
            <Typography variant='bodySmall' display='flex' alignItems='center' className='task-label'>
              {t('estimate')} ·{' '}
              {formatTimeNeeded(task?.originalTimeNeeded)}
              
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
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      t,
      isFetchingUnscheduled,
      unscheduledTasks,
      isStudentRole,
      open,
      onViewDetail,
      onSchedule,
    ]
  );

  return (
    <>
      {TaskListMemo}
      {open && (
        <LoadingScheduleGif open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
export default withTranslation(['myTasks', 'common'])(Schedule);
