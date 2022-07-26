import React from 'react';

import moment from 'moment';

import Calendar from '.';

export default function CalendarSample() {
  return <Calendar
    height='900px'
    disableDblClick={true}
    disableClick={true}
    isReadOnly={false}
    month={{
      startDayOfWeek: 0
    }}
    schedules={[
      {
          id: '1',
          calendarId: '1',
          raw: {
              isAvailableTime: true
          },
          title: 'Available Time',
          category: 'time',
          dueDateClass: '',
          start: moment().toISOString(),
          end: moment().add(1, 'hours').toISOString(),
          isReadOnly: true,
          borderColor: '#2eabff',
          color: '#2eabff'
      },
      {
          id: '1',
          calendarId: '3',
          title: 'Lunch (Non-Study)',
          category: 'time',
          dueDateClass: '',
          start: moment().add(1, 'days').toISOString(),
          end: moment().add(1, 'days').add(1, 'hours').toISOString(),
          isReadOnly: true,
          color: '#8e8e8e'
      },
      {
          id: '2',
          calendarId: '1',
          raw: {
              courseId: 1
          },
          category: 'time',
          title: 'Practice',
          dueDateClass: '',
          start: moment().add(2, 'days').toISOString(),
          end: moment().add(2, 'days').add(15, 'minutes').toISOString(),
          isReadOnly: true
      },
      {
          id: '21',
          calendarId: '4',
          raw: {
              courseId: 1
          },
          category: 'time',
          title: 'Practice test',
          // dueDateClass: 'due-date-start',
          // isDueDate: true,
          start: moment().add(1, 'days').add(15, 'minutes').toISOString(),
          end: moment().add(1, 'days').add(30, 'minutes').toISOString(),
          isReadOnly: true,
          bgColor: 'transparent'
      },
      {
          id: '21',
          calendarId: '1',
          raw: {
              courseId: 1
          },
          category: 'time',
          title: 'Practice ggggg',
          start: moment().add(2, 'days').add(40, 'minutes').toISOString(),
          end: moment().add(2, 'days').add(60, 'minutes').toISOString(),
          isReadOnly: false
      },
      {
          id: '3',
          calendarId: '1',
          title: 'FE Workshop',
          category: 'time',
          dueDateClass: '',
          start: moment().subtract(2, 'hours').toISOString(),
          end: moment().subtract(1, 'hours').toISOString(),
          isReadOnly: true,
          bgColor: '#ffffff',
          borderColor: '#685a7f',
          color: '#685a7f'
      },
      {
          id: '4',
          calendarId: '1',
          title: 'Report',
          category: 'time',
          dueDateClass: '',
          start: moment().add(3, 'days').toISOString(),
          end: moment().add(3, 'days').add(1, 'hours').toISOString(),
          isReadOnly: true
      },
      {
          id: '4',
          calendarId: '2',
          raw: {
              isStudyHall: true
          },
          title: 'Study Hall',
          category: 'time',
          dueDateClass: '',
          start: moment().subtract(1, 'hours').toISOString(),
          end: moment().subtract(15, 'minutes').toISOString()
      }
  ]}
    taskView={false}
    scheduleView={['time']}
    // startDisableGrid={moment().add(1, 'days').add(45, 'minutes').toISOString()}
  />;
}