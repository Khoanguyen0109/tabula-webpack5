import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import CoursesList from 'shared/MyCourses/components/CoursesList';
import EmptyContentForStudent from 'shared/MyCourses/components/EmptyContentForStudent';

import { isGuardian, isTeacher } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { PropTypes } from 'prop-types';

import myCoursesActions from '../actions';
import { ROUTE_MY_COURSES } from '../constantsRoute';

function MyCoursesList(props) {
  // NOTE: get contexts
  // const { t } = useTranslation(['myCourses', 'common', 'error']);
  // const classes = useStyles();
  const schoolYearSelected = useSelector(
    (state) => state.Auth.schoolYearSelected
  );
  const isBusy = useSelector((state) => state.AllCourses.isBusy);
  const myCoursesList = useSelector((state) => state.AllCourses.myCoursesList);
  const studentId = useSelector((state) => state.AllCourses.studentId);
  const authContext = useContext(AuthDataContext);
  const { t, search, status } = props;
  const { organizationId } = authContext.currentUser;
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const isTeacherRole = isTeacher(authContext.currentUser);
  const isGuardianRole = isGuardian(authContext.currentUser);

  const getMyCoursesList = useCallback(
    (urlParams) => {
      dispatch(
        myCoursesActions.getMyCoursesList({
          orgId: organizationId,
          isBusy: true,
          urlParams: urlParams,
        })
      );
    },
    [dispatch, organizationId]
  );

  useEffect(() => {
    let urlParams = { search, schoolYearId: schoolYearSelected, status };
    if (schoolYearSelected) {
      const currentStudentId = studentId || authContext?.currentStudentId;
      if (isGuardianRole) {
        if (match?.params?.studentId && !isNaN(match?.params?.studentId)) {
          urlParams.studentId = match?.params?.studentId;
          if (urlParams.studentId !== studentId) {
            dispatch(
              myCoursesActions.myCoursesSetState({
                studentId: urlParams.studentId,
              })
            );
          }
        } else if (currentStudentId) {
          props.history.replace(
            ROUTE_MY_COURSES.MY_COURSES_GUARDIAN(currentStudentId)
          );
        }
      }
      if (!isGuardianRole || (isGuardianRole && urlParams.studentId)) {
        getMyCoursesList(urlParams);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext, match, schoolYearSelected, status]);

  return (
    <>
      {isBusy ? (
        <Grid container justifyContent='flex-start' spacing={3}>
          {[0, 1, 2, 3].map((item, index) => (
            <Grid item xs={6} sm={6} md={4} lg={3} xl={2} key={index}>
              <Skeleton variant='rectangular' height={200} />
            </Grid>
          ))}
        </Grid>
      ) : isTeacherRole || myCoursesList.length ? (
        <CoursesList
          listItems={myCoursesList}
          isBusy={isBusy}
          showStatus={isTeacherRole}
          status={status}
          emptyContent={props.t('no_courses_added_yet')}
        />
      ) : (
        <EmptyContentForStudent subTitle={t('empty_course_list')} />
      )}
    </>
  );
}

MyCoursesList.propTypes = {
  authContext: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  search: PropTypes.string,
  status: PropTypes.number,
  t: PropTypes.func,
};

export default MyCoursesList;
