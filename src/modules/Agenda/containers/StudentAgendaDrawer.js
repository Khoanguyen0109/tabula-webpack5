import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CloseIcon from '@mui/icons-material/Close';
import makeStyles from '@mui/styles/makeStyles';

import TblDrawer from 'components/TblDrawer';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import agendaActions from 'modules/Agenda/actions';
import myCourseActions from 'modules/MyCourses/actions';
import moment from 'moment';
import PropTypes from 'prop-types';

import AgendaContent from '../components/AgendaContent';

const useStyles = makeStyles(() => ({
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
}));
// const myCoursesSelector = (state) => state.AllCourses;

function StudentAgendaDrawer(props) {
  const { visible, onClose, agendaProps } = props;

  const studentAgendaDetail = useSelector(
    (state) => state.Agenda.studentAgendaDetail
  );
  const studentAgenda = useSelector((state) => state.Agenda.studentAgenda);
  const sectionDetail = useSelector((state) => state.Agenda.sectionDetail);

  const Adrawer1Ref = React.createRef(null);
  const [drawer1Ref] = React.useState(Adrawer1Ref);
  // const activityDetails = useSelector((state) => state.AllCourses.activityDetails);

  const classes = useStyles();
  const dispatch = useDispatch();
  const authContext = useContext(AuthDataContext);
  const {
    organizationId,
    organization: { timezone },
    id: studentId,
  } = authContext.currentUser;
  const toggleCloseDrawer = useCallback(() => {
    onClose();
  }, [onClose]);

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

  const getLessonDetails = useCallback(
    (activity) => {
      dispatch(
        myCourseActions.mcGetLessonDetails({
          orgId: organizationId,
          courseId: agendaProps?.courseId,
          shadowId: activity?.shadowId,
          urlParams: { timezone, sectionId: sectionDetail?.sectionId },
          isFetchingLessonDetails: true,
        })
      );
    },
    [agendaProps, dispatch, organizationId, sectionDetail, timezone]
  );

  const getQuizDetails = useCallback(
    (activity) => {
      dispatch(
        myCourseActions.mcGetQuizDetails({
          orgId: organizationId,
          courseId: agendaProps?.courseId,
          shadowId: activity?.shadowId,
          urlParams: { timezone, sectionId: sectionDetail?.sectionId },
        })
      );
    },
    [agendaProps, dispatch, organizationId, sectionDetail, timezone]
  );

  const getAssignmentDetails = useCallback(
    (activity) => {
      dispatch(
        myCourseActions.studentGetShadowAssignment({
          orgId: organizationId,
          courseId: agendaProps?.courseId,
          shadowId: activity?.shadowId,
          urlParams: {
            sectionId: sectionDetail?.sectionId,
            studentId,
            timezone,
          },
        })
      );
    },
    [agendaProps, dispatch, organizationId, sectionDetail, studentId, timezone]
  );

  useEffect(() => {
    studentGetAgendaDetail();
  }, [studentGetAgendaDetail]);

  return (
    <>
      <TblDrawer
        anchor={'right'}
        open={visible}
        onClose={toggleCloseDrawer}
        title={
          <div className={classes.flexAlignCenter}>
            <div>{agendaProps?.courseName}</div>
            <div className={classes.closeIcon} onClick={toggleCloseDrawer}>
              <CloseIcon />
            </div>
          </div>
        }
        ref={drawer1Ref}
        // ref={(ref) => setDrawer1Ref(ref)}
        footer={null}
      >
        <AgendaContent
          studentView
          agendaDetailProp={studentAgendaDetail}
          agenda={studentAgenda}
          agendaProps={agendaProps}
          getAssignmentDetails={getAssignmentDetails}
          getLessonDetails={getLessonDetails}
          getQuizDetails={getQuizDetails}
          drawer1Ref={drawer1Ref}
        />
      </TblDrawer>
    </>
  );
}

StudentAgendaDrawer.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  agendaProps: PropTypes.object,
};

export default StudentAgendaDrawer;
