/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
// import moment from 'moment';

import { GRADE_TYPE_NAME, QUIZ_TYPE } from 'shared/MyCourses/constants';

import PropTypes from 'prop-types';

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
      title: t('taken_on'),
      data: moment(details?.executeTime).format('MMM DD, YYYY - hh:mm a'),
      show: true,
    },
    {
      title: t('make_up_deadline'),
      data: moment(details?.makeupDeadline).isValid()
        ? moment(details?.makeupDeadline).format('MMM DD, YYYY')
        : t('common:none'),
      show: details?.makeupDeadline,
    },
    {
      title: t('retake_deadline'),
      data: moment(details?.retakeDeadline).format('MMM DD, YYYY - hh:mm a'),
      show: !!details?.shadowQuiz?.masterQuiz?.allowRetake,
    },
    {
      title: t('allow_retake'),
      data: <span>{`${!!masterQuiz?.allowRetake ? 'Yes' : 'No'}`}</span>,
      show: true,
    },
    {
      title: t('max_retakes'),
      data: masterQuiz?.maxRetakes,
      show: !!masterQuiz?.allowRetake,
    },
    {
      title: t('percent_credit'),
      data: `${masterQuiz?.percentCredit}%`,
      show: !!masterQuiz?.allowRetake,
    },
  ];
*/
  const middleColumnContent = [
    {
      title: t('total_possible_points'),
      data: details?.shadowQuiz?.masterQuiz?.totalPossiblePoints,
      show: true,
    },
    {
      title: t('grade_weighting_category'),
      data: details?.shadowQuiz?.masterQuiz?.gradeWeightCriteria?.name,
      show: true,
    },
    {
      title: t('grade_type'),
      data: t(`${GRADE_TYPE_NAME[details?.shadowQuiz?.masterQuiz?.gradeType]}`),
      show: true,
    },
    {
      title: t('time_to_complete_mins').replace('(Mins)', ''),
      // data: `${t('common:minWithCount', {
      //   count: details?.shadowQuiz?.masterQuiz?.timeToComplete,
      // })}`,
      data: formatTimeNeeded(details?.shadowQuiz?.masterQuiz?.timeToComplete),
      show: true,
    },
    {
      title: t('study_effort'),
      // data: `${t('common:minWithCount', {
      //   count: details?.shadowQuiz?.masterQuiz?.studyEffort,
      // })}`,
      data: formatTimeNeeded(details?.shadowQuiz?.masterQuiz?.studyEffort),

      show: details?.shadowQuiz?.quizType === QUIZ_TYPE.ANNOUNCED,
    },
  ];

  const rightColumnContent = [
    {
      title: t('unit'),
      data: details?.shadowQuiz?.masterQuiz?.unit?.unitName,
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
                component='bodyMedium'
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
                      component='bodyMedium'
                      variant='bodyMedium'
                      color='inherit'
                    >
                      {t('common:none')}
                    </Typography>
                  </div>
                ) : (
                  <Typography
                    component='bodyMedium'
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
  masterQuiz: PropTypes.object,
};

TaskInformation.defaultProps = {};

export default TaskInformation;
