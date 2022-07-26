import React from 'react';
import { useTranslation } from 'react-i18next';

import find from 'lodash/find';
import findLast from 'lodash/findLast';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

import ScheduleItem from './ScheduleItem';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    color: theme.mainColors.primary1[1],
    maxWidth: '100%',
  },
  weekColumn: {
    margin: theme.spacing(2, 2, 2, 0),
  },
  weekInfoWrapper: {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2.1),
    paddingTop: theme.spacing(0.5),
    display: 'flex',
    width: 160,
    alignItems: 'flex-end',
  },
  weekInfo: {
    flex: 1,
  },
  weekTitle: {
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
  },
  weekDate: {
    fontSize: theme.fontSize.small,
  },
  hiddenItem: {
    height: 64,
    width: 160,
    border: 'none',
    backgroundColor: 'transparent',
  },
}));

const Weeks = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('schoolYear');
  const { weeks, increaseWeekFrom, onClickSchedule, openCopyMenu } = props;
  const selectLabel = t('select_template');

  const generalMissDayOfWeek = (week) => {
    const newWeek = [];
    if (week) {
      const weekHasValue = findLast(week, (o) => o.date);
      for (let i = 0; i < 7; i++) {
        const findDayResult = find(week, (o) => o.dayofweek === i);
        if (!findDayResult) {
          newWeek[i] = {
            startweek: weekHasValue.startweek,
            endweek: weekHasValue.endweek,
          };
        } else {
          newWeek[i] = findDayResult;
        }
      }
    }
    return newWeek;
  };

  const renderWeek = (week) => {
    let filteredWeek = [...week]; //filter(week, day => (day.dayofweek > 0 && day.dayofweek < 6) );
    if (week.length < 7) {
      filteredWeek = generalMissDayOfWeek(week);
    }

    return filteredWeek.map((schedule, index) => {
      if (index === 0 || index === 6 || index > 6) {
        // Ignore render Sunday(0) and Saturday(6)
        return null;
      }

      if (!schedule.gradingPeriodId) {
        return (
          <Box
            className={clsx(classes.weekColumn, classes.hiddenItem)}
            key={`wrapper-schedule-${index}`}
          />
        );
      }

      return (
        <Box className={classes.weekColumn} key={`wrapper-schedule-${index}`}>
          <ScheduleItem
            onClick={onClickSchedule}
            schedule={schedule}
            selectLabel={selectLabel}
          />
        </Box>
      );
    });
  };

  const handleOpenCopyMenu = (week) => (event) => {
    if (openCopyMenu) openCopyMenu(event?.currentTarget, week);
  };

  return (
    <Box className={classes.root}>
      {Object.keys(weeks).map((weekNumber, i) => (
        <Box key={`weeks-${weekNumber}-${i}`}>
          <Box className={classes.weekInfoWrapper}>
            <Box className={classes.weekInfo}>
              <Typography className={classes.weekTitle}>
                Week {increaseWeekFrom ? i + 1 + increaseWeekFrom : i + 1}
              </Typography>
              <Typography component='div' className={classes.weekDate}>
                {moment(weeks[weekNumber][0].startweek).format('M/D')} -{' '}
                {moment(weeks[weekNumber][0].endweek).format('M/D')}
              </Typography>
            </Box>
            <Box className={classes.moreButton}>
              <TblIconButton
                color='primary'
                onClick={handleOpenCopyMenu({
                  week: weeks[weekNumber],
                  weekNumber,
                })}
              >
                <span className='icon-icn_more' />
              </TblIconButton>
            </Box>
          </Box>
          {renderWeek(weeks[weekNumber], i)}
        </Box>
      ))}
    </Box>
  );
};

Weeks.propTypes = {
  weeks: PropTypes.object,
  increaseWeekFrom: PropTypes.number,
  onClickSchedule: PropTypes.func,
  openCopyMenu: PropTypes.func,
};

Weeks.defaultProps = {
  weekDays: [],
};

export default React.memo(Weeks);
