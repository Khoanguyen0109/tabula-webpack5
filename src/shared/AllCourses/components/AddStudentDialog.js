import React, { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import PropTypes from 'prop-types';

import allCoursesActions from '../actions';

import CheckboxList from './CheckboxList';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 600,
  },
  rootContent: {
    overflow: 'hidden',
  },
  paper: {
    minWidth: 648,
  },

  note: {
    fontSize: theme.fontSize.normal,
    color: theme.mainColors.primary1[0],
  },
}));

const allCoursesSelector = (state) => state.AllCourses;

function AddStudent(props) {
  const { isVisible, toggleDialog, section, students, studentSelected } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const authContext = useContext(AuthDataContext);
  const { organizationId } = authContext.currentUser;
  const { t } = useTranslation(['allCourses', 'common', 'error']);
  const { isBusyGetTeachers , isBusy } = useSelector(allCoursesSelector);
  const [selectingStudents, setStudents] = useState();

  const onCancel = () => {
    toggleDialog();
  };

  const handleSubmit = () => {
    const data = selectingStudents?.concat(studentSelected);
    dispatch(
      allCoursesActions.updateStudentsInCourse({
        orgId: organizationId,
        courseId: props.location.pathname.split('/')[2],
        isBusy: true,
        data: {
          student: {
            sectionId: section?.id,
            list: data?.map((student) => student.id),
          },
        },
      })
    );
  };

  const renderSkeletonList = () => [1, 2, 3].map(() => (
      <Box display='flex' alignItems='center'>
        <Box margin={1}>
          <Skeleton variant='circular' width={48} height={48} />
        </Box>
        <Box width='100%'>
          <Skeleton width='100%' height={64} />
        </Box>
      </Box>
    ));

  return (
    <>
      {isVisible && (
        <TblDialog
          open={isVisible}
          title={t('allCourses:add_student')}
          showScrollBar={false}
          scroll='paper'
          classes={{ root: classes.root, paper: classes.paper }}
          footer={
            <>
              <TblButton
                variant='outlined'
                color='primary'
                onClick={onCancel}
              >
                {t('common:cancel')}
              </TblButton>
              <TblButton
                disabled={isBusyGetTeachers}
                isShowCircularProgress={isBusyGetTeachers || isBusy}
                variant='contained'
                color='primary'
                onClick={handleSubmit}
              >
                {t('common:add')}
              </TblButton>
            </>
          }
        >
          <DialogContent classes={{ root: classes.rootContent }}>
            <div className={classes.note}>
              <Trans i18nKey='choose_students_in_section'>
                Choose the students that will be in{' '}
                <strong>{section.sectionName}</strong>
              </Trans>
            </div>

            {isBusyGetTeachers ? (
              renderSkeletonList()
            ) : (
              <CheckboxList
                itemsList={students}
                checkBoxListTitle={t('available_students')}
                updateData={setStudents}
              />
            )}
          </DialogContent>
        </TblDialog>
      )}
    </>
  );
}

AddStudent.propTypes = {
  t: PropTypes.func,
  isVisible: PropTypes.bool,
  toggleDialog: PropTypes.func,
  onSubmit: PropTypes.func,
  section: PropTypes.object,
  location: PropTypes.object,
  students: PropTypes.array,
  studentSelected: PropTypes.array,
};

AddStudent.defaultProps = {
  teachers: [],
  isBusyGetTeachers: false,
};

export default AddStudent;
