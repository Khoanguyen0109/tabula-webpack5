import React from 'react';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import Skeleton from '@mui/material/Skeleton';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import loadable from '@loadable/component';
import PropTypes from 'prop-types';

import TaskInformationAssignment from './TaskInformationAssignment';
import TaskInformationQuiz from './TaskInformationQuiz';

const AssignmentTaskContents = loadable(() =>
  import('./AssignmentTaskContents')
);
const QuizTaskContents = loadable(() => import('./QuizTaskContents'));

const TabContent = React.memo(({ currentTab, taskDetails, isFetching }) => {
  const type = taskDetails?.taskType;
  const { sectionId, courseId } = taskDetails;
  if (isEmpty(taskDetails)) {
    return <Skeleton />;
  }

  switch (currentTab) {
    case 0:
      switch (Number(type)) {
        case COURSE_ITEM_TYPE.ASSIGNMENT:
          return (
            <AssignmentTaskContents
              taskStatus={taskDetails.status}
              details={taskDetails?.shadowAssignment}
              sectionId={sectionId}
              courseIdProp={courseId}
              isFetching={isFetching}
            />
          );
        case COURSE_ITEM_TYPE.QUIZ:
          return (
            <QuizTaskContents
              taskStatus={taskDetails.status}
              details={taskDetails?.shadowQuiz}
              sectionId={sectionId}
              courseIdProp={courseId}
              isFetching={isFetching}
            />
          );
        default:
          return null;
      }
    case 1:
      if (type === COURSE_ITEM_TYPE.ASSIGNMENT) {
        return <TaskInformationAssignment details={taskDetails} />;
      }
      return <TaskInformationQuiz details={taskDetails} />;
    default:
      return null;
  }
}, isEqual);

TabContent.propTypes = {
  currentTab: PropTypes.number,
  taskDetails: PropTypes.object,
  isFetching: PropTypes.bool,
};

export default TabContent;
