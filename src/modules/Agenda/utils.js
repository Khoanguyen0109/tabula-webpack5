import React from 'react';

import TblActivityIcon from 'components/TblActivityIcon/icon';

export const getIcon = (item, classIcon) => {
  const type =
    item?.shadowLessons || item?.lessonName
      ? 0
      : item?.shadowQuizzes?.masterQuiz?.quizType === 1 ||
        item?.quizType === 1 ||
        item?.shadowQuizzes?.masterQuiz?.quizType === 2 ||
        item?.quizType === 2
      ? 3
      : item?.shadowAssignments || item?.assignmentName
      ? 1
      : -1;
  return <TblActivityIcon type={type} className={classIcon} />;
  // if (item?.shadowLessons || item?.lessonName)
  //   return <ImportContactsIcon className={classIcon} />;
  // if (item?.shadowQuizzes?.masterQuiz?.quizType === 1 || item?.quizType === 1)
  //   return <PlaylistAddCheckIcon className={classIcon} />;
  // if (item?.shadowQuizzes?.masterQuiz?.quizType === 2 || item?.quizType === 2)
  //   return <PollIcon className={classIcon} />;
  // if (item?.shadowAssignments || item?.assignmentName)
  //   return <BallotIcon className={classIcon} />;
  // return <ImportContactsIcon className={classIcon} />;
};
