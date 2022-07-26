import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblDrawer from 'components/TblDrawer';
import withReducer from 'components/TblWithReducer';

import loadable from '@loadable/component';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import agendaActions from 'modules/Agenda/actions';
import reducer from 'modules/MyCourses/reducers';
import moment from 'moment';
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

const StudentAssignmentDetailWithReducer = withReducer(
  'AllCourses',
  reducer
)(ViewAssignmentDetails);

const StudentLessonDetailWithReducer = withReducer(
  'AllCourses',
  reducer
)(ViewLessonDetails);

const StudentQuizDetailWithReducer = withReducer(
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
  titleName: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.semi,
  },
}));
// const myCoursesSelector = (state) => state.AllCourses;

function StudentViewActivityDrawer(props) {
  const { visible, onClose, agendaProps, activity, drawer1Ref } = props;

  const studentAgenda = useSelector((state) => state.Agenda.studentAgenda);
  const sectionDetail = useSelector((state) => state.Agenda.sectionDetail);
  const activityDetails = useSelector(
    (state) => state.AllCourses?.activityDetails
  );

  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation('agenda', 'common');
  const authContext = useContext(AuthDataContext);

  const {
    organizationId,
    organization: { timezone },
  } = authContext.currentUser;

  const toggleCloseDrawer = useCallback(() => {
    if (drawer1Ref) {
      drawer1Ref.current.classList.toggle('overlayed');
    }
    onClose();
  }, [drawer1Ref, onClose]);

  const studentGetAgendaDetail = useCallback(() => {
    if (agendaProps?.courseId && visible)
      dispatch(
        agendaActions.studentGetAgendaDetail({
          orgId: organizationId,
          courseId: agendaProps?.courseId,
          urlParams: {
            courseDayId: agendaProps?.courseDayId,
            date: moment(agendaProps?.start)?.format('YYYY-MM-DD'),
            timezone: timezone,
          },
        })
      );
  }, [agendaProps, dispatch, organizationId, timezone, visible]);

  useEffect(() => {
    studentGetAgendaDetail();
  }, [studentGetAgendaDetail]);

  const renderContent = (activity) => {
    if (activity?.shadowQuizzes) {
      return (
        <StudentQuizDetailWithReducer
          t={t}
          sectionId={sectionDetail?.sectionId}
          details={activityDetails}
          courseIdProp={studentAgenda?.courseId}
        />
      );
    }
    if (activity?.shadowAssignments) {
      return (
        <StudentAssignmentDetailWithReducer
          t={t}
          sectionId={sectionDetail?.sectionId}
          details={activityDetails}
          courseIdProp={studentAgenda?.courseId}
        />
      );
    }
    if (activity?.shadowLessons) {
      return (
        <StudentLessonDetailWithReducer
          t={t}
          sectionId={sectionDetail?.sectionId}
          lessonDetails={activityDetails}
          courseIdProp={studentAgenda?.courseId}
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
            <div>{getIcon(activity, classes.icon)}</div>
            <Typography noWrap className={classes.titleName}>
              {activity?.shadowAssignments?.masterAssignment?.assignmentName ||
                activity?.shadowQuizzes?.masterQuiz?.quizName ||
                activity?.shadowLessons?.masterLesson?.lessonName}
            </Typography>
            <div className={classes.closeIcon} onClick={toggleCloseDrawer}>
              <CloseIcon />
            </div>
          </div>
        }
        // ref={drawer1Ref}
        footer={null}
      >
        {renderContent(activity)}
      </TblDrawer>
    </>
  );
}

StudentViewActivityDrawer.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  agendaProps: PropTypes.object,
  activity: PropTypes.object,
  drawer1Ref: PropTypes.any,
};

export default StudentViewActivityDrawer;
