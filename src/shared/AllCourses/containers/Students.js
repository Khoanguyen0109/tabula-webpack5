/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import concat from 'lodash/concat';
import flattenDeep from 'lodash/flattenDeep';
import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import { COURSE_MANAGER } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import PropTypes from 'prop-types';
import { checkPermission } from 'utils';

import allCoursesActions from '../actions';
import StudentsList from '../components/StudentsList';

const useStyles = makeStyles((theme) => ({
  sectionName: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
    paddingLeft: theme.spacing(1),
    color: theme.mainColors.primary1[0],
  },
  noDataNote: {
    paddingLeft: theme.spacing(1),
  },
}));
const allCoursesSelector = (state) => state.AllCourses;

const renderSkeletonTeacherCard = () => (
    <>
      <Skeleton width={50} />
      <Skeleton width={100} height={40} />
      <Skeleton height={150} />
    </>
  );
const ROLES_UPDATE = [COURSE_MANAGER];
function Students(props) {
  // NOTE: get contexts
  const { t } = useTranslation(['allCourses', 'common', 'error']);
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    isBusyGetSectionsOfCourse,
    updateStudentsInfoSuccess,
    studentsInSections,
    sectionsInCourse,
    students,
  } = useSelector(allCoursesSelector);
  const authContext = useContext(AuthDataContext);
  const hasPermission = checkPermission(authContext.currentUser, ROLES_UPDATE);
  const courseId = props.match.params.courseId;
  const { organizationId } = authContext.currentUser;
  const currentAllStudentsInSections = flattenDeep(
    concat(studentsInSections?.map((block) => block.students))
  );
  const getStudents = useCallback((sortField='firstName') => {
    dispatch(
      allCoursesActions.getStudents({
        id: organizationId,
        isBusyGetStudents: true,
        sortField,
      })
    );
  }, [dispatch, organizationId]);

  const getSectionOfCourse = useCallback(() => {
    dispatch(
      allCoursesActions.getSectionsOfCourse({
        orgId: organizationId,
        courseId,
        isBusyGetSectionsOfCourse: true,
      })
    );
  },[organizationId, courseId]);

  const getStudentsOfCourse = () => {
    dispatch(
      allCoursesActions.getStudentsOfCourse({
        orgId: organizationId,
        courseId,
        urlParams: {
          attribute: 'student',
        },
        isBusyGetStudentsOfCourse: true,
      })
    );
  };
  /*
  Get all Student in domain
  */ 
  useEffect(() => {
    getStudents();
  }, [getStudents]);
  
  /***
  Get all Students belong to sections
  update list student belong to sections when add or remove student in a section
  ***/
  useEffect(() => {
    getStudentsOfCourse();
  }, [updateStudentsInfoSuccess]);

  useEffect(() => {
    getSectionOfCourse();
  }, [getSectionOfCourse ]);

  return isBusyGetSectionsOfCourse ? (
    renderSkeletonTeacherCard(t)
  ) : (
    <Box className={classes.root}>

      {isEmpty(studentsInSections) ? (
        <div noWrap className={classes.noDataNote}>
          {t('create_sections_first')}
        </div>
      ) : (
        sectionsInCourse?.map((section) => (
            <Box mb={5}>
              <Box mb={1}>
                <Typography noWrap classes={{ root: classes.sectionName }}>
                  {section.sectionName}
                </Typography>
              </Box>
              <StudentsList
                section={section}
                location={props.location}
                courseId={courseId}
                getStudentsOfCourse={getStudentsOfCourse}
                hasPermission={hasPermission}
                allStudents={students}
                currentAllStudentsInSections={currentAllStudentsInSections}
              />
            </Box>
          ))
      )}
    </Box>
  );
}

Students.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  authContext: PropTypes.object,
};

export default Students;
