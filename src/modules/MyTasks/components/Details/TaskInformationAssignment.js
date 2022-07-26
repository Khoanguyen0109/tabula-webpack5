/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

import { SUBMISSION_METHOD } from '../../../../shared/MyCourses/constants';
import { formatTimeNeeded } from '../../utils';

const useStyles = makeStyles((theme) => ({
  noneText: {
    color: theme.newColors.gray[700],
  },
}));

function TaskInformation(props) {
  const { details } = props;
  const { t } = useTranslation('myCourses', 'common');
  const classes = useStyles(props);

 /** Hide this column due to update UI
   * Just comment, dont delete in order to show these information later.
   */
  /* const leftColumnContent = [
    {
      title: t('due'),
      data: moment(details?.originalDueTime).format('MMM DD, YYYY - hh:mm a'),
      show: details?.originalDueTime,
    },
    {
      title: t('new_deadline'),
      data: moment(details?.finalDueTime).format('MMM DD, YYYY - hh:mm a'),
      show: details?.finalDueTime,
    },
    {
      title: t('allow_late_turn_in_label'),
      data: details?.shadowAssignment?.masterAssignment?.allowLateTurnIn
        ? t('common:yes')
        : t('common:no'),
      show: true,
    },
    {
      title: t('percent_credit'),
      data: `${details?.masterAssignment?.percentCredit}%`,
      show: details?.shadowAssignment?.masterAssignment?.allowLateTurnIn,
    },
  ];
  */

  const middleColumnContent = [
    {
      title: t('total_possible_points'),
      data: details?.shadowAssignment?.masterAssignment?.totalPossiblePoints,
      show: true,
    },
    {
      title: t('grade_weighting_category'),
      data: details?.shadowAssignment?.masterAssignment?.gradeWeightCriteria?.name,
      show: true,
    },
    {
      title: t('time_to_complete'),
      // data: t('common:minWithCount', { count: details?.shadowAssignment?.masterAssignment?.timeToComplete }),
      data: formatTimeNeeded(details?.shadowAssignment?.masterAssignment?.timeToComplete),

      show: true,
    },
    {
      title: t('extra_credit'),
      data: details?.shadowAssignment?.masterAssignment?.extraCredit
        ? t('common:yes')
        : t('common:no'),
      show: true,
    },
  ];

  const rightColumnContent = [
    {
      title: t('unit'),
      data: details?.shadowAssignment?.masterAssignment?.unit?.unitName,
      show: true,
    },

    {
      title: t('submission_type'),
      data:
        details?.shadowAssignment?.masterAssignment?.submissionMethod === SUBMISSION_METHOD.ONLINE
          ? t('submission_type_online')
          : t('submission_type_offline'),
      show: true,
    },
  ];

  const renderColumn = (contentColumn) => (
      <>
        {contentColumn.map((item) => {
          if (!!!item.show) {
            return <></>;
          }
          return (
            <Box mb={3}>
              <Typography
                variant='bodyMedium'
                color='primary'
              >
                <Box fontWeight='labelLarge.fontWeight' className='text-ellipsis'>
                  {item.title}
                </Box>
              </Typography>
              <Box mt={1} className='text-ellipsis'>
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
          );
        })}
      </>
    );
  return (
    <div className={classes.contentWrapper}>
      <Grid container spacing={3}>
        {/* <Grid item xs={4}>
          {renderColumn(leftColumnContent)}
        </Grid> */}
        <Grid item xs={4}>
          {renderColumn(middleColumnContent)}
        </Grid>
        <Grid item xs={4}>
          {renderColumn(rightColumnContent)}
        </Grid>
      </Grid>
    </div>
  );
}

TaskInformation.propTypes = {
  details: PropTypes.object,
};

TaskInformation.defaultProps = {};

export default TaskInformation;
