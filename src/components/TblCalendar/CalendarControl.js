import React from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

const styled = (theme) => ({
  root: {
    padding: 0,
    // height: '100%',
  },
  dayInfo: {
    position: 'relative',
    display: 'flex',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
  },
  noteType: {
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    '& .note-item': {
      border: `${theme.spacing(0.25)} solid ${theme.newColors.gray[500]}`,
      borderRadius: theme.spacing(0.5),
      background: theme.mainColors.blue[3],
      width: theme.spacing(6),
      height: theme.spacing(3),
      marginRight: theme.spacing(1),
    },
  },

  date: {
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
  },
  dateToday: {
    fontSize: theme.fontSize.normal,
    color: theme.newColors.gray[700],
  },
  left: {
    flex: 1,
  },
  calendarControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing(1),
  },
  controlButton: {
    backgroundColor: (props) =>
      props.view === 'daily' ? theme.newColors.gray[100] : 'white',
    marginRight: 2,
    height: theme.spacing(4),
    width: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  controlButtonLeft: {
    borderTopLeftRadius: theme.spacing(1),
    borderBottomLeftRadius: theme.spacing(1),
  },
  controlButtonRight: {
    borderTopRightRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
  },
  controlIcon: {
    color: theme.mainColors.primary1[0],
  },
  disabled: {
    color: theme.mainColors.gray[6],
    pointerEvents: 'none',
  },
  weekView: {
    '& $dayInfo': {
      marginBottom: 0,
    },
  },
  weekInfo: {
    fontSize: theme.fontSize.xMedium,
    color: theme.newColors.gray[700],
    fontWeight: theme.fontWeight.semi,
    minWidth: '350px',
  },
  weekNumber: {
    color: theme.palette.primary.main,
  },
});

class CalendarControl extends React.Component {
  constructor(props) {
    super(props);
    const currentDate = moment(props.defaultDateTime);

    this.state = {
      currentDate,
      startWeek: currentDate.clone().startOf('week'),
      endWeek: currentDate.clone().endOf('week'),
    };
  }

  onNext = () => {
    const { view, calendarRef, onNext } = this.props;
    const { currentDate, startWeek, endWeek } = this.state;

    calendarRef.current.getInstance().next();

    if (view === 'week') {
      const startNextWeek = startWeek.add(1, 'w').startOf('week');
      const endNextWeek = endWeek.add(1, 'w').endOf('week');

      onNext && onNext(startNextWeek, endNextWeek);
      this.setState({
        startWeek: startNextWeek,
        endWeek: endNextWeek,
      });
    } else {
      const nextDate = moment(currentDate).add(1, 'days');
      onNext && onNext(nextDate);
      this.setState({ currentDate: nextDate });
    }
  };

  onPrev = () => {
    const { view, calendarRef, onPrev } = this.props;
    const { currentDate, startWeek, endWeek } = this.state;

    calendarRef.current.getInstance().prev();

    if (view === 'week') {
      const startPreviousWeek = startWeek.subtract(1, 'w').startOf('week');
      const endPreviousWeek = endWeek.subtract(1, 'w').endOf('week');
      this.setState(
        {
          startWeek: startPreviousWeek,
          endWeek: endPreviousWeek,
        },
        () => {
          onPrev && onPrev({ startPreviousWeek, endPreviousWeek });
        }
      );
    } else {
      this.setState(
        { currentDate: moment(currentDate).subtract(1, 'day') },
        () => {
          onPrev && onPrev(this.state.currentDate);
        }
      );
    }
  };

  render() {
    const { classes, t, view, disabledNext, disabledPrev } = this.props;
    const { currentDate, startWeek, endWeek } = this.state;

    if (view === 'week') {
      return (
        <Box
          className={clsx(classes.root, {
            [classes.weekView]: view === 'week',
          })}
        >
          <Box className={classes.dayInfo}>
            <Box className={classes.weekLeft}>
              <div className={classes.weekInfo}>
                <span className={classes.weekNumber}>
                  {t('common:week')} {startWeek.week()}
                </span>{' '}
                {startWeek.format('ll')} - {endWeek.format('ll')}
              </div>
            </Box>
            <Box className={classes.calendarControl}>
              <div
                onClick={!disabledPrev && this.onPrev}
                className={clsx(
                  classes.controlButton,
                  classes.controlButtonLeft
                )}
              >
                <ChevronLeftIcon
                  className={clsx(classes.controlIcon, {
                    [classes.disabled]: disabledPrev,
                  })}
                />
              </div>
              <div
                onClick={!disabledPrev && this.onNext}
                className={clsx(
                  classes.controlButton,
                  classes.controlButtonRight,
                  { [classes.disabled]: disabledNext }
                )}
              >
                <ChevronRightIcon className={classes.controlIcon} />
              </div>
            </Box>
            <div className={classes.noteType}>
              <div className='note-item' />
              <span>{t('common:note-study-hall')}</span>
            </div>
          </Box>
        </Box>
      );
    }
    const isToday = moment(currentDate).isSame(moment(), 'day');
    return (
      <Box className={classes.root}>
        <Box className={classes.dayInfo}>
          <Box className={classes.left}>
            <Typography variant='labelLarge'>
              {moment(currentDate).format('dddd')}
            </Typography>
            <Typography Typography variant='labelLarge'>
              {moment(currentDate).format('MMM DD, YYYY')}{' '}
              {isToday && <span className={classes.dateToday}>(Today)</span>}
            </Typography>
          </Box>
          <Box className={classes.calendarControl}>
            <div
              onClick={!disabledPrev && this.onPrev}
              className={clsx(classes.controlButton, classes.controlButtonLeft)}
            >
              <ChevronLeftIcon
                className={clsx(classes.controlIcon, {
                  [classes.disabled]: disabledPrev,
                })}
              />
            </div>
            <div
              onClick={!disabledNext && this.onNext}
              className={clsx(
                classes.controlButton,
                classes.controlButtonRight,
                { [classes.disabled]: disabledNext }
              )}
            >
              <ChevronRightIcon className={classes.controlIcon} />
            </div>
          </Box>
        </Box>
      </Box>
    );
  }
}

CalendarControl.defaultProps = {
  // view: 'daily'
};

CalendarControl.propTypes = {
  classes: PropTypes.object,
  t: PropTypes.func,
  defaultDateTime: PropTypes.string,
  view: PropTypes.string,
  calendarRef: PropTypes.object,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  disabledNext: PropTypes.bool,
  disabledPrev: PropTypes.bool,
};

export default withStyles(styled)(CalendarControl);
