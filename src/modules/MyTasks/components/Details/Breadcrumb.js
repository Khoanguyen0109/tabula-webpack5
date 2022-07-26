import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Typography from '@mui/material/Typography';

import TblActivityIcon from 'components/TblActivityIcon';
import { BreadcrumbContext } from 'components/TblBreadcrumb';
import BreadcrumbTitle from 'components/TblBreadcrumb/BreadcrumbTitle';
import TblConfirmDialog from 'components/TblConfirmDialog';

import { isGuardian } from 'utils/roles';

import PropTypes from 'prop-types';

import myTasksActions from '../../actions';
import { TASK_TIME_BLOCK_STATUS } from '../../constants';

const Breadcrumb = React.memo(
  ({
    t,
    taskDetails,
    isShowConfirm,
    onFinishLater,
    handleURLToList,
    currentUser,
  }) => {
    const dispatch = useDispatch();
    const breadcrumb = useContext(BreadcrumbContext);
    const [openConfirm, setOpenConfirm] = useState(false);

    const toggleConfirm = (open) => {
      setOpenConfirm(open);
    };

    const handleConfirm = useCallback(() => {
      toggleConfirm(false);
      const { timeBlocks } = taskDetails;
      const haveUpComingTimeBlock = timeBlocks.find(
        (tb) => tb.status === TASK_TIME_BLOCK_STATUS.UP_COMING
      );
      if (!haveUpComingTimeBlock) {
        return dispatch(
          myTasksActions.myTasksSetState({
            openLastTimeBlockConfirm: true,
          })
        );
      }
      if (onFinishLater) {
        onFinishLater();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const { taskType, quizType } = taskDetails || {};
      breadcrumb.setData({
        handleBackFunc: () =>
          isShowConfirm ? toggleConfirm(true) : handleURLToList(),
        showBoxShadow: true,
        headerContent: (
          <Typography variant='headingSmall' component='span' className='text-ellipsis'>
            {isGuardian(currentUser) ? t('tasks') : t('my_task')}
          </Typography>
        ),
        bodyContent: (
          <TblActivityIcon
            name={<BreadcrumbTitle title={taskDetails?.name} />}
            type={taskType}
            quizType={quizType}
          />
        ),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskDetails, isShowConfirm]);

    return (
      <>
        <TblConfirmDialog
          title={t('common:confirmation')}
          message={t('confirmation_finish_task')}
          okText={t('finish_later')}
          cancelText={t('continue_working')}
          open={openConfirm}
          onCancel={() => toggleConfirm(false)}
          onConfirmed={handleConfirm}
        />
      </>
    );
  }
);

Breadcrumb.propTypes = {
  t: PropTypes.func,
  taskDetails: PropTypes.object,
  isShowConfirm: PropTypes.bool,
  onFinishLater: PropTypes.func,
  handleURLToList: PropTypes.func,
  currentUser: PropTypes.object,
};

export default Breadcrumb;
