import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblConfirmDialog from 'components/TblConfirmDialog';
import UserInfoCard from 'components/TblSidebar/UserInfoCard';
import TblTable from 'components/TblTable';

import { COURSE_STATUS } from 'shared/MyCourses/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { differenceBy } from 'lodash';
import { renderUserStatus } from 'modules/Users/utils';
import { useSnackbar } from 'notistack';
import { PropTypes } from 'prop-types';

import allCoursesActions from '../actions';
import { methodSort } from '../utils';

import AddStudent from './AddStudentDialog';
import SortByName from './SortByName';

const useStyles = makeStyles((theme) => ({
  studentsTable: {
    '& .MuiTableCell-body': {
      padding: theme.spacing(1),
    },
  },
}));
const allCoursesSelector = (state) => state.AllCourses;
function StudentsList(props) {
  const {
    section,
    location,
    allStudents,
    hasPermission,
    courseId,
    currentAllStudentsInSections,
  } = props;
  const { t } = useTranslation(['allCourses', 'common', 'error']);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const authContext = useContext(AuthDataContext);
  const { organizationId } = authContext.currentUser;
  const {
    studentInSectionInCourse,
    sectionId,
    updateStudentsInfoSuccess,
    isBusy,
    basicInfo
  } = useSelector(allCoursesSelector);

  const [studentsListState, setStudentsListState] = useState(
    studentInSectionInCourse
  );
  const [visibleAddStudent, setVisibleAddStudent] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    limit: 50,
    sort: 'asc',
    sortField: 'lastName',
  });

  const [confirm, setConfirm] = useState({
    show: false,
    message: '',
    section: {},
    studentId: null,
  });

  const getStudentInSection = useCallback(() => {
    dispatch(
      allCoursesActions.getStudentsInSectionOfCourse({
        orgId: organizationId,
        courseId,
        sectionId: !updateStudentsInfoSuccess ? section.id : sectionId,
        urlParams: params,
        isBusyGetStudentsInSectionOfCourse: true,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, organizationId, courseId, section.id, params]);

  const showNotification = () => enqueueSnackbar(t('common:change_saved'), {
      variant: 'success',
    });

  useEffect(() => {
    getStudentInSection();
  }, [getStudentInSection]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (section.id === sectionId) {
      setStudentsListState(studentInSectionInCourse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.id, studentInSectionInCourse]);

  useEffect(() => {
    if (updateStudentsInfoSuccess && section.id === sectionId) {
      toggleAddStudentDialog();
      getStudentInSection();
      showNotification();
    }
    dispatch(
      allCoursesActions.allCoursesSetState({
        updateStudentsInfoSuccess: false,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getStudentInSection, section.id, sectionId, updateStudentsInfoSuccess]);

  const toggleAddStudentDialog = (value = false) => {
    setVisibleAddStudent(value);
  };

  const toggleConfirm = (student, studentList, handleCloseMoreMenu) => {
    if (studentList.length === 1 && basicInfo.status === COURSE_STATUS.PUBLISHED) {
      setConfirm({
        show: true,
        studentId: student.id,
        section: section,
        hiddenConfirmButton: true,
        title: t('common:warning'),
        message: t('confirmMessage:can_not_remove_last_student'),
        studentSelected: studentList,
      });
    } else {
      setConfirm({
        show: true,
        studentId: student.id,
        section: section,
        title: t('common:confirmation'),
        okText: t('common:remove'),
        studentSelected: studentList,
        message: (
          <Trans i18nKey='remove_question'>
            Remove <strong>{student.name}</strong> from {section.sectionName}?
          </Trans>
        ),
      });
    }

    handleCloseMoreMenu();
  };
  const onSort = async () => {
    setParams({ ...params, sort: params.sort === 'asc' ? 'desc' : 'asc' });
  };
  const onSelectField = (name) => {
    setParams({ ...params, sortField: name });
  };

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

  const getIconSort = useCallback(() => params?.sort !== methodSort.ASC.name
      ? 'icon-icn_sort_arrow_down'
      : 'icon-icn_sort_arrow_up', [params]);

  const columns = [
    {
      title: t('students'),
      dataIndex: 'students',
      key: 'name',
      titleIcon: getIconSort(),
      titleIconAction: onSort,
      titleIconEl: (
        <SortByName
          onClick={onSelectField}
          selectedFieldSort={params.sortField}
        />
      ),
      render: (text, record) => <UserInfoCard itemInfo={record} />,
    },
    {
      title: t('guardians_parents'),
      dataIndex: 'firstDay',
      key: 'firstDay',
      render: (text, record) => (
        <Grid container>
          {record?.guardians?.map((guardian, index) => (
            <Grid item xs={6} key={index}>
              <UserInfoCard itemInfo={guardian} />
            </Grid>
          ))}
        </Grid>
      ),
    },
    {
      title: t('common:status'),
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => renderUserStatus(record),
    },
  ];
  const action = {
    key: 'action',
    align: 'right',
    contextMenu: (record, handleCloseMoreMenu) => (
      <MenuItem
        onClick={() =>
          toggleConfirm(record, studentsListState, handleCloseMoreMenu)
        }
      >
        {t('common:remove')}
      </MenuItem>
    ),
  };
  if (hasPermission) {
    columns.push(action);
  }
  return (
    <>
      {visibleAddStudent && (
        <AddStudent
          authContext={authContext}
          isVisible={visibleAddStudent}
          toggleDialog={toggleAddStudentDialog}
          hasPermission={hasPermission}
          location={location}
          section={section}
          students={differenceBy(
            allStudents,
            currentAllStudentsInSections,
            'id'
          )}
          studentSelected={studentsListState}
        />
      )}
      {confirm.show && (
        <TblConfirmDialog
          hiddenConfirmButton={confirm.hiddenConfirmButton}
          open={confirm.show}
          cancelText={t('common:cancel')}
          okText={confirm.okText}
          title={confirm.title}
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
      {hasPermission && (
        <Box mb={1}>
          <TblButton
            variant='contained'
            color='primary'
            onClick={() =>
              toggleAddStudentDialog(true)
            }
          >
            {t('add_student')}
          </TblButton>
        </Box>
      )}
      <TblTable
        columns={columns}
        rows={studentsListState}
        className={classes.studentsTable}
      />
    </>
  );
}

StudentsList.propTypes = {
  allStudents: PropTypes.array,
  courseId: PropTypes.number,
  currentAllStudentsInSections: PropTypes.array,
  hasPermission: PropTypes.array,
  location: PropTypes.object,
  section: PropTypes.shape({
    id: PropTypes.number,
    sectionName: PropTypes.string
  }),
  toggleConfirm: PropTypes.func
};

export default StudentsList;
