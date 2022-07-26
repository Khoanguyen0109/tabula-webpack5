import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

import cloneDeep from 'lodash/cloneDeep';
import compose from 'lodash/flowRight';
import isString from 'lodash/isString';
import orderBy from 'lodash/orderBy';
import uniqueId from 'lodash/uniqueId';

import Box from '@mui/material/Box';
import withStyles from '@mui/styles/withStyles';

import Calendar from 'components/TblCalendar';
import CalendarControl from 'components/TblCalendar/CalendarControl';
import { MIN_SECONDS } from 'components/TblCalendar/constants';
import withReducer from 'components/TblWithReducer';

import { HOUR_RANGE } from 'utils/constants';

import StudentViewActivityDrawer from 'shared/MyCourses/containers/StudentViewActivityDrawer';

import clsx from 'clsx';
import reducers from 'modules/Agenda/reducers';
import moment from 'moment';
import PropTypes from 'prop-types';

import StudentAgendaDrawer from '../../../modules/Agenda/containers/StudentAgendaDrawer';
import { checkOverlapTimeDuration } from '../utils';

import ScheduleDetailPopup from './ScheduleDetailPopup';
import { getAvailableTime, getUsedTime } from './utils';

const hourStart = { hour: HOUR_RANGE.START, minute: 0 };

const hourEnd = { hour: HOUR_RANGE.END - 1, minute: 59 };
const styled = ({
  spacing,
  mainColors,
  newColors,
  fontSize,
  fontSizeIcon,
  fontWeight,
}) => ({
  root: {
    padding: 0,
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    position: 'relative',
  },
  calendarWrapper: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: 'white',
    padding: spacing(2, 0),
    border: `1px solid ${newColors.gray[300]}`,
    borderRadius: spacing(2),
    borderBottom: 'none',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    '& .tui-full-calendar-time-date': {
      marginLeft: 0,
    },
    '& .tui-full-calendar-time-guide-creation': {
      backgroundColor: 'transparent !important',
      border: 'none !important',
      left: '3px !important',
      right: '5px !important',
      '& .creation-content': {
        color: mainColors.cyan[2],
        fontSize: fontSize.small,
        position: 'relative',
        display: 'flex',
        '& .icon': {
          marginRight: spacing(1),
          fontSize: fontSizeIcon.small,
        },
        '& .task-name': {
          fontWeight: fontWeight.semi,
        },
      },
    },
  },
  calendarControl: {
    padding: spacing(1.2, 0),
  },
});

const convertWeekPoint = (weekPoint, time) =>
  (time ? moment(time) : moment()).weekday(weekPoint).format('YYYY-MM-DD');

class SetScheduleCalendar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentDate: moment(),
      startWeek: convertWeekPoint(0, props.defaultDateTime),
      endWeek: convertWeekPoint(6, props.defaultDateTime),
      visibleAgendaDrawer: false,
      agendaProps: {},
      visibleTaskDrawer: false,
      activitySelected: {},
    };

    this.calendarRef = React.createRef();

    this.intervalAfterRender = null;

    this.schedulesTmp = [];
    // a flag to reset schedule temp list, because 2 apis (getDetailTask, getScheduleCalendar) are fetched after created tasks.
    this.isJustCreated = false;
    this.visibleDefaultPopup = true;
    this.callbackDetailPopup = null; // to validate startTime, endTime after onChange DatePicker
  }

  componentDidMount() {
    const { defaultDateTime, schoolYearId } = this.props;
    if (schoolYearId) {
      this.getCalendarSchedules(schoolYearId, true);
    }
    if (defaultDateTime) {
      this.calendarRef.current.getInstance().setDate(new Date(defaultDateTime));
    }
  }

  componentDidUpdate(prevProps) {
    const {
      isFetchingCreateTask,
      isFetchingDailyCalendar,
      isFetchingCalendar,
      schoolYearId,
      isReSchedulesSuccess,
    } = this.props;
    if (+prevProps.schoolYearId !== +schoolYearId || isReSchedulesSuccess) {
      const resetOldCalendar = isReSchedulesSuccess ? false : true;
      this.getCalendarSchedules(schoolYearId, resetOldCalendar);
    }
    if (
      prevProps.isFetchingDailyCalendar !== isFetchingDailyCalendar &&
      prevProps.isFetchingDailyCalendar
    ) {
      if (this.callbackDetailPopup) {
        this.callbackDetailPopup();
      }
    }
    // set a flag to reset schedule temp list
    if (
      prevProps.isFetchingCreateTask !== isFetchingCreateTask &&
      prevProps.isFetchingCreateTask
    ) {
      this.isJustCreated = true;
    }
    // reset schedule temp list after created tasks.
    if (
      prevProps.isFetchingCalendar !== isFetchingCalendar &&
      prevProps.isFetchingCalendar
    ) {
      if (this.isJustCreated) {
        const calendarInstance = this.calendarRef.current.getInstance();
        for (let i = 0; i < this.schedulesTmp.length; i++) {
          const element = this.schedulesTmp[i];
          calendarInstance.deleteSchedule(element.id, element.calendarId);
        }
        this.isJustCreated = false;
        this.schedulesTmp = [];
      }
    }
  }

  componentWillUnmount() {
    this.unListen && this.unListen();
  }

  getDailyCalendarSchedules = async (startDate, endDate) => {
    const {
      currentUser,
      getDailyCalendarSchedules,
      match,
      isStudent,
      schoolYearId,
    } = this.props;
    const params = {
      startDate,
      endDate,
      schoolYearId,
      timezone: currentUser?.organization?.timezone,
    };
    if (!!!schoolYearId) {
      return;
    }
    if (!isStudent) {
      params.studentId = match?.params?.studentId;
    }
    getDailyCalendarSchedules({
      payloadDataDailyCalendar: {
        params,
        orgId: currentUser?.organizationId,
      },
      dailyCalendarSchedules: [],
      isFetchingDailyCalendar: true,
    });
  };

  getCalendarSchedules = (id, resetOldCalendar) => {
    const {
      currentUser,
      getCalendarSchedules,
      isRescheduleTimeBlock,
      match,
      isStudent,
      schoolYearId,
    } = this.props;
    const { startWeek, endWeek } = this.state;
    const params = {
      startDate: startWeek,
      endDate: endWeek,
      schoolYearId: id || schoolYearId,
      timezone: currentUser?.organization?.timezone,
    };
    if (!!!id && !!!schoolYearId) {
      return;
    }
    if (!isStudent) {
      params.studentId = match?.params?.studentId;
    }
    getCalendarSchedules({
      payloadDataCalendar: {
        params,
        orgId: currentUser?.organizationId,
        ...(isRescheduleTimeBlock?.timeBlockId && {
          taskRescheduled: isRescheduleTimeBlock.timeBlockId,
        }),
      },
      ...(resetOldCalendar && {
        calendarSchedules: [],
        calendarStudyHall: [],
        calendarAvailableTime: [],
      }),
      isFetchingCalendar: true,
    });
  };

  onNext = (startTime, endTime) => {
    const { schoolYearId } = this.props;
    const startWeek = startTime.format('YYYY-MM-DD');
    const endWeek = endTime.format('YYYY-MM-DD');
    this.setState({ startWeek, endWeek }, () => {
      this.getCalendarSchedules(schoolYearId);
    });
  };

  onPrev = (time) => {
    if (time.startPreviousWeek && time.endPreviousWeek) {
      const { schoolYearId } = this.props;
      const startWeek = time.startPreviousWeek.format('YYYY-MM-DD');
      const endWeek = time.endPreviousWeek.format('YYYY-MM-DD');
      this.setState({ startWeek, endWeek }, () => {
        this.getCalendarSchedules(schoolYearId);
      });
    }
  };

  onClickSchedule = ({ schedule, event }) => {
    const { isRescheduleTimeBlock, isCreateCurricular, isStudent } = this.props;
    // NOTE: Don't have action with extra curricular in schedule calendar
    if ((!!!isCreateCurricular && schedule?.raw?.isActivity) || !isStudent) {
      return;
    }

    if (
      isRescheduleTimeBlock?.timeBlockId &&
      schedule?.id === isRescheduleTimeBlock.timeBlockId
    ) {
      this.scheduleDetailPopupRef &&
        this.scheduleDetailPopupRef.openPopup(schedule, event);
    } else {
      if (
        (schedule?.raw?.clickable || schedule?.raw?.isActivity) &&
        this.scheduleDetailPopupRef
      ) {
        event.minTop = document
          .querySelector('.tui-full-calendar-timegrid-container')
          ?.getBoundingClientRect().top;
        this.scheduleDetailPopupRef.openPopup(schedule, event);
      }

      if (schedule?.raw?.isCourse && isCreateCurricular) {
        this.setState({
          visibleAgendaDrawer: true,
          agendaProps: {
            courseId: schedule?.raw?.courseId,
            courseDayId: schedule?.raw?.courseDayId,
            start: schedule?.raw?.timeFrom,
            end: schedule?.raw?.timeTo,
            courseName: schedule?.title,
          },
        });
      }

      if (schedule?.raw?.isTask && isCreateCurricular) {
        this.setState({
          visibleTaskDrawer: true,
          activitySelected: {
            ...schedule.raw,
            courseId: schedule?.raw?.courseId,
            // shadowId: schedule?.raw?.shadowAssignment?.id || schedule?.raw?.shadowQuiz?.id
          },
        });
      }
    }
  };

  onResizeSchedule = () => {};

  sortAvailableTime = (availableTime) =>
    availableTime.sort((a, b) =>
      a.timeFrom && b.timeFrom ? a.timeFrom - b.timeFrom : 0
    );

  onCreateSchedule = (startTime, endTime, event) => {
    const {
      t,
      detailActivity,
      onGetSchedule,
      isCreateCurricular,
      onCreateSchedule,
    } = this.props;
    const randomId = uniqueId();

    let scheduleSample = null;
    if (isCreateCurricular) {
      scheduleSample = {
        id: randomId,
        calendarId: '4',
        raw: {
          isExtraCurricularTmp: true,
          courseId: 1133,
          clickable: true,
        },
        category: 'time',
        title: t('extra_curricular'),
        start: startTime,
        end: endTime,
        isReadOnly: false,
        color: '#6dbde6',
        bgColor: '#dceff9',
      };
    } else {
      scheduleSample = {
        id: randomId,
        calendarId: '4',
        raw: {
          isScheduleTemp: true,
          courseId: 1133,
          clickable: true,
          color: detailActivity?.color,
          subColor: detailActivity?.subColor,
          typeName: detailActivity?.typeName,
          typeLabel: detailActivity?.typeLabel,
          typeIcon: detailActivity?.typeIcon,
          resizable: true,
        },
        category: 'time',
        title: detailActivity?.activityName,
        start: startTime,
        end: endTime,
        isReadOnly: false,
        color: detailActivity?.color,
        subColor: detailActivity?.subColor,
        bgColor: 'transparent',
      };
    }

    const schedulesTmpItem = {
      ...scheduleSample,
      timeFrom: new Date(startTime),
      timeTo: new Date(endTime),
    };

    onCreateSchedule &&
      onCreateSchedule(
        event,
        schedulesTmpItem,
        this.getCalendarInfo(),
        this.scheduleDetailPopupRef
      );

    this.schedulesTmp = this.sortAvailableTime([
      ...this.schedulesTmp,
      schedulesTmpItem,
    ]);
    onGetSchedule && onGetSchedule(this.schedulesTmp);

    const calendarInstance = this.calendarRef.current.getInstance();

    calendarInstance.createSchedules([scheduleSample]);
  };

  onUpdateSchedule = (schedule) => {
    const {
      onGetSchedule,
      onUpdateSchedule,
      isCreateCurricular,
      detailActivity,
      isRescheduleTimeBlock,
      dailyCalendarSchedules,
      calendarSchedules,
      hasDueDate,
    } = this.props;
    // NOTE: Check overlap time duration
    const { startWeek, endWeek } = this.state;
    const currentDate = moment(new Date(schedule.start)).clone();
    const startTime = moment(new Date(schedule.start));
    const endTime = moment(new Date(schedule.end));
    const dueTime = detailActivity?.dueTime;
    const sortUsedTime = getUsedTime({
      isCreateCurricular,
      dueTime: detailActivity?.dueTime,
      currentDate,
      isRescheduleTimeBlock,
      getSchedulesTmp: () => this.schedulesTmp,
      scheduleInfo: schedule,
      startTime,
      endTime,
      hourStart,
      hourEnd,
      dailyCalendarSchedules,
      calendarSchedules,
      startWeek,
      endWeek,
    });
    const availableTimeInscheduleDate = getAvailableTime(sortUsedTime);
    const hasOverlapTimeDuration = !checkOverlapTimeDuration(
      startTime,
      endTime,
      availableTimeInscheduleDate
    );
    const hasOverlapTimeWithDueDate =
      !isCreateCurricular &&
      hasDueDate &&
      (startTime.isSameOrAfter(dueTime) || endTime.isSameOrAfter(dueTime));
    if (hasOverlapTimeWithDueDate || hasOverlapTimeDuration) {
      return;
    }
    // FIXED: TL-3947 & TL-3945 Can resize a timeblock < 15mins
    const timeDuration = startTime.diff(endTime, 'minutes');
    const canUpdate = isRescheduleTimeBlock
      ? startTime.isSameOrBefore(endTime) && Math.abs(timeDuration) >= 15
      : true;
    const timeFrom = canUpdate ? schedule.start : schedule?.raw?.timeFrom;
    const timeTo = canUpdate ? schedule.end : schedule?.raw?.timeTo;
    // END: Check overlap time duration
    canUpdate &&
      onUpdateSchedule &&
      onUpdateSchedule(
        schedule,
        this.getCalendarInfo(),
        this.scheduleDetailPopupRef
      );
    const availableUpdated = this.schedulesTmp.map((e) =>
      e.id === schedule.id
        ? {
            ...e,
            start: schedule.tzStart || schedule.start.format(),
            end: schedule.tzEnd || schedule.end.format(),
            timeFrom,
            timeTo,
          }
        : e
    );

    this.schedulesTmp = this.sortAvailableTime(availableUpdated);
    this.visibleDefaultPopup = false; //NOTE: only visible popup detail for the first time when rescheduling

    onGetSchedule && onGetSchedule(this.schedulesTmp);

    const calendarInstance = this.calendarRef.current.getInstance();
    calendarInstance.updateSchedule(schedule.id, schedule.calendarId, {
      ...schedule,
      start: moment(timeFrom).format(),
      end: moment(timeTo).format(),
    });
  };

  onUpdateDetailPopup = (schedule) => {
    const { isCreateCurricular, onUpdateDetailPopup } = this.props;
    if (!!isCreateCurricular) {
      this.schedulesTmp = [];
      // NOTE: Fixed duplicate save data
      onUpdateDetailPopup &&
        onUpdateDetailPopup(
          schedule,
          this.getCalendarInfo(),
          this.scheduleDetailPopupRef
        );
    } else {
      this.onUpdateSchedule(schedule);
    }
    // NOTE: Fixed duplicate save data
    // onUpdateDetailPopup && onUpdateDetailPopup(schedule, this.getCalendarInfo(), this.scheduleDetailPopupRef);
  };

  onDeleteDetailPopup = (schedule) => {
    this.onDeleteSchedule(schedule);
  };

  onDeleteSchedule = (schedule) => {
    const { onDeleteSchedule, onGetSchedule, isCreateCurricular } = this.props;
    onDeleteSchedule &&
      onDeleteSchedule(
        schedule,
        this.getCalendarInfo(),
        this.scheduleDetailPopupRef
      );

    this.schedulesTmp = isCreateCurricular
      ? []
      : this.schedulesTmp.filter((e) => e.id !== schedule.id);
    onGetSchedule && onGetSchedule(this.schedulesTmp);

    const calendarInstance = this.calendarRef.current.getInstance();
    calendarInstance.deleteSchedule(schedule.id, schedule.calendarId);
  };

  getCalendarInfo = () => {
    const { currentUser, schoolYearId } = this.props;
    const { startWeek, endWeek } = this.state;
    return {
      payloadDataCalendar: {
        params: {
          startDate: startWeek,
          endDate: endWeek,
          schoolYearId,
          timezone: currentUser?.organization?.timezone,
        },
        orgId: currentUser?.organizationId,
      },
    };
  };

  renderNewTimeBlock = () => {
    const { t, detailActivity, isCreateCurricular } = this.props;
    if (isCreateCurricular) {
      return `<div class="creation-wrapper hover-none-style">
          <div class="creation-title">
            <i class="icon-icn_extraCurricular"></i>
            <span class="title text-ellipsis">${t('extra_curricular')}</span>
          </div>
        </div>`;
    }
    //  NOTE: TL-3847 Remove icon and name prefix
    return `<div class="block-temp" style="border-color: ${detailActivity?.color}; color: ${detailActivity?.color};">
         <span class='block-title'>${detailActivity?.activityName}</span>
      </div>`;
  };

  renderTimeRange = (time, rangeTime) => {
    const {
      detailActivity,
      defaultMinutesItem,
      calendarSchedules,
      calendarCollision,
      hasDueDate,
      isStudent,
    } = this.props;
    // NOTE: Guardian can not create data
    if (!isStudent) {
      return false;
    }

    const scheduledItems = orderBy(
      calendarSchedules.concat(this.schedulesTmp),
      this.filterSort,
      ['asc']
    );

    // const startRange = moment(new Date(rangeTime.nearestGridTimeY));
    const endRange = moment(new Date(rangeTime.nearestGridEndTimeY));

    const minSeconds = Math.max(defaultMinutesItem * 60, MIN_SECONDS);

    const currentStart = moment(new Date(time.nearestGridTimeY));
    const currentEnd = currentStart.clone().add(minSeconds, 'seconds');

    // endTime = startTime.clone().endOf('day');

    for (let i = 0; i < scheduledItems.length; i++) {
      const { start, end, isCollision } = scheduledItems[i];
      const existedFrom = this.parseMoment(start);
      const existedTo = this.parseMoment(end);
      if (!existedFrom.isSame(currentStart, 'day')) {
        continue;
      }
      if (currentStart.isSame(existedFrom)) {
        return false;
      }
      // new block collision with existed blocks.
      if (currentStart.isBetween(existedFrom, existedTo)) {
        const { start: nextStart } = scheduledItems[i + 1] || {};
        const nextExistedFrom = this.parseMoment(nextStart);
        // const nextExistedTo = this.parseMoment(nextEnd);
        const isSameDate = nextExistedFrom?.date() === existedFrom.date();

        const newFrom = existedTo.clone();
        const newTo = newFrom.clone().add(minSeconds, 'seconds');

        if (isCollision) {
          let rangeCollision = calendarCollision.find((e) =>
            currentStart.isBetween(e.start, e.end)
          );
          if (rangeCollision) {
            // get next existed item, which not be collision with other one.
            for (let j = 0; j < scheduledItems.length; j++) {
              const { isCollision, start } = scheduledItems[i + j] || {};
              if (!isCollision) {
                const timeByCollision = this.calculateSeconds(
                  rangeCollision.end,
                  this.parseMoment(start)
                );
                const isExtant =
                  this.calculateSeconds(currentStart, rangeCollision.end) <
                  MIN_SECONDS;
                if (timeByCollision > 0 && isExtant) {
                  return {
                    delta: timeByCollision,
                    nearestGridTimeY: rangeCollision.end.format(),
                  };
                }
                return false;
              }
            }
          }
          return false;
        }

        if (isSameDate && nextExistedFrom) {
          // if (currentStart.isBetween(nextExistedFrom, nextExistedTo) || currentEnd.isBetween(nextExistedFrom, nextExistedTo)) {
          //   return false;
          // }
          if (newTo.isAfter(nextExistedFrom)) {
            return {
              delta: this.calculateSeconds(newFrom, nextExistedFrom),
              nearestGridTimeY: newFrom.format(),
            };
          }
        }
        if (newTo.isAfter(endRange)) {
          return {
            delta: this.calculateSeconds(newFrom, endRange),
            nearestGridTimeY: newFrom.format(),
          };
        }
        return {
          delta: this.calculateSeconds(newFrom, newTo),
          nearestGridTimeY: newFrom.format(),
        };
      }
      if (
        existedFrom.isAfter(currentStart) &&
        currentEnd.isAfter(existedFrom)
      ) {
        return {
          delta: this.calculateSeconds(currentStart, existedFrom),
        };
      }
    }

    if (hasDueDate) {
      const dueTime = moment(detailActivity?.dueTime);
      // if resize a block over dueTime
      if (currentEnd.isAfter(dueTime)) {
        return {
          exception: dueTime.isSame(endRange, 'minute'),
          delta: this.calculateSeconds(currentStart, dueTime),
        };
      }
    }
    if (currentEnd.isAfter(endRange)) {
      return {
        exception: true, // because currentEnd = endRange - 1s
        delta: this.calculateSeconds(currentStart, endRange),
      };
    }
    return {
      delta: this.calculateSeconds(currentStart, currentEnd),
    };
  };

  getTooltipCalendar = (title, top, left) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-calendar';
    tooltip.textContent = title;
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = 9;
    tooltip.style.background = '#333';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '13px';
    tooltip.style.color = 'white';
    tooltip.style.top = top;
    tooltip.style.left = left;
    return tooltip;
  };

  handleErrorMinuteBlock = (evt) => {
    const { t } = this.props;
    const { pageX, offsetY } = evt?.originEvent;
    const container = document.querySelector(
      'div.tui-full-calendar-timegrid-container'
    );
    const sideBar = document.querySelector('[class*=sidebar-container]');
    const oldTooltip = document.querySelector('div.tooltip-calendar');

    if (oldTooltip) {
      oldTooltip.remove();
      clearTimeout(this.timeoutRemoveChild);
    }

    const tooltipTop = `${offsetY }px`;
    const tooltipLeft = `${pageX - sideBar.clientWidth - 40 }px`; // 40: padding-left of calendar content.
    const tooltip = this.getTooltipCalendar(
      t('myTasks:enough_min_minute_time_block'),
      tooltipTop,
      tooltipLeft
    );
    container.appendChild(tooltip);

    this.timeoutRemoveChild = setTimeout(() => {
      for (let i = 0; i < container.childNodes.length; i++) {
        const element = container.childNodes[i];
        if (element.className === tooltip.className) {
          container.removeChild(tooltip);
        }
      }
    }, 1000);
  };

  checkExpectedCondition = (evt, time, rangeTime, action) => {
    const newBlock = this.renderTimeRange(time, rangeTime);
    if (newBlock.delta < MIN_SECONDS && !newBlock?.exception) {
      if (action === 'click') {
        this.handleErrorMinuteBlock(evt);
      }
      return false;
    }
    return newBlock;
  };

  calculateSeconds = (date1, date2) => date2.diff(date1, 'seconds');

  parseMoment = (time) => {
    if (isString(time)) {
      return moment(time);
    }
    return moment(new Date(time));
  };

  filterSort = (e, type = 'start') => {
    if (moment.isMoment(e?.[type])) {
      return e?.[type].format();
    }
    return this.parseMoment(e?.[type]).format();
  };

  checkResize = (
    scheduledItems,
    { resizeTop, resizeBottom },
    scheduleTime,
    { initialStart, initialEnd },
    { startRange, endRange },
    scheduleInfo
  ) => {
    const { hasDueDate, detailActivity } = this.props;

    const checkContinueItem = (id, timeFrom) =>
      !timeFrom.isSame(scheduleTime, 'day') || id === scheduleInfo.id;

    if (resizeTop) {
      for (let j = scheduledItems.length - 1, i = j; i >= 0; i--) {
        const { id, start, end } = scheduledItems[i];
        const existedFrom = this.parseMoment(start);
        const existedTo = this.parseMoment(end);
        if (checkContinueItem(id, existedFrom)) {
          continue;
        }
        if (
          scheduleTime.isBefore(existedTo) &&
          existedTo.isBefore(initialEnd)
        ) {
          return this.calculateSeconds(initialStart, existedTo);
        }
      }
      if (scheduleTime.isBefore(startRange)) {
        return this.calculateSeconds(initialStart, startRange);
      }
    } else if (resizeBottom) {
      for (let i = 0, j = scheduledItems.length; i < j; i++) {
        const { id, start } = scheduledItems[i];
        const existedFrom = this.parseMoment(start);
        if (checkContinueItem(id, existedFrom)) {
          continue;
        }
        if (
          scheduleTime.isAfter(existedFrom) &&
          existedFrom.isAfter(initialStart)
        ) {
          return this.calculateSeconds(initialStart, existedFrom);
        }
      }
      if (hasDueDate) {
        const dueTime = moment(detailActivity?.dueTime);
        // if resize a block over dueTime
        if (scheduleTime.isAfter(dueTime)) {
          return this.calculateSeconds(initialStart, dueTime);
        }
      }
      if (scheduleTime.isSameOrAfter(endRange)) {
        return this.calculateSeconds(initialStart, endRange);
      }
    }
    return true;
  };

  checkExpectedConditionResize = (
    time,
    direction,
    initialSchedule,
    rangeTime,
    scheduleInfo
  ) => {
    const { isStudent, isCreateCurricular, calendarSchedules } = this.props;
    // NOTE: Guardian can not create data
    if (!isStudent) {
      return false;
    }

    const resizeTop = direction === 'top';
    const resizeBottom = direction === 'bottom';

    let scheduledItems = [];
    if (!!isCreateCurricular) {
      scheduledItems = calendarSchedules;
    } else {
      scheduledItems = calendarSchedules.concat(this.schedulesTmp);
    }
    const typeByDirection = resizeTop ? 'end' : 'start';
    scheduledItems = orderBy(
      scheduledItems,
      (element) => this.filterSort(element, typeByDirection),
      ['asc']
    );

    const startRange = moment(new Date(rangeTime?.nearestGridTimeY));
    const endRange = moment(new Date(rangeTime?.nearestGridEndTimeY));

    const initialStart = moment(new Date(initialSchedule.nearestGridTimeY));
    const initialEnd = moment(new Date(initialSchedule.nearestGridEndTimeY));

    const initialSeconds = this.calculateSeconds(initialStart, initialEnd);

    let scheduleTime = moment(new Date(time.nearestGridTimeY));

    if (scheduleTime.isAfter(initialStart, 'day')) {
      scheduleTime = endRange.clone();
    }
    if (
      resizeTop &&
      this.calculateSeconds(scheduleTime, initialEnd) <= MIN_SECONDS
    ) {
      return initialSeconds - MIN_SECONDS;
    }
    if (
      resizeBottom &&
      this.calculateSeconds(initialStart, scheduleTime) <= MIN_SECONDS
    ) {
      const minEndTime = initialStart.clone().add(MIN_SECONDS, 'seconds');
      if (minEndTime.isSameOrAfter(endRange)) {
        return this.calculateSeconds(initialStart, endRange);
      }
      return MIN_SECONDS;
    }
    return this.checkResize(
      scheduledItems,
      { resizeTop, resizeBottom },
      scheduleTime,
      { initialStart, initialEnd },
      { startRange, endRange },
      scheduleInfo
    );
  };

  onAfterRenderSchedule = ({ schedule }) => {
    const { onOpenDetailPopup } = this.props;
    if (schedule && this.visibleDefaultPopup) {
      onOpenDetailPopup &&
        onOpenDetailPopup(
          schedule,
          this.calendarRef,
          this.scheduleDetailPopupRef
        );
    }
  };

  onBeforeUpdateSchedule = ({ schedule, changes }) => {
    const newSchedule = cloneDeep(schedule);
    newSchedule.tzStart = changes?.start || schedule.start;
    newSchedule.tzEnd = changes?.end || schedule.end;
    newSchedule.start = moment(new Date(changes?.start || schedule.start));
    newSchedule.end = moment(new Date(changes?.end || schedule.end));
    this.onUpdateSchedule(newSchedule);
  };

  onMouseEnterScheduleItem = (evt, domElement, schedule) => {
    if (schedule?.raw?.resizable) {
      domElement.style.opacity = 0.8;
    }
  };

  onMouseLeaveScheduleItem = (evt, domElement, schedule) => {
    if (schedule?.raw?.resizable) {
      domElement.style.opacity = 1;
    }
  };

  onCloseAgendaDrawer = () => {
    this.setState({ visibleAgendaDrawer: false });
  };

  onCloseViewActivityDrawer = () => {
    this.setState({ visibleTaskDrawer: false, activitySelected: {} });
  };

  onChangeDatePicker = (startTime, endTime, setTimeValue) => {
    const { startWeek, endWeek } = this.state;
    const startDate = startTime.format('YYYY-MM-DD');
    const endDate = endTime.format('YYYY-MM-DD');
    this.callbackDetailPopup = null;
    if (!moment(startDate).isBetween(startWeek, endWeek, null, '[]')) {
      this.getDailyCalendarSchedules(startDate, endDate);
      this.callbackDetailPopup = setTimeValue;
    } else {
      setTimeValue();
    }
  };

  render() {
    const {
      t,
      classes,
      className,
      hasAvailableTime,
      hasDueDate,

      detailActivity,
      dailyCalendarSchedules,
      calendarSchedules,
      calendarStudyHall,

      isCreateCurricular,
      isRescheduleTimeBlock,
      defaultDateTime,
      isStudent,
    } = this.props;

    const {
      visibleTaskDrawer,
      activitySelected,
      agendaProps,
      visibleAgendaDrawer,
      startWeek,
      endWeek,
    } = this.state;

    let calendarProps = {
      schedules: calendarSchedules,
      timeBackground: calendarStudyHall,
      onMouseEnterScheduleItem: this.onMouseEnterScheduleItem,
      onMouseLeaveScheduleItem: this.onMouseLeaveScheduleItem,
      defaultScrollToNow: !isRescheduleTimeBlock,
    };

    if (hasDueDate) {
      calendarProps.disabledGrid = {
        isDisabled: true,
        hourDisabled: detailActivity?.dueTime,
      };
    }

    if (hasAvailableTime) {
      calendarProps.schedulesTmp = this.schedulesTmp;
      calendarProps.showCreationGuideOnClick = true;
      calendarProps.showCreationGuideOnHover = !!!isCreateCurricular;
      calendarProps.checkExpectedConditionClick = (evt, time, rangeTime) =>
        this.checkExpectedCondition(evt, time, rangeTime, 'click');
      calendarProps.checkExpectedConditionHover = this.checkExpectedCondition;
      calendarProps.checkExpectedConditionResize =
        this.checkExpectedConditionResize;
      calendarProps.template = {
        creationGuide: this.renderNewTimeBlock,
      };
    }

    return (
      <Box className={clsx(classes.root, className)}>
        <ScheduleDetailPopup
          t={t}
          startWeek={startWeek}
          endWeek={endWeek}
          formField={!!!isCreateCurricular && 'date-time'}
          onChangeDatePicker={this.onChangeDatePicker}
          ref={(c) => (this.scheduleDetailPopupRef = c)}
          onClose={this.onCloseDetailPopup}
          onUpdate={this.onUpdateDetailPopup}
          onDelete={this.onDeleteDetailPopup}
          isCreateCurricular={isCreateCurricular}
          isRescheduleTimeBlock={isRescheduleTimeBlock}
          getSchedulesTmp={() => this.schedulesTmp}
          getDailyCalendarSchedules={this.getDailyCalendarSchedules}
          dailyCalendarSchedules={dailyCalendarSchedules}
          calendarSchedules={calendarSchedules}
          dueTime={detailActivity?.dueTime}
        />
        <StudentAgendaDrawer
          agendaProps={agendaProps}
          visible={visibleAgendaDrawer}
          onClose={this.onCloseAgendaDrawer}
        />
        <StudentViewActivityDrawer
          visible={visibleTaskDrawer}
          activitySelected={activitySelected}
          onClose={this.onCloseViewActivityDrawer}
        />
        <Box className={classes.calendarControl}>
          <CalendarControl
            t={t}
            view='week'
            defaultDateTime={defaultDateTime}
            calendarRef={this.calendarRef}
            onNext={this.onNext}
            onPrev={this.onPrev}
          />
        </Box>
        <Box className={classes.calendarWrapper}>
          {detailActivity && (
            <Calendar
              ref={this.calendarRef}
              height='100%'
              month={{
                startDayOfWeek: 0,
              }}
              onBeforeUpdateSchedule={this.onBeforeUpdateSchedule}
              onAfterRenderSchedule={this.onAfterRenderSchedule}
              onResizeSchedule={this.onResizeSchedule}
              onClickSchedule={this.onClickSchedule}
              onDeleteSchedule={this.onDeleteSchedule}
              onClickCreationGuide={this.onCreateSchedule}
              useDetailPopup={false}
              disableHover={!isStudent}
              hiddenTimeCreateTask={isCreateCurricular}
              {...calendarProps}
            />
          )}
        </Box>
      </Box>
    );
  }
}

SetScheduleCalendar.defaultProps = {
  schedules: [],
  history: {},
  isCreateCurricular: false,
  isStudent: true,
  calendarStudyHall: [],
};

SetScheduleCalendar.propTypes = {
  calendarAvailableTime: PropTypes.array,
  calendarCollision: PropTypes.array,
  calendarSchedules: PropTypes.array,
  calendarStudyHall: PropTypes.array,
  className: PropTypes.string,
  classes: PropTypes.object,
  currentUser: PropTypes.object,
  dailyCalendarSchedules: PropTypes.array,
  defaultDateTime: PropTypes.string,
  defaultMinutesItem: PropTypes.number,
  detailActivity: PropTypes.object,
  getCalendarSchedules: PropTypes.func,
  getDailyCalendarSchedules: PropTypes.func,
  hasAvailableTime: PropTypes.bool,
  hasDueDate: PropTypes.bool,
  history: PropTypes.object,
  isCreateCurricular: PropTypes.bool,
  isFetchingCalendar: PropTypes.bool,
  isFetchingCreateTask: PropTypes.bool,
  isFetchingDailyCalendar: PropTypes.bool,
  isReSchedulesSuccess: PropTypes.bool,
  isRescheduleTimeBlock: PropTypes.object,
  isStudent: PropTypes.bool,
  location: PropTypes.object,
  match: PropTypes.object,
  onCreateSchedule: PropTypes.func,
  onDeleteSchedule: PropTypes.func,
  onGetSchedule: PropTypes.func,
  onOpenDetailPopup: PropTypes.func,
  onUpdateDetailPopup: PropTypes.func,
  onUpdateSchedule: PropTypes.func,
  schedules: PropTypes.array,
  schoolYearId: PropTypes.number,
  schoolYears: PropTypes.array,
  t: PropTypes.func,
};

export default compose(
  withStyles(styled),
  withTranslation(['myTasks', 'common']),
  withReducer('Agenda',reducers)
)(SetScheduleCalendar);
