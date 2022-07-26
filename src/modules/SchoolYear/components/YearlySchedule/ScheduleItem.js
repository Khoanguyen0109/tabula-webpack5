import React from 'react';

import isFunction from 'lodash/isFunction';

import makeStyles from '@mui/styles/makeStyles';

import moment from 'moment';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${theme.mainColors.gray[4]} `,
    borderRadius: theme.spacing(1),
    color: (props) => props.templateName ? theme.mainColors.primary1[1] : theme.newColors.gray[800],
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingLeft: theme.spacing(1),
    borderLeft: (props) => `10px solid ${props.templateName ? props.color : theme.mainColors.gray[2]}`,
    cursor: 'pointer',
    width: 160, 
    height: 64
  },
  date: {
    fontSize: theme.fontSize.small
  },
  templateName: {
    fontSize: theme.fontSize.normal
  }
}));

const ScheduleItem = ({schedule, onClick, selectLabel}) => {
  const classes = useStyles(schedule);
  const handleClickSchedule = (event) => {
    isFunction(onClick) && onClick(event?.currentTarget, schedule);
  };

  return (
    <div className={classes.root} onClick={handleClickSchedule}>
      <div className={classes.date}>{moment(schedule.date).format('MMM D, YYYY')}</div>
      <div className={`${classes.templateName} text-ellipsis`} component='div'>{schedule.templateName ? schedule.templateName : selectLabel}</div>
    </div>
  );
};
ScheduleItem.propTypes = {
  schedule: PropTypes.object,
  onClick: PropTypes.func,
  selectLabel: PropTypes.string
};

export default React.memo(ScheduleItem);
