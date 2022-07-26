import React from 'react';

import isEqual from 'lodash/isEqual';

import withStyles from '@mui/styles/withStyles';

import { HOUR_RANGE } from 'utils/constants';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import TuiCalendar from 'tui-calendar/dist/tui-calendar';
// import { infoByType } from 'modules/MyTasks/constants';

import 'tui-calendar/dist/tui-calendar.css';
import { TIME_BLOCK_STT } from '../../shared/MyTasks/constants';

import styles from './styled';
import { DEFAULT_TEMPLATE, WEEKLY_CUSTOM_THEME } from './theme';

/**
 * Calendar's options prop
 * @type {string[]}
 */
const optionProps = [
  'disableDblClick',
  'isReadOnly',
  'month',
  'scheduleView',
  'taskView',
  'theme',
  'timezones',
  'week'
];

class TblCalendar extends React.Component {
  rootEl = React.createRef();

  calendarInst = null;

  componentDidMount() {
    const {
      schedules = [],
      view,
      template,
      calendars,
      classes,
      checkExpectedConditionClick,
      checkExpectedConditionHover,
      checkExpectedConditionResize,
      disableClick,
      disableDblClick,
      height,
      month,
      timeBackground,
      onClickCreationGuide,
      onClickSchedule,
      scheduleView,
      showCreationGuideOnHover,
      showCreationGuideOnClick,
      onMouseEnterScheduleItem,
      onMouseLeaveScheduleItem,
      disabledGrid,
      defaultScrollToNow,
      taskView,
      useDetailPopup,
      week
    } = this.props;

    this.calendarInst = new TuiCalendar(
      this.rootEl.current,
      {
        calendars,
        classes,
        checkExpectedConditionClick,
        checkExpectedConditionHover,
        checkExpectedConditionResize,
        disableClick,
        disableDblClick,
        height,
        month,
        layerBackground: {
          timeBackgrounds: timeBackground,
          styleTimeBackground: () => ({ background: '#e6f7ff' }),
          elementTimeBackground: () => null
        },
        onClickCreationGuide,
        onClickSchedule,
        scheduleView,
        showCreationGuideOnHover,
        showCreationGuideOnClick,
        onMouseEnterScheduleItem,
        onMouseLeaveScheduleItem,
        disabledGrid: {
          isDisabled: disabledGrid?.isDisabled,
          hourDisabled: disabledGrid?.hourDisabled,
          elementDisabled: disabledGrid?.elementDisabled ||
            `<div class="due-date">
              <span class="due-date-title">Due: ${moment(disabledGrid?.hourDisabled).format('MM/DD - hh:mm a')}</span>
            </div>`
        },
        defaultScrollToNow,
        showHourEndOfDay: (hourStart, hourEnd) => hourEnd < 24,
        currentTimeSettings: {
          todayMarker: false,
          positionHourMarker: 'today', // today or all
          onlyShowInRange: () => {
            const currentHour = moment().hour();
            return currentHour >= HOUR_RANGE.START && currentHour <= HOUR_RANGE.END;
          }
        },
        timeDelay: {
          hover: 1000,
          click: 300
        },
        minuteCell: 15,
        taskView,
        useDetailPopup,
        week,
        timezones: [
          {
            timezoneOffset: moment().utcOffset(),
            tooltip: moment().tz()
          }
        ],
        theme: WEEKLY_CUSTOM_THEME,
        defaultView: view,
        template: {
          ...DEFAULT_TEMPLATE,
          ...template,
          timegridCurrentTime: () => moment().format('hh:mm a'),
          time: this.generalTimeTemplate
        },
        scheduleMinDuration: 1 //Fixed set time block exactly
      });

    this.setSchedules(schedules);

    this.bindEventHandlers(this.props);
  }

  shouldComponentUpdate(nextProps) {
    const { calendars, height, schedules, timeBackground, theme, view } = this.props;
    const options = this.calendarInst.getOptions();

    if (nextProps.schedules && !isEqual(schedules, nextProps.schedules)) {
      this.calendarInst.clear();
      this.setSchedules([...nextProps.schedules, ...nextProps.schedulesTmp]);
    }

    if (nextProps.timeBackground && !isEqual(timeBackground, nextProps.timeBackground)) {
      this.calendarInst.setTimeBackground(
        {
          ...options.layerBackground,
          timeBackgrounds: nextProps.timeBackground
        }
      );
    }

    if (height !== nextProps.height) {
      this.getRootElement().style.height = height;
    }

    if (calendars !== nextProps.calendars) {
      this.setCalendars(nextProps.calendars);
    }

    if (theme !== nextProps.theme) {
      this.calendarInst.setTheme(this.cloneData(nextProps.theme));
    }

    if (view !== nextProps.view) {
      this.calendarInst.changeView(nextProps.view);
    }

    optionProps.forEach((key) => {
      if (!isEqual(this.props[key], nextProps[key])) {
        this.setOptions(key, nextProps[key]);
      }
    });

    this.bindEventHandlers(nextProps);

    return false;
  }

  componentWillUnmount() {
    this.calendarInst.destroy();
  }

  cloneData = (data) => JSON.parse(JSON.stringify(data))

  setCalendars = (calendars) => {
    if (calendars && calendars.length) {
      this.calendarInst.setCalendars(calendars);
    }
  }

  setSchedules = (schedules) => {
    if (schedules && schedules.length) {
      this.calendarInst.createSchedules(schedules);
    }
  }

  setOptions = (propKey, prop) => {
    this.calendarInst.setOptions({ [propKey]: prop });
  }

  getInstance = () => this.calendarInst

  getRootElement = () => this.rootEl.current

  bindEventHandlers = (props) => {
    const eventHandlerNames = Object.keys(props).filter((key) => /^on[A-Z][a-zA-Z]+/.test(key));

    eventHandlerNames.forEach((key) => {
      const eventName = key[2].toLowerCase() + key.slice(3);
      this.calendarInst.off(eventName);
      this.calendarInst.on(eventName, props[key]);
    });
  };

  renderTextContent = (schedule, iconClass = '', showTime = true) => {
    const { title, start, end, raw } = schedule;

    const startTime = moment(new Date(start));
    const endTime = moment(new Date(end));

    const formatStart = startTime.format('hh:mm a');
    const formatEnd = endTime.format('hh:mm a');
    const timeDuration = startTime.diff(endTime, 'minutes');
    const showOneTextInLine = Math.abs(timeDuration) <= 15;
    const isSkippedOrEnded = raw.status === TIME_BLOCK_STT.ENDED || raw.status === TIME_BLOCK_STT.SKIPPED ? 'skipped-title': '';
    const textLengthForTruncate = title.length >= 80 ? 'text-ellipsis-2row' : '';
    return (
      `<div class='title-wrapper'>
          <div class='title-icon-wrapper' style="display: ${iconClass ? 'flex' : 'none'}">
            <div class="title-icon ${iconClass}" style="background-color: ${raw.color}"></div>
          </div>
          <div>
            <span class="${isSkippedOrEnded} title-activity ${textLengthForTruncate}">
              ${title}
            </span>${showOneTextInLine && showTime ? ', ' : '<br />'}
            ${showTime ? `<span class="time-value">${ formatStart } -  ${ formatEnd }</span>` : ''}
          </div >
      </div > `
    )
      ;
  };

  generalTimeTemplate = (schedule) => {
    const { hiddenTimeCreateTask, disableHover } = this.props;
    const { raw } = schedule;
    const isDisabled = raw?.isDisabled;
    //  NOTE: TL-3847 Remove icon and name prefix
    switch (true) {
      case raw?.isTask:
        return (
          `<div div class="${clsx('time-template', 'task-wrapper', isDisabled && 'block-disabled')}" style = "background: ${isDisabled ? raw.subColor : raw.color || 'white'}; color: ${isDisabled ? raw.color : 'white'} ; cursor: ${disableHover && 'default'}" >
            ${this.renderTextContent(schedule)}
           </div>`
        );
      case raw?.isCourse:
        return (
          `<div div class="${clsx('time-template', isDisabled && 'block-disabled')}" style = "border-color: ${raw.borderColor}; color: ${raw.color}; cursor: ${disableHover && 'default'}" >
            ${this.renderTextContent(schedule)}
          </div>`
        );
      case raw?.isActivity:
        return (
          `<div div class="${clsx('time-template', isDisabled && 'block-disabled')}" style = "background: ${raw.subColor || 'white'}; color: ${raw.color}; border-color: ${raw.color}; cursor: ${disableHover && 'default'}" >
            ${this.renderTextContent(schedule, 'extra-icon')}
          </div>`
        );
      case raw?.isDueDate:
        return (
          `<div div class="due-time-wrapper" >
            <span class="title text-ellipsis">${schedule.title}</span>
           </div>`
        );
      case raw?.isScheduleTemp:
        return (
          `<div div class="${clsx('time-template')}" style="color: 'white'; background: ${raw.color}" >
            ${this.renderTextContent(schedule)}
           </div>`
        );
      case raw?.isExtraCurricularTmp:
        return (
          `<div div class="time-template extra-curricular-tmp-wrapper" >
            ${this.renderTextContent(schedule, 'extra-icon')}
           </div>`
        );
      default:
        return (
          `<div div class="time-template" >
              ${this.renderTextContent(schedule, '', !hiddenTimeCreateTask)}
           </div>`
        );
    }
  }

  render() {
    const { classes, height } = this.props;

    return (
      <div
        ref={this.rootEl}
        className={clsx(classes.root, 'weekly-calendar')}
        style={{ height }}
      />
    );
  }
}

TblCalendar.defaultProps = {
  disableDblClick: true,
  disableClick: false,
  month: { startDayOfWeek: 0 },
  schedules: [],
  schedulesTmp: [],
  taskView: false,
  scheduleView: ['time'],
  useDetailPopup: true,
  useCreationPopup: true,
  view: 'week',
  hourStart: HOUR_RANGE.START,
  hourEnd: HOUR_RANGE.END,
  week: {
    hourStart: HOUR_RANGE.START,
    hourEnd: HOUR_RANGE.END,
    daynames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  template: {},
  calendars: [
    {
      id: '0',
      name: 'Available Time',
      bgColor: '#ffffff',
      borderColor: '#2eabff',
      color: '#2eabff',
    },
    {
      id: '1',
      name: 'Course',
      bgColor: '#ffffff',
    },
    {
      id: '2',
      name: 'Study Hall',
      bgColor: '#ffffff',
    },
    {
      id: '3',
      name: 'Task',
      color: '#43425d',
      bgColor: '#ffffff',
    }
  ],
  height: '500px',
};

TblCalendar.propTypes = {
  onClickCourseItem: PropTypes.func,
  disableDblClick: PropTypes.bool,
  disableClick: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  month: PropTypes.object,
  schedules: PropTypes.array,
  timeBackground: PropTypes.array,
  schedulesTmp: PropTypes.array,
  taskView: PropTypes.bool,
  scheduleView: PropTypes.array,
  useDetailPopup: PropTypes.bool,
  view: PropTypes.string,
  week: PropTypes.object,
  template: PropTypes.object,
  calendars: PropTypes.array,
  getSchedules: PropTypes.func,
  classes: PropTypes.object,
  checkExpectedConditionClick: PropTypes.func,
  checkExpectedConditionHover: PropTypes.func,
  checkExpectedConditionResize: PropTypes.func,
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onClickCreationGuide: PropTypes.func,
  onClickSchedule: PropTypes.func,
  showCreationGuideOnHover: PropTypes.bool,
  showCreationGuideOnClick: PropTypes.bool,
  onMouseEnterScheduleItem: PropTypes.func,
  onMouseLeaveScheduleItem: PropTypes.func,
  disabledGrid: PropTypes.object,
  defaultScrollToNow: PropTypes.bool,
  theme: PropTypes.object,
  hiddenTimeCreateTask: PropTypes.bool,
  disableHover: PropTypes.bool,
};

export default withStyles(styles)(TblCalendar);