import React, { PureComponent } from 'react';

import debounce from 'lodash/debounce';
import trim from 'lodash/trim';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import withStyles from '@mui/styles/withStyles';

import TblButton from 'components/TblButton';
import { MIN_MINUTES } from 'components/TblCalendar/constants';
import TblInputs from 'components/TblInputs';

import { HOUR_RANGE } from 'utils/constants';

import { Form, Formik } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { checkBetweenDate, getAvailableTime, getUsedTime } from './utils';

const styled = (theme) => ({
  root: {
    padding: theme.spacing(1),
    width: 353,
  },
  iconWrapper: {
    height: '100%',
  },
  iconDelete: {
    color: theme.openColors.red[8],
    cursor: 'pointer',
  },
});

class ScheduleDetailPopup extends PureComponent {
  state = {
    open: false,
    scheduleInfo: {},
    scheduleEl: {},
    initialDate: null,
    startTime: null,
    endTime: null,
  };

  hourStart = { hour: HOUR_RANGE.START, minute: 0 };

  hourEnd = { hour: HOUR_RANGE.END - 1, minute: 59 };

  getAnchorInfo = () => {
    const { scheduleEl } = this.state;
    const offsetPosition = scheduleEl?.target
      ? scheduleEl.target.getBoundingClientRect()
      : scheduleEl;
    if (scheduleEl.maxTop < 280) {
      return {
        transformOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        anchorPosition: {
          top: offsetPosition?.top,
          left: offsetPosition?.left + offsetPosition?.width + 5,
        },
      };
    }
    if (scheduleEl.minTop && offsetPosition?.top < scheduleEl.minTop) {
      return {
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        anchorPosition: {
          top: scheduleEl.minTop,
          left: offsetPosition?.left + offsetPosition?.width + 5,
        },
      };
    }
    return {
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
      },
      anchorPosition: {
        top: offsetPosition?.top,
        left: offsetPosition?.left + offsetPosition?.width + 5,
      },
    };
  };

  getStatusPopup = () => this.state.open;

  openPopup = (scheduleInfo, scheduleEl) => {
    const startTime = moment(new Date(scheduleInfo.start));
    const endTime = moment(new Date(scheduleInfo.end));
    this.setState({
      open: true,
      scheduleInfo,
      scheduleEl,
      startTime,
      endTime,
      initialDate: startTime.clone(),
      currentDate: startTime.clone(),
    });
  };

  closePopup = () => {
    const { onClose } = this.props;
    onClose && onClose();
    this.setState({
      open: false,
      scheduleInfo: {},
      scheduleEl: {},
      initialDate: null,
      startTime: null,
      endTime: null,
      currentDate: null,
    });
  };

  onUpdateSchedule = (values) => {
    const { onUpdate } = this.props;
    const { dateTime, timeFrom, timeTo } = values;
    const currentDateTime = moment(dateTime);
    const startTime = moment(timeFrom);
    const endTime = moment(timeTo);
    onUpdate &&
      onUpdate({
        ...this.state.scheduleInfo,
        start: currentDateTime
          .clone()
          .set({ hour: startTime.hour(), minute: startTime.minutes() }),
        end: currentDateTime
          .clone()
          .set({ hour: endTime.hour(), minute: endTime.minutes() }),
        date: currentDateTime.clone().format('YYYY-MM-DD'),
        activityName: trim(values.name),
      });
    this.closePopup();
  };

  onDeleteSchedule = () => {
    const { onDelete } = this.props;
    onDelete && onDelete(this.state.scheduleInfo);
    this.closePopup();
  };

  render() {
    const {
      classes,
      t,
      isCreateCurricular,
      isRescheduleTimeBlock,
      getSchedulesTmp,
      dueTime,
      formField,
      onChangeDatePicker,
      dailyCalendarSchedules,
      calendarSchedules,
      startWeek,
      endWeek,
    } = this.props;
    const { open, scheduleInfo, initialDate, startTime, endTime, currentDate } =
      this.state;

    const isDateTimePicker = formField === 'date-time';
    // const isTimePicker = formField === 'time';

    if (!open) {
      return null;
    }

    const name = scheduleInfo?.raw?.name;
    // NOTE: Only allow to set time from 00:00 Am to 23:59 PM

    const timeRange = {
      hourStart: moment(currentDate).set(this.hourStart),
      hourEnd: moment(currentDate).set(this.hourEnd),
    };

    const dateRange = {
      start: isRescheduleTimeBlock ? moment() : null,
      end: !!!isCreateCurricular ? moment(dueTime) : null,
    };
    // NOTE: Get all of time selected in calendar and except current time editing
    const sortUsedTime = getUsedTime({
      isCreateCurricular,
      dueTime,
      currentDate,
      isRescheduleTimeBlock,
      getSchedulesTmp,
      scheduleInfo,
      startTime,
      endTime,
      hourStart: this.hourStart,
      hourEnd: this.hourEnd,
      dailyCalendarSchedules,
      calendarSchedules,
      startWeek,
      endWeek,
    });
    const availableTimeInscheduleDate = getAvailableTime(sortUsedTime);
    const validateName = isCreateCurricular
      ? Yup.string().trim().required(t('common:required_message'))
      : '';

    const validateDateTime = {
      dateTime: Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .required(t('common:required_message'))
        .isBetweenDate(
          Yup.ref('dateTime'),
          t('common:over_dueTime'),
          dateRange.start,
          dateRange.end
        ),
    };

    const validateTimeFrom = {
      timeFrom: Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .required(t('common:required_message'))
        .compareTimeDuration(
          Yup.ref('timeTo'),
          t('common:less_than', { from: t('start_time'), to: t('end_time') }),
          false,
          Yup.ref('dateTime')
        )
        .compareLimitTimeLastDuration(
          Yup.ref('timeTo'),
          t('common:last_duration_at_least', { lowerLimit: MIN_MINUTES - 1 }),
          MIN_MINUTES - 1,
          timeRange,
          Yup.ref('dateTime')
        )
        .compareLimitTimeDuration(
          Yup.ref('timeTo'),
          t('common:duration_at_least', {
            ObjectName: isCreateCurricular ? 'Extra Curricular' : 'Task',
            lowerLimit: MIN_MINUTES,
          }),
          false,
          MIN_MINUTES,
          timeRange,
          Yup.ref('dateTime')
        )
        .compareOverlapTimeDuration(
          Yup.ref('timeTo'),
          t('common:conflict_with_another_entry'),
          availableTimeInscheduleDate,
          Yup.ref('dateTime')
        ),
    };

    const validateTimeTo = {
      timeTo: Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .required(t('common:required_message'))
        .isBetweenTime(
          Yup.ref('timeFrom'),
          t('common:over_dueTime'),
          Yup.ref('dateTime'),
          dateRange.start,
          dateRange.end
        )
        .compareTimeDuration(
          Yup.ref('timeFrom'),
          t('common:more_than', { from: t('start_time'), to: t('end_time') }),
          true,
          Yup.ref('dateTime')
        )
        .compareLimitTimeLastDuration(
          Yup.ref('timeFrom'),
          t('common:last_duration_at_least', { lowerLimit: MIN_MINUTES - 1 }),
          MIN_MINUTES - 1,
          timeRange,
          Yup.ref('dateTime')
        )
        .compareLimitTimeDuration(
          Yup.ref('timeFrom'),
          t('common:duration_at_least', {
            ObjectName: isCreateCurricular ? 'Extra Curricular' : 'Task',
            lowerLimit: MIN_MINUTES,
          }),
          true,
          MIN_MINUTES,
          timeRange,
          Yup.ref('dateTime')
        )
        .compareOverlapTimeDuration(
          Yup.ref('timeFrom'),
          t('common:conflict_with_another_entry'),
          availableTimeInscheduleDate,
          Yup.ref('dateTime')
        ),
    };

    const validationSchema = Yup.object()
      .nullable()
      .shape({
        name: validateName,
        ...(isDateTimePicker ? validateDateTime : {}),
        ...validateTimeFrom,
        ...validateTimeTo,
      });

    const { transformOrigin, anchorPosition } = this.getAnchorInfo();
    return (
      <Popover
        open={open}
        anchorReference='anchorPosition'
        anchorPosition={anchorPosition}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={transformOrigin}
        // NOTE: Close popup when clicking outside
        onClose={
          !!!name && isCreateCurricular
            ? this.onDeleteSchedule
            : this.closePopup
        }
      >
        <Paper className={classes.root}>
          <ClickAwayListener>
            <Formik
              initialValues={{
                name: name,
                dateTime: initialDate.format(),
                timeFrom: startTime.format(),
                timeTo: endTime.format(),
              }}
              onSubmit={this.onUpdateSchedule}
              validationSchema={validationSchema}
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({
                errors,
                touched,
                values,
                setValues,
                setFieldValue,
                setFieldTouched,
                isSubmitting,
                handleSubmit,
              }) => {
                const onChangeField = (field, e) => {
                  let value = e;
                  if (['timeFrom', 'timeTo'].includes(field) && e?.isValid()) {
                    value = moment(values.dateTime)
                      .clone()
                      .set({
                        hour: e.hour(),
                        minute: e.minute(),
                        second: e.second(),
                        millisecond: 0,
                      });
                  }
                  setFieldValue(field, value);
                  setFieldTouched(field, true);
                };
                return (
                  <Form>
                    <Grid container>
                      {isCreateCurricular && (
                        <Grid item xs={12}>
                          <TblInputs
                            name='name'
                            required
                            placeholder={t('common:enter_name')}
                            label={t('common:name')}
                            inputProps={{ maxLength: 254 }}
                            error={
                              !!(errors.name && (touched.name || isSubmitting))
                            }
                            errorMessage={
                              !!(
                                errors.name &&
                                (touched.name || isSubmitting)
                              ) ? (
                                <div>{errors.name}</div>
                              ) : (
                                false
                              )
                            }
                            onChange={(e) =>
                              onChangeField('name', e.target.value)
                            }
                            value={values.name}
                            disabled={!!name}
                          />
                        </Grid>
                      )}
                      {isDateTimePicker && (
                        <Grid item xs={12}>
                          <TblInputs
                            name='dateTime'
                            required
                            inputType='date'
                            // format='hh:mm a'
                            // placeHolder='hh:mm am/pm'
                            // mask='__:__ _m'
                            label={t('date_time')}
                            error={
                              !!(
                                errors.dateTime &&
                                (touched.dateTime || isSubmitting)
                              )
                            }
                            errorMessage={
                              !!(
                                errors.dateTime &&
                                (touched.dateTime || isSubmitting)
                              ) ? (
                                <div>{errors.dateTime}</div>
                              ) : (
                                false
                              )
                            }
                            onChange={(dateTimeValue) => {
                              this.setState(
                                { currentDate: dateTimeValue },
                                () => {
                                  const { currentDate } = this.state;
                                  const newValues = {
                                    ...values,
                                    dateTime: currentDate?.format() || '',
                                  };

                                  setFieldValue('dateTime', newValues.dateTime);
                                  setFieldTouched('dateTime', true);
                                  // setFieldTouched 'false' because not need to validate timeFrom and timeTo immediately when change dateTime.
                                  setFieldTouched('timeFrom', false);
                                  setFieldTouched('timeTo', false);

                                  const dateTime = moment(newValues.dateTime);
                                  if (dateTime.isValid()) {
                                    const from = moment(newValues.timeFrom),
                                      to = moment(newValues.timeTo);
                                    const valueFrom = dateTime
                                      .clone()
                                      .set({
                                        hour: from.hour(),
                                        minute: from.minute(),
                                        second: from.second(),
                                        millisecond: 0,
                                      });
                                    const valueTo = dateTime
                                      .clone()
                                      .set({
                                        hour: to.hour(),
                                        minute: to.minute(),
                                        second: to.second(),
                                        millisecond: 0,
                                      });
                                    const setDateTime = debounce(() => {
                                      setValues({
                                        ...newValues,
                                        timeFrom: valueFrom,
                                        timeTo: valueTo,
                                      });
                                      setFieldTouched('timeFrom', true);
                                      setFieldTouched('timeTo', true);
                                    }, 100);

                                    // only fetch dailyCalendar when currentDate's valid.
                                    if (
                                      !!onChangeDatePicker &&
                                      checkBetweenDate(
                                        dateTime,
                                        dateRange.start,
                                        dateRange.end
                                      )
                                    ) {
                                      onChangeDatePicker(
                                        valueFrom,
                                        valueTo,
                                        setDateTime
                                      );
                                    } else {
                                      setDateTime();
                                    }
                                  }
                                }
                              );
                            }}
                            value={values.dateTime}
                            disabled={!!name && !isRescheduleTimeBlock}
                            minDate={dateRange.start || undefined}
                            maxDate={dateRange.end || undefined}
                          />
                        </Grid>
                      )}
                      <Grid item xs={6}>
                        <Box mr={1}>
                          <TblInputs
                            name='timeFrom'
                            required
                            inputType='time'
                            format='hh:mm a'
                            placeHolder='hh:mm am/pm'
                            mask='__:__ _m'
                            label={t('start_time')}
                            error={
                              !!(
                                errors.timeFrom &&
                                (touched.timeFrom || isSubmitting)
                              )
                            }
                            errorMessage={
                              !!(
                                errors.timeFrom &&
                                (touched.timeFrom || isSubmitting)
                              ) ? (
                                <div>{errors.timeFrom}</div>
                              ) : (
                                false
                              )
                            }
                            onChange={(value) =>
                              onChangeField('timeFrom', value)
                            }
                            value={values.timeFrom}
                            disabled={!!name && !isRescheduleTimeBlock}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box ml={1}>
                          <TblInputs
                            name='timeTo'
                            required
                            inputType='time'
                            format='hh:mm a'
                            placeHolder='hh:mm am/pm'
                            mask='__:__ _m'
                            label={t('end_time')}
                            error={
                              !!(
                                errors.timeTo &&
                                (touched.timeTo || isSubmitting)
                              )
                            }
                            errorMessage={
                              !!(
                                errors.timeTo &&
                                (touched.timeTo || isSubmitting)
                              ) ? (
                                <div>{errors.timeTo}</div>
                              ) : (
                                false
                              )
                            }
                            onChange={(value) => onChangeField('timeTo', value)}
                            value={values.timeTo}
                            disabled={!!name && !isRescheduleTimeBlock}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={5}>
                        {(!!name || !isCreateCurricular) &&
                          !isRescheduleTimeBlock && (
                            <Grid
                              container
                              direction='row'
                              justifyContent='flex-start'
                              alignItems='center'
                              className={classes.iconWrapper}
                            >
                              {/* NOTE: Make the “delete timeblock” icon more clear */}
                              <Box
                                mt={3}
                                display='flex'
                                className={classes.iconDelete}
                                onClick={this.onDeleteSchedule}
                              >
                                <DeleteOutlineIcon />
                                <Box display='flex' alignItems='center'>
                                  {t('common:delete')}
                                </Box>
                              </Box>
                            </Grid>
                          )}
                      </Grid>
                      <Grid item xs={7}>
                        <Grid
                          container
                          direction='row'
                          justifyContent='flex-end'
                          alignItems='center'
                          spacing={0}
                        >
                          <Box mr={1} mt={3}>
                            <TblButton
                              variant='outlined'
                              color='primary'
                              onClick={
                                !!!name && isCreateCurricular
                                  ? this.onDeleteSchedule
                                  : this.closePopup
                              }
                            >
                              {t(
                                `common:${
                                  !!!name || isRescheduleTimeBlock
                                    ? 'cancel'
                                    : 'close'
                                }`
                              )}
                            </TblButton>
                          </Box>
                          {(!!!name || !isCreateCurricular) && (
                            <Box mt={3}>
                              <TblButton
                                variant='contained'
                                color='primary'
                                type='submit'
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                              >
                                {t(
                                  `common:${
                                    !!!name && isCreateCurricular
                                      ? 'add'
                                      : 'apply'
                                  }`
                                )}
                              </TblButton>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </ClickAwayListener>
        </Paper>
      </Popover>
    );
  }
}

ScheduleDetailPopup.defaultProps = {
  formField: 'time',
};

ScheduleDetailPopup.propTypes = {
  t: PropTypes.func,
  open: PropTypes.bool,
  formField: PropTypes.string,
  classes: PropTypes.object,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onClose: PropTypes.func,
  getSchedulesTmp: PropTypes.func,
  isCreateCurricular: PropTypes.bool,
  isRescheduleTimeBlock: PropTypes.bool,
  calendarSchedules: PropTypes.array,
  dueTime: PropTypes.string,
  onChangeDatePicker: PropTypes.func,
  dailyCalendarSchedules: PropTypes.array,
  startWeek: PropTypes.string,
  endWeek: PropTypes.string,
};

export default withStyles(styled)(ScheduleDetailPopup);
