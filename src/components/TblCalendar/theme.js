const WEEKLY_CUSTOM_THEME = {
  // week header 'dayname'
  'week.dayname.height': '79px',
  'week.dayname.borderTop': 'none',
  'week.dayname.borderBottom': 'none',
  'week.dayname.borderLeft': 'none',
  'week.dayname.paddingLeft': '5px',
  'week.dayname.backgroundColor': 'inherit',
  'week.dayname.textAlign': 'center',
  'week.today.color': '#258fd6',
  'week.pastDay.color': '#7c7c7c',

  // week vertical panel 'vpanel'
  'week.vpanelSplitter.border': '1px solid #ecedf0',
  'week.vpanelSplitter.height': '3px',

  // week daygrid 'daygrid'
  'week.daygrid.borderRight': '1px solid #ecedf0',
  'week.daygrid.backgroundColor': 'inherit',

  'week.daygridLeft.width': '77px',
  'week.daygridLeft.backgroundColor': '#fff',
  'week.daygridLeft.paddingRight': '5px',
  'week.daygridLeft.borderRight': '1px solid #ecedf0',

  'week.today.backgroundColor': 'inherit',
  'week.weekend.backgroundColor': 'inherit',

  // week timegrid 'timegrid'
  'week.timegridLeft.width': '77px',
  'week.timegridLeft.backgroundColor': '#ffffff',
  'week.timegridLeft.borderRight': '1px solid #ecedf0',
  'week.timegridLeft.fontSize': '13px',
  'week.timegridLeftTimezoneLabel.height': '51px',
  'week.timegridLeftAdditionalTimezone.backgroundColor': '#fdfdfd',

  'week.timegridOneHour.height': '100px',
  'week.timegridHalfHour.height': '50px',
  'week.timegridHalfHour.borderBottom': '1px solid #ecedf0',
  'week.timegridHorizontalLine.borderBottom': '1px solid #ecedf0',

  'week.timegrid.paddingRight': '10px',
  'week.timegrid.borderRight': '1px solid #ecedf0',
  'week.timegridSchedule.borderRadius': '0',
  'week.timegridSchedule.paddingLeft': '0',

  'week.currentTime.color': '#d64531',
  'week.currentTime.fontSize': '13px',
  'week.currentTime.fontWeight': 'normal',

  'week.pastTime.color': '#7c7c7c',
  'week.pastTime.fontWeight': 'normal',

  'week.futureTime.color': '#7c7c7c',
  'week.futureTime.fontWeight': 'normal',

  'week.currentTimeLinePast.border': '1px solid #d64531',
  'week.currentTimeLineBullet.backgroundColor': '#d64531',
  'week.currentTimeLineToday.border': '1px solid #d64531',
  'week.currentTimeLineFuture.border': '1px solid #d64531',

  // week creation guide style
  'week.creationGuide.color': '#135de6',
  'week.creationGuide.fontSize': '13px',
  'week.creationGuide.fontWeight': 'bold',

  // week daygrid schedule style
  'week.dayGridSchedule.borderRadius': '0',
  'week.dayGridSchedule.height': '18px',
  'week.dayGridSchedule.marginTop': '2px',
  'week.dayGridSchedule.marginLeft': '10px',
  'week.dayGridSchedule.marginRight': '10px'
};

const DEFAULT_TEMPLATE = {
  weekDayname: function (dayname) {
    const color = dayname.isToday ? '#258fd6' : '#7c7c7c';
    const date = `${dayname.renderDate.split('-')[1]}/${dayname.renderDate.split('-')[2]}`;
    return `<span style="color: ${color}" class="calendar-week-dayname-name"><span class="day-name">${dayname.dayName}</span> <span class="date">${date}</span></span>`;
  },
};

export { WEEKLY_CUSTOM_THEME, DEFAULT_TEMPLATE };