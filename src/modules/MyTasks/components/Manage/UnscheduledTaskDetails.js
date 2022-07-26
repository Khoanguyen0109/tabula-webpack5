import React from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useHistory } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';

import { handleURLToSchedulePage } from 'modules/MyTasks/utils';
import PropTypes from 'prop-types';

import { TASK_STATUS } from '../../constants';
import { contentLeft } from '../../styled';

const useStyles = makeStyles((theme) => ({
  contentLeft: (props) => contentLeft(props, theme),
  btnSchedule: {
    marginBottom: theme.spacing(3)
  }
}));

function ManageUnscheduledTaskDetails({ taskDetails, isStudent }) {
  const history = useHistory();
  const { t } = useTranslation('myTasks', 'common');
  const classes = useStyles();

  const onSchedule = () => {
    const { id, schoolYearId } = taskDetails;
    handleURLToSchedulePage(history, id, schoolYearId);
  };
  const renderContent = () => {
    const content = [
      {
        title: t('task_status'),
        data: t(`${TASK_STATUS[taskDetails?.status]}`),
        show: true,
      }
    ];
    return (
      <>
        {isStudent && <Box>
          <TblButton
            variant='contained'
            color='primary'
            type='submit'
            onClick={onSchedule}
            className={classes.btnSchedule}
          >
            {t('schedule_task')}
          </TblButton>
        </Box>}
        {content?.map((item, index) => (
          <Box mt={index === 0 ? 0 : 3}>
            <Typography variant='bodyMedium' color='primary'>
              <Box fontWeight='labelLarge.fontWeight' className='text-ellipsis'>
                {item.title}
              </Box>
            </Typography>
            <Box className='text-ellipsis'>
              {!item.data ? (
                <div className={classes.noneText}>
                  <Typography variant='bodyMedium' color='inherit'>
                    {t('common:none')}
                  </Typography>
                </div>
              ) : (
                  <Typography variant='bodyMedium' color='primary'>
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

ManageUnscheduledTaskDetails.propTypes = {
  taskDetails: PropTypes.object,
  isStudent: PropTypes.bool
};

ManageUnscheduledTaskDetails.defaultProps = {};

export default ManageUnscheduledTaskDetails;
