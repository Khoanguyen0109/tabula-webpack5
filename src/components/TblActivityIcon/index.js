import React from 'react';

import isNil from 'lodash/isNil';

import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import { ReactComponent as IcnAssignment } from 'assets/images/icn_assignment.svg';
import { ReactComponent as IcnLesson } from 'assets/images/icn_lesson.svg';
import { ReactComponent as IcnQuiz } from 'assets/images/icn_quiz.svg';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// import BallotRoundedIcon from '@mui/icons-material/BallotRounded';
// import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
// import PollRoundedIcon from '@mui/icons-material/PollRounded';
// import ImportContactsIcon from '@mui/icons-material/ImportContacts';

import styles from './styles';

// import styles from './styles';

const TblActivityIcon = (props) => {
  const { /* classes,*/ type, name, color, iconColor, variant } = props;

  const renderIcon = () => {
    switch (Number(type)) {
      case COURSE_ITEM_TYPE.ASSIGNMENT:
        return <SvgIcon component={IcnAssignment} />;
      case COURSE_ITEM_TYPE.QUIZ:
        return <SvgIcon component={IcnQuiz} />;
      case COURSE_ITEM_TYPE.LESSON:
        return <SvgIcon component={IcnLesson} />;
      default:
        return <AssignmentOutlinedIcon />;
    }
  };

  return (
    <Box display='flex' width='100%'>
      {!isNil(type) && (
        <Box
          display='flex'
          alignItems='center'
          color={iconColor}
          className={clsx('important-icon')}
        >
          {' '}
          {renderIcon()}{' '}
        </Box>
      )}
      {!isNil(name) && (
        <Box
          display='flex'
          width='100%'
          ml={0.5}
          className={clsx('text-ellipsis-2row', 'important-icon-title')}
          color={color}
        >
          <Typography
            width='100%'
            variant={variant || 'labelLarge'}
            color='primary'
            className='text-ellipsis'
          >
            {name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

TblActivityIcon.propTypes = {
  classes: PropTypes.object,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  quizType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  iconColor: PropTypes.string,
  variant: PropTypes.string,
};

TblActivityIcon.defaultProps = {
  color: 'primary',
};

export default withStyles(styles)(TblActivityIcon);
