/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import { TIME_BLOCK_STT } from 'shared/MyTasks/constants';

import { parseDurationToMinutes } from 'modules/MyTasks/utils';
import moment from 'moment';
import PropTypes from 'prop-types';

import { TASK_STATUS } from '../../constants';
import { contentLeft } from '../../styled';

const useStyles = makeStyles((theme) => ({
  contentLeft: (props) => contentLeft(props, theme)
}));

function ManageScheduleTaskDetails({ taskDetails }) {
  const { t } = useTranslation('myTasks', 'common');
  const classes = useStyles();
  const timeBlocksUpcoming = taskDetails?.timeBlocks?.filter((timeBlock) => timeBlock.status === TIME_BLOCK_STT.UPCOMING
  );
  const firstUpComingTimeBlock = timeBlocksUpcoming?.[0];

  const renderContent = () => {
    const content = [
      {
        title: t('upcoming_time_block'),
        data:
          firstUpComingTimeBlock &&
          `${moment(firstUpComingTimeBlock?.startTime).format(
            'ddd, MMM DD, YYYY'
          )} - ${moment(firstUpComingTimeBlock?.startTime).format(
            'h:mm a'
          )} to ${moment(firstUpComingTimeBlock?.endTime).format('h:mm a')}`,
        show: true,
      },
      {
        title: t('task_status'),
        data: t(`${TASK_STATUS[taskDetails?.status]}`),
        show: true,
      },
      {
        title: t('total_time_spent'),
        data: parseDurationToMinutes(taskDetails?.actualDuration),
        show: true,
      },
    ];
    return (
      <>
        {content?.map((item, index) => (
          <Box mt={index === 0 ? 0 : 3}>
            <Typography
              variant='bodyMedium'
              color='primary'
            >
              <Box fontWeight='labelLarge.fontWeight' className='text-ellipsis'>
                {item.title}
              </Box>
            </Typography>
            <Box className='text-ellipsis'>
              {!item.data ? (
                <div className={classes.noneText}>
                  <Typography
                    variant='bodyMedium'
                    color='inherit'
                  >
                    {t('common:none')}
                  </Typography>
                </div>
              ) : (
                  <Typography
                    variant='bodyMedium'
                    color='primary'
                  >
                    {item.data}
                  </Typography>
                )}
            </Box>
          </Box>
        ))}
      </>
    );
  };

  return (
    <Box className={classes.contentLeft}>
      <PerfectScrollbar option={{ suppressScrollX: true }}>
        <div className='wrap-content'>
          {renderContent()}
        </div>
      </PerfectScrollbar>
    </Box>
  );
}

ManageScheduleTaskDetails.propTypes = {
  taskDetails: PropTypes.object
};

ManageScheduleTaskDetails.defaultProps = {};

export default ManageScheduleTaskDetails;
