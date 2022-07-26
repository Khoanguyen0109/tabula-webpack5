import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblDrawer from 'components/TblDrawer';
import withReducer from 'components/TblWithReducer';

import loadable from '@loadable/component';
import reducer from 'modules/MyCourses/reducers';
import PropTypes from 'prop-types';

import { getIcon } from '../utils';

const ViewLessonDetails = loadable(() =>
  import('modules/MyCourses/components/CourseContent/ViewLessonDetails')
);
const ViewQuizDetails = loadable(() =>
  import('modules/MyCourses/components/CourseContent/ViewQuizDetails')
);
const ViewAssignmentDetails = loadable(() =>
  import('modules/MyCourses/components/CourseContent/ViewAssignmentDetails')
);

const TeacherAssignmentDetailWithReducer = withReducer(
  'AllCourses',
  reducer
)(ViewAssignmentDetails);

const TeacherLessonDetailWithReducer = withReducer(
  'AllCourses',
  reducer
)(ViewLessonDetails);

const TeacherQuizDetailWithReducer = withReducer(
  'AllCourses',
  reducer
)(ViewQuizDetails);
const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
  },
  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  closeIcon: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    cursor: 'pointer',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 11,
  },
  contentWrapper: {
    paddingLeft: 8,
  },
  titleName: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.semi,
  },
}));
// const myCoursesSelector = (state) => state.AllCourses;

function TeacherViewActivityDrawer(props) {
  const {
    visible,
    onClose,
    // agendaProps,
    activity,
    drawer1Ref,
    viewLinkItem,
  } = props;

  // const studentAgenda = useSelector((state) => state.Agenda.studentAgenda);
  // const sectionDetail = useSelector((state) => state.Agenda.sectionDetail);
  const activityDetails = useSelector(
    (state) => state?.AllCourses?.activityDetails
  );
  const lessonDetail = useSelector((state) => state?.AllCourses?.lessonDetail);
  const [activeActivity, setActiveActivity] = React.useState(activity);

  const classes = useStyles();
  // const dispatch = useDispatch();
  const { t } = useTranslation('agenda', 'common');
  // const authContext = useContext(AuthDataContext);
  // const {
  // organizationId,
  // organization: { timezone },
  // } = authContext.currentUser;

  const toggleCloseDrawer = useCallback(() => {
    if (drawer1Ref) {
      drawer1Ref.current.classList.toggle('overlayed');
    }
    // setActiveActivity(null);
    onClose();
  }, [drawer1Ref, onClose]);

  // const studentGetAgendaDetail = useCallback(() => {
  //   if (agendaProps?.courseId && visible)
  //     dispatch(
  //       agendaActions.studentGetAgendaDetail({
  //         orgId: organizationId,
  //         courseId: agendaProps?.courseId,
  //         urlParams: {
  //           courseDayId: agendaProps?.courseDayId,
  //           date: moment(agendaProps?.start)?.format('YYYY-MM-DD'),
  //           timezone: timezone,
  //         },
  //       })
  //     );
  // }, [agendaProps, dispatch, organizationId, timezone, visible]);

  // useEffect(() => {
  //   studentGetAgendaDetail();
  // }, [studentGetAgendaDetail]);

  useEffect(() => {
    setActiveActivity(activity);
  }, [activity]);

  const renderContent = (activity) => {
    if (activity?.shadowQuizzes || activity?.quizName) {
      return (
        <TeacherQuizDetailWithReducer
          t={t}
          // sectionId={sectionDetail?.sectionId}
          details={{ masterQuiz: activityDetails }}
          viewLinkItem={viewLinkItem}
          // courseIdProp={studentAgenda?.courseId}
          teacherView
        />
      );
    }
    if (activity?.shadowAssignments || activity?.assignmentName) {
      return (
        <TeacherAssignmentDetailWithReducer
          t={t}
          // sectionId={sectionDetail?.sectionId}
          details={{ masterAssignment: activityDetails }}
          teacherView
          viewLinkItem={viewLinkItem}
          // courseIdProp={studentAgenda?.courseId}
        />
      );
    }
    if (activity?.shadowLessons || activity?.lessonName) {
      return (
        <TeacherLessonDetailWithReducer
          t={t}
          // sectionId={sectionDetail?.sectionId}
          lessonDetails={{ masterLesson: lessonDetail }}
          teacherView
          // courseIdProp={studentAgenda?.courseId}
          viewLinkItem={viewLinkItem}
          // isFetching={isFetchingLessonDetails}
        />
      );
    }
  };

  return (
    <>
      <TblDrawer
        anchor={'right'}
        open={visible}
        onClose={toggleCloseDrawer}
        title={
          <div className={classes.flexAlignCenter}>
            <div>{getIcon(activeActivity, classes.icon)}</div>
            <Typography noWrap className={classes.titleName}>
              {activeActivity?.shadowAssignments?.masterAssignment
                ?.assignmentName ||
                activeActivity?.shadowQuizzes?.masterQuiz?.quizName ||
                activeActivity?.shadowLessons?.masterLesson?.lessonName ||
                activeActivity?.lessonName ||
                activeActivity?.quizName ||
                activeActivity?.assignmentName}
            </Typography>
            <div className={classes.closeIcon} onClick={toggleCloseDrawer}>
              <CloseIcon />
            </div>
          </div>
        }
        // ref={drawer1Ref}
        footer={null}
      >
        <div className={classes.contentWrapper}>
          {renderContent(activeActivity)}
        </div>
      </TblDrawer>
    </>
  );
}

TeacherViewActivityDrawer.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  agendaProps: PropTypes.object,
  activity: PropTypes.object,
  drawer1Ref: PropTypes.any,
  viewLinkItem: PropTypes.func,
};

export default TeacherViewActivityDrawer;
