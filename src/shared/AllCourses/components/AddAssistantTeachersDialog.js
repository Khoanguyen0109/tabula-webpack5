import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import isEmpty from 'lodash/isEmpty';

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

// const assistantTeachersSelector = createSelector(
//   (state) => state.AllCourses.assistantTeachers,
//   (assistantTeachers) => assistantTeachers
// );

const allCoursesSelector = (state) => state.AllCourses;

function AddAssistantTeachers(props) {
  const { isVisible, toggleDialog, teachers, assistantTeachers } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const authContext = useContext(AuthDataContext);
  const { organizationId } = authContext.currentUser;
  const { t } = useTranslation(['allCourses', 'common', 'error']);
  const { isBusyGetTeachers } = useSelector(allCoursesSelector);

  const [selectingTeachers, setSelectingTeachers] = useState([]);

  const onCancel = () => {
    toggleDialog();
  };
  const handleSubmit = useCallback(() => {
    const data = assistantTeachers?.concat(selectingTeachers);
    if (!isEmpty(selectingTeachers)) {
      dispatch(
        allCoursesActions.updateTeachersInCourse({
          orgId: organizationId,
          courseId: props.location.pathname.split('/')[2],
          isBusy: true,
          data: {
            teachingAssistants: data?.map((teacher) => teacher.id),
          },
        })
      );
    } else {
      toggleDialog(false);
    }
  }, [
    assistantTeachers,
    selectingTeachers,
    dispatch,
    organizationId,
    props.location.pathname,
    toggleDialog,
  ]);

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
          title={t('allCourses:add_assistant_teachers')}
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
                isShowCircularProgress={isBusyGetTeachers}
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
              {t('select_your_assistant_teachers')}
            </div>

            {isBusyGetTeachers ? (
              renderSkeletonList()
            ) : (
              <CheckboxList
                itemsList={teachers.filter(
                  (t) => t.id !== props.primaryTeacher?.id
                )}
                checkBoxListTitle={t('available_assistant_teachers')}
                updateData={setSelectingTeachers}
              />
            )}
          </DialogContent>
        </TblDialog>
      )}
    </>
  );
}

AddAssistantTeachers.propTypes = {
  t: PropTypes.func,
  isVisible: PropTypes.bool,
  toggleDialog: PropTypes.func,
  onSubmit: PropTypes.func,
  isBusyGetTeachers: PropTypes.bool,
  primaryTeacher: PropTypes.object,
  teachers: PropTypes.array,
  location: PropTypes.object,
  assistantTeachers: PropTypes.array,
};

AddAssistantTeachers.defaultProps = {
  teachers: [],
  isBusyGetTeachers: false,
};

export default AddAssistantTeachers;
