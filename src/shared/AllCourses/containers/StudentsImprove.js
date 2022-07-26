/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import concat from 'lodash/concat';
import flattenDeep from 'lodash/flattenDeep';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblConfirmDialog from 'components/TblConfirmDialog';

import { COURSE_MANAGER } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { differenceBy } from 'lodash';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { checkPermission } from 'utils';

import allCoursesActions from '../actions';
import AddStudent from '../components/AddStudentDialog';
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
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const {
    isBusyGetStudentsOfCourse,
    updateStudentsInfoSuccess,
    studentsInSections,
    students,
    isBusy,
  } = useSelector(allCoursesSelector);
  const authContext = useContext(AuthDataContext);
  const hasPermission = checkPermission(authContext.currentUser, ROLES_UPDATE);
  const courseId = props.match.params.courseId;
  const { organizationId } = authContext.currentUser;
  const dispatch = useDispatch();
  const showNotification = useCallback(() => enqueueSnackbar(t('common:change_saved'), {
      variant: 'success',
    }));
  const [visibleAddStudent, setVisibleAddStudent] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [studentSelected, setStudentSelected] = useState([]);
  const [confirm, setConfirm] = useState({
    show: false,
    message: '',
    section: {},
    studentId: null,
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 50,
    sort: 'asc',
    sortField: 'firstName',
  });
  const currentAllStudentsInSections = flattenDeep(
    concat(studentsInSections?.map((block) => block.students))
  );
  const toggleAddStudentDialog = (value = false, section, studentSelected) => {
    setVisibleAddStudent(value);
    setSelectedSection(section);
    setStudentSelected(studentSelected);
  };

  useEffect(() => {
    if (updateStudentsInfoSuccess) {
      toggleAddStudentDialog();
      getStudentsOfCourse();
      showNotification();
    }
    dispatch(
      allCoursesActions.allCoursesSetState({
        updateStudentsInfoSuccess: false,
      })
    );
  }, [updateStudentsInfoSuccess]);

  const getStudents = useCallback((sortField='firstName') => {
    dispatch(
      allCoursesActions.getStudents({
        id: organizationId,
        isBusyGetStudents: true,
        sortField,
      })
    );
  }, [dispatch, organizationId]);

  useEffect(() => {
    getStudents();
  }, [getStudents]);

  const getSectionOfCourse = () => {
    dispatch(
      allCoursesActions.getSectionsOfCourse({
        orgId: organizationId,
        courseId,
        isBusyGetSectionOfCourse: true,
      })
    );
  };

  const getStudentsOfCourse = () => {
    dispatch(
      allCoursesActions.getStudentsOfCourse({
        orgId: organizationId,
        courseId,
        urlParams: {
          attribute: 'student',
          ...params
        },
        isBusyGetStudentsOfCourse: true,
      })
    );
  };
  const onSort = async() => {
     setParams({...params, sort: params.sort === 'asc' ? 'desc' : 'asc'});
   };
  const onSelectField =(name) => {
    setParams({...params , sortField: name});
  };
  useEffect(() => {
    getStudentsOfCourse();
    getSectionOfCourse();
  }, [organizationId , params]);

  const removeStudent = (studentId, sectionId, studentSelected) => {
    const data = studentSelected
      .map((s) => s.id)
      .filter((stuId) => stuId !== studentId);
    dispatch(
      allCoursesActions.updateStudentsInCourse({
        orgId: organizationId,
        courseId,
        isBusy: true,
        data: {
          student: {
            sectionId: sectionId,
            list: data,
          },
        },
      })
    );
  };
  return isBusyGetStudentsOfCourse ? (
    renderSkeletonTeacherCard(t)
  ) : (
    <Box className={classes.root}>
      {visibleAddStudent && (
        <AddStudent
          authContext={authContext}
          isVisible={visibleAddStudent}
          toggleDialog={toggleAddStudentDialog}
          hasPermission={hasPermission}
          location={props.location}
          section={selectedSection}
          students={differenceBy(students, currentAllStudentsInSections, 'id')}
          studentSelected={studentSelected}
        />
      )}
      {confirm.show && (
        <TblConfirmDialog
          open={confirm.show}
          cancelText={t('common:cancel')}
          okText={t('common:remove')}
          title={t('common:confirmation')}
          message={confirm.message}
          hasPermission={hasPermission}
          progressing={isBusy}
          onCancel={() => {
            setConfirm({
              show: false,
            });
          }}
          onConfirmed={() => {
            removeStudent(
              confirm.studentId,
              confirm.section.id,
              confirm.studentSelected
            );
            setConfirm({
              show: false,
            });
          }}
        />
      )}
      {isEmpty(studentsInSections) ? (
        <div noWrap className={classes.noDataNote}>
          {t('create_sections_first')}
        </div>
      ) : (
        studentsInSections?.map((studentSectionBlock) => {
          const studentSelected = studentSectionBlock.students;
          return (
            <Box mb={5}>
              <Box mb={1}>
                <Typography noWrap classes={{ root: classes.sectionName }}>
                  {studentSectionBlock.sectionName}
                </Typography>
              </Box>
              {hasPermission && (
                <Box mb={1}>
                  <TblButton
                    variant='contained'
                    color='primary'
                    onClick={() =>
                      toggleAddStudentDialog(
                        true,
                        omit(studentSectionBlock, ['students']),
                        studentSelected
                      )
                    }
                  >
                    {t('add_student')}
                  </TblButton>
                </Box>
              )}
              <StudentsList
                studentsList={studentSectionBlock?.students}
                getStudentsOfCourse={getStudentsOfCourse}
                hasPermission={hasPermission}
                onSort={onSort}
                onSelectField={onSelectField}
                params={params}
                toggleConfirm={(student, handleCloseMoreMenu) => {
                  setConfirm({
                    show: true,
                    studentId: student.id,
                    section: omit(studentSectionBlock, ['students']),
                    studentSelected,
                    message: (
                      <Trans i18nKey='remove_question'>
                        Remove <strong>{student.name}</strong> from{' '}
                        {studentSectionBlock.sectionName}?
                      </Trans>
                    ),
                  });
                  handleCloseMoreMenu();
                }}
                // sectionId={studentSectionBlock.id}
              />
            </Box>
          );
        })
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
