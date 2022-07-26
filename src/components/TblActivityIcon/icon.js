import React from 'react';

// import { withStyles } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import { ReactComponent as IcnAssignment } from 'assets/images/icn_assignment.svg';
import { ReactComponent as IcnLesson } from 'assets/images/icn_lesson.svg';
import { ReactComponent as IcnMenu } from 'assets/images/icn_myCourses.svg';
import { ReactComponent as IcnQuiz } from 'assets/images/icn_quiz.svg';
import PropTypes from 'prop-types';

// import styles from './styles';

const TblIcon = (props) => {
  const { type, className, ...rest } = props;
  const renderIcon = () => {
    switch (type) {
      case COURSE_ITEM_TYPE.ASSIGNMENT:
        return IcnAssignment;
      case COURSE_ITEM_TYPE.QUIZ:
        return IcnQuiz;
      case 'lesson':
      case COURSE_ITEM_TYPE.LESSON:
        return IcnLesson;
      case 'myCourses':
        return IcnMenu;
      default:
        return IcnMenu;
    }
  };

  return (
    <Box display='flex'>
      <SvgIcon component={renderIcon()} className={className} {...rest} />
    </Box> 
  );
};

TblIcon.propTypes = {
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  quizType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  className: PropTypes.string,
  fontSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
};

TblIcon.defaultProps = {
  type: 0
};

// export default withStyles(styles)(TblIcon);
export default TblIcon;
