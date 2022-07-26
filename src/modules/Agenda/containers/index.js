/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import EmptyContent from 'components/EmptyContent';
import { BreadcrumbContext } from 'components/TblBreadcrumb';
import withReducer from 'components/TblWithReducer';

import epics from 'shared/Lesson/epics';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import emptyImage from 'assets/images/empty-illus.svg';
import { Layout2 } from 'layout';
import { isEmpty } from 'lodash-es';
import myCoursesActions from 'modules/MyCourses/actions';
import reducer from 'modules/MyCourses/reducers';
import { useSnackbar } from 'notistack';

import agendaActions from '../actions';
import AgendaContent from '../components/AgendaContent';
import ListCourseBlock from '../components/ListCourseBlock';

const agendaSelector = (state) => state.Agenda;

function AgendaContainer() {
  const context = useContext(BreadcrumbContext);
  const authContext = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const { t } = useTranslation('agenda', 'common');
  const { enqueueSnackbar } = useSnackbar();

  const {
    agendaList,
    agendaDetail,
    agenda,
    editAgendaDetailSuccess,
    markAgendaActivityCompleteSuccess,
    draftActivities,
    courseTeacher,
    error,
  } = useSelector(agendaSelector);
  const mcUpdateShadowQuizzesSuccess = useSelector(
    (state) => state.AllCourses.mcUpdateShadowQuizzesSuccess
  );
  const editShadowAssignmentSuccess = useSelector(
    (state) => state.AllCourses.editShadowAssignmentSuccess
  );
  const mcUpdateShadowLessonSuccess = useSelector(
    (state) => state.AllCourses.mcUpdateShadowLessonSuccess
  );

  const match = useRouteMatch();
  const {
    organizationId,
    id: currentUserId,
    organization: { timezone },
  } = authContext.currentUser;
  const [selectedCourseBlock, setSelectedCourseBlock] = React.useState();

  useEffect(() => {
    context.setData({
      showBoxShadow: false,
      bodyContent: t('teach'),
    });
  }, [match?.params?.studentId]);

  const getAgendaList = useCallback(
    (day) =>
      dispatch(
        agendaActions.getAgendaList({
          orgId: organizationId,
          urlParams: {
            // date: '2020-07-21',
            date: day.format('YYYY-MM-DD'),
            timezone: timezone,
          },
        })
      ),
    []
  );
  const getAgendaDetail = useCallback(
    (agendaId) =>
      dispatch(
        agendaActions.getAgendaDetail({
          orgId: organizationId,
          agendaId: agendaId,
          urlParams: {
            timezone: timezone,
          },
        })
      ),
    []
  );

  const editAgendaDetail = useCallback(
    (values, agenda) =>
      dispatch(
        agendaActions.editAgendaDetail({
          orgId: organizationId,
          agendaId: agenda?.id,
          data: values,
        })
      ),
    []
  );

  const markAgendaActivityComplete = useCallback(
    (value, activity) =>
      dispatch(
        agendaActions.markAgendaActivityComplete({
          orgId: organizationId,
          id: activity?.id,
          data: { status: value },
        })
      ),
    []
  );

  const getAssignmentDetails = useCallback(
    (activity) => {
      dispatch(
        myCoursesActions.getAssignmentDetail({
          orgId: organizationId,
          courseId: agenda?.courseId,
          unitId:
            activity?.shadowAssignments?.masterAssignment?.unitId ||
            activity?.unitId,
          assignmentId:
            activity?.shadowAssignments?.masterAssignment?.id ||
            activity?.assignmentLinkId ||
            activity?.assignmentId,
        })
      );
    },
    [dispatch, organizationId, agenda]
  );

  const getQuizDetails = useCallback(
    (activity) => {
      // if (visible)
      dispatch(
        myCoursesActions.mcGetQuiz({
          orgId: organizationId,
          courseId: agenda?.courseId,
          unitId:
            activity?.shadowQuizzes?.masterQuiz?.unitId || activity?.unitId,
          quizId:
            activity?.shadowQuizzes?.masterQuiz?.id ||
            activity?.quizLinkId ||
            activity?.quizId,
        })
      );

      // );
    },
    [dispatch, organizationId, agenda]
  );

  const getLessonDetails = useCallback(
    (activity) => {
      // if (visible)
      dispatch(
        myCoursesActions.getLessonDetail({
          orgId: organizationId,
          // courseId: 82,
          courseId: agenda?.courseId,
          unitId:
            activity?.shadowLessons?.masterLesson?.unitId || activity?.unitId,
          lessonId:
            activity?.shadowLessons?.masterLesson?.id ||
            activity?.lessonLinkId ||
            activity?.lessonId,
        })
      );

      // );
    },
    [dispatch, organizationId, agenda]
  );
  const publishActivity = useCallback(
    (activity) => {
      if (activity?.lessonName) {
        dispatch(
          myCoursesActions.mcUpdateShadowLesson({
            orgId: organizationId,
            courseId: agenda?.courseId,
            shadowId: activity?.shadowId,
            activity: { status: 1 },
          })
        );
      }
      if (activity?.assignmentName) {
        dispatch(
          myCoursesActions.editShadowAssignment({
            orgId: organizationId,
            courseId: agenda?.courseId,
            shadowId: activity?.shadowId,
            data: { status: 1 },
          })
        );
      }
      if (activity?.quizName) {
        dispatch(
          myCoursesActions.mcUpdateShadowQuizzes({
            orgId: organizationId,
            courseId: agenda?.courseId,
            shadowId: activity?.shadowId,
            activity: { status: 1 },
          })
        );
      }
    },
    [dispatch, organizationId, agenda]
  );

  const renderContent = () => {
    // return <StudentAgendaDrawer />;
    if (!selectedCourseBlock) {
      return (
        <div>
          <Box pl={1}>
            <EmptyContent
              title={
                <Typography variant='headingSmall' color='primary'>
                  {t('agenda')}
                </Typography>
              }
              emptyImage={emptyImage}
              subTitle={t('select_a_class_session_to_view_your_agenda')}
              className='style1'
            />
          </Box>
        </div>
      );
    }
    return (
      <div title={selectedCourseBlock && selectedCourseBlock?.courseName}>
        <Box pl={1}>
          {agenda && (
            <AgendaContent
              agendaDetailProp={agendaDetail}
              editAgendaDetail={editAgendaDetail}
              markAgendaActivityComplete={markAgendaActivityComplete}
              agenda={agenda}
              currentUserId={currentUserId}
              courseTeacher={courseTeacher}
              getAssignmentDetails={getAssignmentDetails}
              getLessonDetails={getLessonDetails}
              getQuizDetails={getQuizDetails}
              selectedCourseBlock={selectedCourseBlock}
              publishActivity={publishActivity}
              draftActivities={draftActivities}
            />
          )}
        </Box>
      </div>
    );
  };

  useEffect(() => {
    if (
      editAgendaDetailSuccess ||
      editShadowAssignmentSuccess ||
      mcUpdateShadowQuizzesSuccess ||
      mcUpdateShadowLessonSuccess
    ) {
      getAgendaDetail(agenda?.id);
      dispatch(
        agendaActions.agendaSetState({
          editAgendaDetailSuccess: false,
        })
      );
      dispatch(
        myCoursesActions.myCoursesSetState({
          editShadowAssignmentSuccess: false,
          mcUpdateShadowQuizzesSuccess: false,
          mcUpdateShadowLessonSuccess: false,
        })
      );
      enqueueSnackbar(t('common:change_saved'), {
        variant: 'success',
      });
    }

    handleError();
  }, [
    editAgendaDetailSuccess,
    editShadowAssignmentSuccess,
    mcUpdateShadowQuizzesSuccess,
    mcUpdateShadowLessonSuccess,
    error,
  ]);

  useEffect(() => {
    if (markAgendaActivityCompleteSuccess) {
      getAgendaDetail(agenda?.id);
      dispatch(
        agendaActions.agendaSetState({
          markAgendaActivityCompleteSuccess: false,
        })
      );
      enqueueSnackbar(t('common:change_saved'), {
        variant: 'success',
      });
    }
    handleError();
  }, [markAgendaActivityCompleteSuccess, error]);

  const handleError = () => {
    if (error && !isEmpty(error)) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
      if (error && !isEmpty(error)) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
        dispatch(
          agendaActions.agendaSetState({
            error: null,
          })
        );
      }
    }
  };

  return (
    <Layout2>
      <div>
        <Box styles={{ overflow: 'auto' }}>
          <ListCourseBlock
            getAgendaList={getAgendaList}
            agendaList={agendaList}
            getAgendaDetail={getAgendaDetail}
            updateSelectedCourseBlock={(selectedCourseBlock) =>
              setSelectedCourseBlock(selectedCourseBlock)
            }
          />
        </Box>
      </div>
      {renderContent()}
    </Layout2>
  );
}
const AgendaContainerWithReducer = withReducer(
  'AllCourses',
  reducer,
  null,
  epics
)(AgendaContainer);

export default AgendaContainerWithReducer;
