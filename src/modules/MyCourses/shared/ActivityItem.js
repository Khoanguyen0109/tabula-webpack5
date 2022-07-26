import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import TblIcon from 'components/TblActivityIcon/icon';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import clsx from 'clsx';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
      background: theme.newColors.gray[300]
    },
    '& .active': {
      color: theme.palette.secondary.main
    }
  },
  active: {
    background: theme.openColors.white,
  },
  activityName: {
    fontSize: theme.fontSize.normal,
    color: theme.palette.primary.main
  },
  defaultIcon: {
    color: theme.palette.primary.main,
    fontSize: theme.fontSizeIcon.medium,
    cursor: 'pointer'
  }
});

class ActivityItem extends React.PureComponent {
  onClickItem = () => {
    const { activity } = this.props;
    this.props.handleClickItem(activity);
  }

  render() {
    const { classes, activity, activeId } = this.props;
    const type = activity.itemType;
    let id = `${type}-${activity.id}`;
    if (type === COURSE_ITEM_TYPE.QUIZ) {
      id = `${id}-${activity.quizType}`;
    }
    const isActiveItem = id === activeId;
    const className = `${clsx(classes.defaultIcon, { 'active': isActiveItem })}`;
    return (
      <Box
        className={clsx(classes.root, { [classes.active]: isActiveItem })}
        key={`activity-${type}-${activity?.id}`}
        onClick={this.onClickItem}
      >
        <Box display='flex'>
          <Box className='text' display='flex' alignSelf='center' sx={{ lineHeight: 'normal' }} mr={1.5}>
            {/* {this.renderActivityIcon(type, isActiveItem)} */}
            <TblIcon type={type} className={className} />
          </Box>
          <Box display='flex' alignSelf='center' width={170}>
            <Typography component='span' className={`${clsx(classes.activityName, { 'active': isActiveItem })} text-ellipsis`}>
              {activity.name}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
}

ActivityItem.propTypes = {
  classes: PropTypes.object,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  activity: PropTypes.object,
  onClickMoreIcon: PropTypes.func,
  activeId: PropTypes.string,
  handleClickItem: PropTypes.func
};

ActivityItem.defaultProps = {
  activity: {},
  classes: {}
};

export default withStyles(styles)(ActivityItem);