import React from 'react';

import BallotRoundedIcon from '@mui/icons-material/BallotRounded';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import PollRoundedIcon from '@mui/icons-material/PollRounded';
// import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import Box from '@mui/material/Box';
import withStyles from '@mui/styles/withStyles';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblIconButton from 'components/TblIconButton';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import { QUIZ_TYPE } from '../../constants';

const styles = (theme) => ({
  root: {
    marginRight: theme.spacing(2),
  },
  unitContent: {
    backgroundColor: 'white',
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),

    '& .unit-name': {
      minHeight: theme.spacing(5.12),
      marginTop: theme.spacing(1.3),
      fontSize: theme.fontSize.normal,
      fontWeight: theme.fontWeight.semi,
    },
  },
  ellipsis2Row: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  rowIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .text': {
      flex: 1,
      marginLeft: theme.spacing(0.65),
      fontSize: theme.fontSize.small,
    },
    '& .create-activity': {
      color: theme.palette.primary.main,
      fontSize: theme.fontSize.normal,
    },
  },
  defaultIcon: {
    color: theme.palette.primary.main,
    fontSize: theme.fontSizeIcon.medium,
    cursor: 'pointer',
  },
  activityName: {
    cursor: 'pointer',
    marginRight: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    fontSize: theme.fontSize.normal,
  },
  dragIndicatorIcon: {
    color: theme.mainColors.gray[6],
    fontSize: theme.fontSizeIcon.small,
  },
});

class ActivityItem extends React.PureComponent {
  renderActivityIcon = () => {
    const { classes, activity, type } = this.props;
    const className = `${classes.defaultIcon}`;
    if (type === COURSE_ITEM_TYPE.ASSIGNMENT) {
      return <BallotRoundedIcon className={className} />;
    } else if (type === COURSE_ITEM_TYPE.QUIZ) {
      if (activity.quizType === QUIZ_TYPE.ANNOUNCED) {
        return <PlaylistAddCheckRoundedIcon className={className} />;
      }
      return <PollRoundedIcon className={className} />;
    }
    return <ImportContactsIcon className={className} />;
  };

  viewDetail = () => {
    const { onViewDetail, activity, unitInfo } = this.props;
    if (onViewDetail) {
      const item = { type: 'lesson', ...activity, unitInfo };
      onViewDetail(item);
    }
  };

  render() {
    const { classes, type, activity, onClickMoreIcon } = this.props;
    return (
      <Box
        className={classes.unitContent}
        key={`activity-${type}-${activity?.id}`}
        pt={1}
        pb={1}
      >
        <Box display='flex'>
          {/* <Box display='flex' alignSelf='center'>
            <DragIndicatorRoundedIcon className={classes.dragIndicatorIcon} />
          </Box> */}
          <Box
            className='text'
            display='flex'
            alignSelf='center'
            sx={{ lineHeight: 'normal' }}
            mr={0.5}
            ml={1}
            onClick={this.viewDetail}
          >
            {/* {this.renderActivityIcon()} */}
            <TblActivityIcon type={type} />
          </Box>
          <Box
            display='flex'
            alignSelf='center'
            justifyContent='flex-end'
            flexGrow={1}
          >
            {onClickMoreIcon && (
              <TblIconButton onClick={onClickMoreIcon(activity, type)}>
                <MoreVertIcon className={classes.defaultIcon} />
              </TblIconButton>
            )}
          </Box>
        </Box>
        <Box
          className={clsx(classes.ellipsis2Row, classes.activityName)}
          onClick={this.viewDetail}
        >
          {activity.name}
        </Box>
      </Box>
    );
  }
}

ActivityItem.propTypes = {
  classes: PropTypes.object,
  unitInfo: PropTypes.object,
  onViewDetail: PropTypes.func,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activity: PropTypes.object,
  onClickMoreIcon: PropTypes.func,
};

ActivityItem.defaultProps = {
  activity: {},
  classes: {},
};

export default withStyles(styles)(ActivityItem);
