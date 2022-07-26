import React from 'react';
import { withTranslation } from 'react-i18next';

import compose from 'lodash/flowRight';
import isEqual from 'lodash/isEqual';

import { Box } from '@mui/material';
import withStyles from '@mui/styles/withStyles';

import Calendar from 'components/TblCalendar';
import CalendarControl from 'components/TblCalendar/CalendarControl';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

const styled = (theme) => ({
  root: {
    padding: 0,
    height: '100%',
    '& .tui-full-calendar-dayname-layout': {
      display: 'none',
    },
    '& .tui-full-calendar-timegrid-right': {
      border: `1px solid ${theme.newColors.gray[300]}`,
    },
  },
});

class DailyCalendar extends React.Component {
  calendarRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(),
    };

    this.intervalAfterRender = null;
  }

  componentDidMount() {
    this.calendarRef.current.getInstance().setDate(new Date());
    this.getSchedule(this.props.schoolYearSelected);
  }

  shouldComponentUpdate(nextProps) {
    if (
      !isEqual(nextProps.calendarSchedules, this.props.calendarSchedules) ||
      nextProps.schoolYearSelected !== this.props.schoolYearSelected ||
      nextProps.isFetchingCalendar !== this.props.isFetchingCalendar
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    const { schoolYearSelected } = this.props;
    if (
      schoolYearSelected !== prevProps.schoolYearSelected &&
      !!schoolYearSelected
    ) {
      this.getSchedule(schoolYearSelected);
    }
  }

  getSchedule = (schoolYearId) => {
    const { match, currentUser } = this.props;
    const { currentDate, schoolYearSelected } = this.state;
    const studentId = match.params.studentId;
    const params = {
      startDate: currentDate.format('YYYY-MM-DD'),
      endDate: currentDate.format('YYYY-MM-DD'),
      schoolYearId: schoolYearId || schoolYearSelected,
      timezone: currentUser?.timezone,
    };
    if (!!studentId) {
      params.studentId = studentId;
    }
    this.props.getCalendarSchedule({
      payloadDataCalendar: {
        params,
        orgId: currentUser?.organizationId,
      },
      calendarSchedules: [],
      isFetchingCalendar: true,
    });
  };

  onNext = () => {
    const { currentDate } = this.state;

    const nextDate = moment(currentDate).add(1, 'day');

    this.calendarRef.current.getInstance().setDate(new Date(nextDate.format()));
    this.setState({ currentDate: nextDate }, () => {
      this.getSchedule(this.props.schoolYearSelected);
    });
  };

  onPrev = () => {
    const { currentDate } = this.state;

    const prevDate = moment(currentDate).subtract(1, 'days');

    this.calendarRef.current.getInstance().setDate(new Date(prevDate.format()));
    this.setState({ currentDate: prevDate }, () => {
      this.getSchedule(this.props.schoolYearSelected);
    });
  };

  onClickSchedule = () => {
  };

  render() {
    const { classes, className, t, calendarSchedules } = this.props;

    return (
      <Box className={clsx(classes.root, className)}>
        <CalendarControl
          t={t}
          view='day'
          calendarRef={this.calendarRef}
          onNext={this.onNext}
          onPrev={this.onPrev}
        />
        <Calendar
          ref={this.calendarRef}
          view='day'
          height='100%'
          onClickSchedule={this.onClickSchedule}
          schedules={calendarSchedules}
          useDetailPopup={false}
          isReadOnly
        />
      </Box>
    );
  }
}

DailyCalendar.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  className: PropTypes.string,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  calendarSchedules: PropTypes.array,
  calendarStudyHall: PropTypes.array,
  onClickSchedule: PropTypes.func,
  match: PropTypes.object,
  currentUser: PropTypes.object,
  getCalendarSchedule: PropTypes.func,
  schoolYearSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isFetchingCalendar: PropTypes.bool,
};

DailyCalendar.defaultProps = {
  schedules: [],
};

export default compose(
  withTranslation(['myTasks', 'common']),
  withStyles(styled)
)(DailyCalendar);
