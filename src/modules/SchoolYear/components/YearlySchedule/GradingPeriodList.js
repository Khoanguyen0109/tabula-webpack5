import React from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';

import cloneDeep from 'lodash/cloneDeep';

import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

import Weeks from './Weeks';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    color: theme.mainColors.primary1[1],
    maxWidth: '100%',
  },
  weekdaysWrapper: {
    marginTop: theme.spacing(9),
  },
  weekdays: {
    display: 'flex',
    paddingLeft: theme.spacing(1),
    alignItems: 'center',
    width: 60,
    height: 64,
    textTransform: 'uppercase',
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
    marginTop: theme.spacing(1.8),

    '&:last-child': {
      marginBottom: theme.spacing(2),
    },
  },
  gridList: {
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    // transform: 'translateZ(0)',
    display: 'flex',
    backgroundColor: theme.palette.background.paper,
    // flex: 1,
    maxWidth: '100%',
    flexWrap: 'nowrap',
  },
  gradingPeriodWrapper: {
    // width: '100%'
  },
  title: {
    fontSize: theme.fontSize.normal,
    paddingLeft: theme.spacing(2.1),
    // marginBottom: theme.spacing(1)
  },
}));

let duplicateWeeks = 0;

export default function GradingPeriodList(props) {
  const classes = useStyles();
  const { t } = useTranslation('schoolYear', 'common');
  const {
    termName,
    gradingPeriods,
    onClickSchedule,
    openCopyMenu,
    hiddenGradingPeriodName,
    scrollClass,
  } = props;
  const weekdays = [
    t('common:mon'),
    t('common:tue'),
    t('common:wed'),
    t('common:thu'),
    t('common:fri'),
  ];
  let gradingPeriodKeys = [];
  for (let key in gradingPeriods) {
    gradingPeriodKeys.push(key);
  }
  const newGradingPeriods = cloneDeep(gradingPeriods);
  // Progress period continues
  let keys;
  let keys1;
  let tmp;
  // console.log(gradingPeriodKeys);
  for (let i = 1; i < gradingPeriodKeys.length; i++) {
    keys = Object.keys(newGradingPeriods[gradingPeriodKeys[i - 1]]);
    keys1 = Object.keys(newGradingPeriods[gradingPeriodKeys[i]]);
    if (keys[keys.length - 1] === keys1[0]) {
      tmp = newGradingPeriods[gradingPeriodKeys[i - 1]][keys1[0]];
      delete newGradingPeriods[gradingPeriodKeys[i - 1]][keys1[0]];
      newGradingPeriods[gradingPeriodKeys[i]][keys1[0]] = [
        ...tmp,
        ...newGradingPeriods[gradingPeriodKeys[i]][keys1[0]],
      ];
    }
  }

  const getIncreaseWeekFrom = (indexOfWeek = 0) => {
    if (indexOfWeek < 1) {
      duplicateWeeks = 0;
      return 0;
    }
    const currentGradingPeriodKeys = Object.keys(
      gradingPeriods[gradingPeriodKeys[indexOfWeek]]
    );
    const previousGradingPeriodKeys = Object.keys(
      gradingPeriods[gradingPeriodKeys[indexOfWeek - 1]]
    );
    let increaseWeekFrom = 0;
    if (
      currentGradingPeriodKeys[0] ===
      previousGradingPeriodKeys[previousGradingPeriodKeys.length - 1]
    ) {
      duplicateWeeks += 1;
    }
    for (let i = indexOfWeek - 1; i >= 0; i--) {
      increaseWeekFrom += Object.keys(
        gradingPeriods[gradingPeriodKeys[i]]
      ).length;
    }
    return increaseWeekFrom - duplicateWeeks;
  };
  return (
    <Box className={classes.root} width='100%' height='100%'>
      <Box className={classes.weekdaysWrapper}>
        {weekdays.map((day, index) => (
          <Box key={`${termName}-day-${index}`} className={classes.weekdays}>
            {day}
          </Box>
        ))}
      </Box>
      <PerfectScrollbar>
        <div className={`${classes.gridList} ${scrollClass}`}>
          {gradingPeriodKeys.map((periodName, index) => {
            //NOTE: 176 is width of each week column, 16 is padding right of last week column
            const width =
              Object.getOwnPropertyNames(newGradingPeriods[periodName]).length *
                176 -
              16;
            return (
              <div
                key={`grading-period-${index}`}
                className={classes.gradingPeriodWrapper}
              >
                {!hiddenGradingPeriodName && (
                  <div
                    className={`${classes.title} text-ellipsis`}
                    style={{ width }}
                  >
                    {termName} - {periodName}
                  </div>
                )}
                <Weeks
                  openCopyMenu={openCopyMenu}
                  onClickSchedule={onClickSchedule}
                  weeks={newGradingPeriods[periodName]}
                  increaseWeekFrom={getIncreaseWeekFrom(index)}
                />
              </div>
            );
          })}
        </div>
      </PerfectScrollbar>
    </Box>
  );
}

GradingPeriodList.propTypes = {
  termName: PropTypes.string,
  scrollClass: PropTypes.string,
  gradingPeriods: PropTypes.object,
  onClickSchedule: PropTypes.func,
  openCopyMenu: PropTypes.func,
  hiddenGradingPeriodName: PropTypes.bool,
};
