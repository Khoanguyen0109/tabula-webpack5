import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import isEmpty from 'lodash/isEmpty';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblSelect from 'components/TblSelect';

// import CreateAssignmentDrawer from 'shared/MyCourses/containers/CreateAssignmentDrawer';
import { COURSE_ITEM_TYPE } from 'utils/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { useFormik } from 'formik';
import myCoursesActions from 'modules/MyCourses/actions';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  paper: { maxWidth: 648 },

  rootTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.fontSize.large,
  },

  titleName: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.semi,
  },

  icon: {
    marginRight: theme.spacing(1),
    display: 'flex',
    fontSize: theme.fontSizeIcon.medium,
  },
}));
const myCoursesSelector = (state) => state.AllCourses;

function MasterAssignmentDuetimeDialog(props) {
  const { onClose, visible, assignmentId, unitId } = props;
  const {
    assignment,
    courseDays,
    editMasterAssignmentFailed,
    editMasterAssignmentSuccess,
    errorMasterAssignment,
    // editShadowAssignmentFailed,
  } = useSelector(myCoursesSelector);
  const classes = useStyles();
  const dispatch = useDispatch();
  const authContext = useContext(AuthDataContext);
  const { organizationId } = authContext.currentUser;

  const { t } = useTranslation(['myCourses', 'common']);
  const match = useRouteMatch();
  const courseId = match.params.courseId;

  const { enqueueSnackbar } = useSnackbar();

  const showNotification = useCallback(() => {
    if (visible) {
      return enqueueSnackbar(t('common:change_saved'), {
        variant: 'success',
      });
    }
  }, [enqueueSnackbar, t, visible]);

  const validationSchema = Yup.object().shape({
    dueDateId: Yup.string().required(t('common:required_message')).nullable(),
  });
  const getAssignmentDetail = useCallback(() => {
    if (assignmentId && visible)
      dispatch(
        myCoursesActions.getAssignmentDetail({
          orgId: organizationId,
          courseId: courseId,
          unitId: unitId,
          assignmentId: assignmentId,
        })
      );
  }, [assignmentId, courseId, dispatch, organizationId, unitId, visible]);

  useEffect(() => {
    getAssignmentDetail();
  }, [getAssignmentDetail]);

  const formik = useFormik({
    initialValues: {
      assignDateId: assignment?.courseDayId,
      dueDateId: assignment?.dueDateId,
      // ...shadowAssignment,
      // ...shadowAssignmentInfo,
    },

    enableReinitialize: true,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    keepDirtyOnReinitialize: false,
  });
  const {
    values,
    errors,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    resetForm,
    validateForm,
  } = formik;

  const toggleCloseDrawer = useCallback(() => {
    onClose();
    resetForm();
    dispatch(
      myCoursesActions.myCoursesSetState({
        errorMasterAssignment: null,
        assignment: {},
      })
    );
  }, [dispatch, onClose, resetForm]);

  const getAllCourseDaysList = useCallback(() => {
    if (visible)
      dispatch(
        myCoursesActions.getAllCourseDays({
          orgId: organizationId,
          courseId: courseId,
          // urlParams: { timezone: timezone },
        })
      );
  }, [courseId, dispatch, organizationId, visible]);

  useEffect(() => {
    getAllCourseDaysList();
  }, [getAllCourseDaysList]);

  useEffect(() => {
    if (editMasterAssignmentSuccess && visible) {
      //currentQuiz?.executeDateId, 'none', currentQuiz?.unitId, {quizId: currentQuiz?.id}, 0
      props.updateMasterItem &&
        props.updateMasterItem(
          assignment?.courseDayId,
          'none',
          unitId,
          { assignmentId: assignmentId },
          0
        );
      toggleCloseDrawer();
      showNotification();
      dispatch(
        myCoursesActions.myCoursesSetState({
          editMasterAssignmentSuccess: false,
        })
      );
    }
  }, [editMasterAssignmentSuccess]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (editMasterAssignmentFailed) {
      if (errorMasterAssignment?.subcode === 1) {
        setFieldError('dueDateId', t('error_set_due_time_master_assignment'));
      }
      if (errorMasterAssignment?.subcode === 2) {
        setFieldError(
          'dueDateId',
          t('error:error_last_greater_equal_first', {
            first: t('assigned_on'),
            last: t('due_on'),
          })
        );
      }

      dispatch(
        myCoursesActions.myCoursesSetState({
          editMasterAssignmentSuccess: false,
        })
      );
    }
  }, [
    dispatch,
    editMasterAssignmentFailed,
    errorMasterAssignment,
    setFieldError,
    t,
  ]);

  const handleSubmit = () => {
    const payload = {
      // ...assignment,
      assignmentName: assignment?.assignmentName,
      courseDayId: assignment?.courseDayId,
      dueDateId: values?.dueDateId,
    };
    validateForm();
    setFieldTouched('dueDateId');
    if (isEmpty(errors) && values?.dueDateId) {
      dispatch(
        myCoursesActions.editAssignment({
          orgId: organizationId,
          courseId: courseId,
          unitId: unitId,
          assignmentId: assignmentId,
          isBusy: true,
          data: payload,
        })
      );
    }
  };
  const handleChange = (fieldName, value) => {
    setFieldValue(fieldName, value);
    setFieldTouched(fieldName, true);
  };
  const showFormError =
    ![1, 2].includes(errorMasterAssignment?.subcode) &&
    isEmpty(errors) &&
    !isEmpty(errorMasterAssignment);
  const renderContent = () => (
    <form>
      {showFormError && (
        <Box mb={2}>
          <Alert severity='error'>{errorMasterAssignment?.message}</Alert>
        </Box>
      )}
      <div className={classes.content}>
        <Grid container>
          <Grid item xs={6}>
            <Box mr={1.5}>
              {courseDays && (
                <TblSelect
                  required
                  label={t('assigned_on')}
                  name='assignDateId'
                  value={values?.assignDateId || null}
                  disabled
                >
                  {courseDays?.map((semester, semesterIndex) => [
                    <ClickAwayListener mouseEvent={false}>
                      <ListSubheader color='primary' disableSticky>
                        {semester?.termName}
                      </ListSubheader>
                    </ClickAwayListener>,
                    semester?.dates?.map((courseDay, courseDayIndex) => (
                      <MenuItem
                        value={Number(courseDay?.id)}
                        key={[semesterIndex, courseDayIndex]}
                      >
                        {courseDay?.courseDayName}
                      </MenuItem>
                    )),
                  ])}
                </TblSelect>
              )}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box ml={1.5}>
              {courseDays && (
                <TblSelect
                  required
                  label={t('due_on')}
                  name='dueDateId'
                  onChange={(e, child) =>
                    handleChange('dueDateId', e.target.value, child)
                  }
                  errorMessage={errors.dueDateId}
                  error={errors.dueDateId}
                  value={values?.dueDateId?.toString() || null}
                  // disabled={isScheduledStatus}
                >
                  {courseDays?.map((semester, semesterIndex) => [
                    <ClickAwayListener mouseEvent={false}>
                      <ListSubheader color='primary' disableSticky>
                        {semester?.termName}
                      </ListSubheader>
                    </ClickAwayListener>,
                    semester?.dates?.map((courseDay, courseDayIndex) => (
                      <MenuItem
                        value={Number(courseDay?.id)}
                        key={[semesterIndex, courseDayIndex]}
                      >
                        {courseDay?.courseDayName}
                      </MenuItem>
                    )),
                  ])}
                </TblSelect>
              )}
            </Box>
          </Grid>
        </Grid>
      </div>
    </form>
  );
  return (
    <>
      <TblDialog
        open={visible}
        onClose={toggleCloseDrawer}
        title={
          <Typography
            classes={{ root: classes.rootTitle }}
            noWrap
            color='primary'
          >
            {/* <BallotIcon className={classes.icon} /> */}
            <TblActivityIcon
              type={COURSE_ITEM_TYPE.ASSIGNMENT}
              className={classes.icon}
            />
            <Typography
              lineHeight={'30px'}
              noWrap
              classes={{ root: classes.titleName }}
            >
              {assignment?.assignmentName}
            </Typography>
          </Typography>
        }
        classes={{ paper: classes.paper }}
        fullWidth
        footer={
          <>
            <TblButton
              variant='outlined'
              color='primary'
              onClick={toggleCloseDrawer}
            >
              {t('common:cancel')}
            </TblButton>
            <TblButton
              variant='contained'
              color='primary'
              onClick={handleSubmit}
            >
              {t('common:save')}
            </TblButton>
          </>
        }
      >
        {renderContent()}
      </TblDialog>
    </>
  );
}

MasterAssignmentDuetimeDialog.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  updateMasterItem: PropTypes.func,
  shadowAssignmentInfo: PropTypes.object,
  sectionId: PropTypes.bool,
  assignmentId: PropTypes.number,
  unitId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

MasterAssignmentDuetimeDialog.defaultProps = {
  visible: false,
};

export default MasterAssignmentDuetimeDialog;
