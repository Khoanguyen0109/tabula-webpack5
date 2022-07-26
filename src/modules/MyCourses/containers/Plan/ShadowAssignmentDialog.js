import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  // useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import find from 'lodash/find';
import flattenDeep from 'lodash/flattenDeep';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import CreateIcon from '@mui/icons-material/Create';
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
import TblUseSnackbar from 'components/TblUseSnackbar';

import { COURSE_ITEM_TYPE } from 'utils/constants';
import { TEACHER } from 'utils/roles';

import CreateAssignmentDrawer from 'shared/MyCourses/containers/CreateAssignmentDrawer';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { useFormik } from 'formik';
import myCoursesActions from 'modules/MyCourses/actions';
import moment from 'moment';
import PropTypes from 'prop-types';
import { checkPermission } from 'utils';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  paper: { maxWidth: 648 },

  editActivityDetail: {
    color: theme.mainColors.primary2[0],
    textDecoration: 'underline',
    cursor: 'pointer',
  },

  disableEditActivityDetail: {
    color: theme.mainColors.gray[6],
    cursor: 'default',
  },

  rootSectionName: {
    fontSize: theme.fontSize.normal,
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },

  rootTitle: {
    display: 'flex',
    alignItems: 'center',
    // fontSize: theme.fontSize.large,
  },

  title: {
    fontSize: theme.fontSize.large,
  },

  icon: {
    marginRight: theme.spacing(1),
    display: 'flex',
    fontSize: theme.fontSizeIcon.medium,
  },
}));
const editShadowAssignmentSuccessSelector = (state) =>
  state.AllCourses.editShadowAssignmentSuccess;
const errorShadowAssignmentSelector = (state) =>
  state.AllCourses.errorShadowAssignment;
const courseDayListSelector = (state) => state.AllCourses.courseDayList;
const shadowAssignmentSelector = (state) => state.AllCourses.shadowAssignment;
const editShadowAssignmentFailedSelector = (state) =>
  state.AllCourses.editShadowAssignmentFailed;
const editMasterAssignmentSuccessSelector = (state) =>
  state.AllCourses.editMasterAssignmentSuccess;
const permissionSelector = (state) => state.AllCourses.permission;

function ShadowAssignmentDialog(props) {
  const {
    onClose,
    visible,
    shadowAssignmentInfo,
    sectionId,
    updateShadowAssignments,
    getCourseItemByUnit,
  } = props;
  const shadowAssignmentId = shadowAssignmentInfo?.id;
  const [tempShadowAssignment, setTempShadowAssignment] = React.useState({});

  const editShadowAssignmentSuccess = useSelector(
    editShadowAssignmentSuccessSelector
  );
  const errorShadowAssignment = useSelector(errorShadowAssignmentSelector);
  const courseDayList = useSelector(courseDayListSelector);
  const shadowAssignment = useSelector(shadowAssignmentSelector);
  const editShadowAssignmentFailed = useSelector(
    editShadowAssignmentFailedSelector
  );
  const editMasterAssignmentSuccess = useSelector(
    editMasterAssignmentSuccessSelector
  );
  const permission = useSelector(permissionSelector);
  const ROLES_CREATE_UPDATE = [TEACHER];
  // const [open, setOpen] = React.useState(visible);
  const [visibleMasterAssignment, setVisibleMasterAssignment] =
    React.useState(false);
  const [isUpdatedMasterItem, setIsUpdatedMasterItem] = React.useState(false);
  const hasPermission = checkPermission(permission, ROLES_CREATE_UPDATE);

  // const [filteredCourseDayList, setFilteredCourseDayList] = React.useState(
  //   courseDayList
  // );
  // const [visible, setVisible] = React.useState(props.visible);
  const classes = useStyles();
  const dispatch = useDispatch();
  const authContext = useContext(AuthDataContext);
  const {
    organizationId,
    organization: { timezone },
  } = authContext.currentUser;

  const { t } = useTranslation(['myCourses', 'common']);
  const match = useRouteMatch();
  const courseId = match.params.courseId;
  const shadowAssignmentStatus = shadowAssignment?.status;
  const isScheduledStatus =
    shadowAssignmentStatus === -1 || shadowAssignmentStatus === -2;
  // const { enqueueSnackbar } = useSnackbar();

  const allCourseDays = useMemo(
    () => flattenDeep(courseDayList?.map((semester) => semester?.dates)),
    [courseDayList]
  );

  const futureCourseDayList = courseDayList?.map((semester) => ({
    ...semester,
    dates: semester?.dates?.filter((d) => d.future),
  }));

  // const showNotification = useCallback(() => {
  //   return enqueueSnackbar(t('common:change_saved'), {
  //     variant: 'success',
  //   });
  // }, [enqueueSnackbar, t]);

  const validationSchema = Yup.object().shape({
    dueDateId: Yup.string()
      .nullable()
      .when('status', {
        is: 0, // status === draft
        otherwise: Yup.string().required(t('common:required_message')),
        then: Yup.string().notRequired(),
      })
      .when('status', {
        is: 2, // status === assigned
        then: Yup.string().test(
          'checkFuture',
          t('error:error_last_greater_equal_first', {
            first: t('current_moment'),
            last: t('due_on'),
          }),
          function (dueDateId) {
            const selectedDueDateItem = find(
              allCourseDays,
              (courseDay) => courseDay?.id === dueDateId
            );

            if (moment(selectedDueDateItem?.endTime).isBefore(moment())) {
              //due on base on end time
              return false;
            }
            // if (!selectedDueDateItem?.future) {
            //   return false;
            // }
            return true;
          }
        ),
      })
      .test(
        'checkBeforeAfter',
        t('error:error_last_greater_equal_first', {
          first: t('assigned_on'),
          last: t('due_on'),
        }),
        function (dueDateId) {
          const assignDateId = this.resolve(Yup.ref('assignDateId'));
          const selectedDueDateItem = find(
            allCourseDays,
            (courseDay) => courseDay?.id === dueDateId
          );
          const selectedAssignDateItem = find(
            allCourseDays,
            (courseDay) => courseDay?.id === assignDateId
          );

          if (
            dueDateId &&
            assignDateId &&
            moment(selectedDueDateItem?.endTime).isBefore(
              moment(selectedAssignDateItem?.date)
              // 'day'
            )
          ) {
            return false;
          }
          return true;
        }
      ),
    assignDateId: Yup.string()
      .nullable()
      .when('status', {
        is: 0, // status === draft
        otherwise: Yup.string().required(t('common:required_message')),
        then: Yup.string().notRequired(),
      })
      /* From Quynh Le: allow to change assign on in the past => BE update status from ready to assign to assigned */

      // .when('status', {
      //   is: 1, // status === ready to assign
      //   then: Yup.string().test(
      //     'checkFuture',
      //     t('error:error_last_greater_equal_first', {
      //       first: t('current_moment'),
      //       last: t('assigned_on'),
      //     }),
      //     function (assignDateId) {
      //       const selectedAssignDateItem = find(
      //         allCourseDays,
      //         (courseDay) => courseDay?.id === assignDateId
      //       );
      //       if (!selectedAssignDateItem?.future) {
      //         return false;
      //       }
      //       return true;
      //     }
      //   ),
      // })

      .when('status', {
        is: 2, // status === assigned
        then: Yup.string().test(
          'checkPast',
          t('error:error_first_less_equal_last', {
            first: t('assigned_on'),
            last: t('current_moment'),
          }),
          function (assignDateId) {
            // const allCourseDays = flattenDeep(
            //   courseDayList?.map((semester) => semester?.dates)
            // );
            const selectedAssignDateItem = find(
              allCourseDays,
              (courseDay) => courseDay?.id === assignDateId
            );
            if (!!selectedAssignDateItem?.future) {
              return false;
            }
            return true;
          }
        ),
      })

      .test(
        'checkBeforeAfter',
        t('error:error_first_less_equal_last', {
          first: t('assigned_on'),
          last: t('due_on'),
        }),
        function (assignDateId) {
          const dueDateId = this.resolve(Yup.ref('dueDateId'));

          const selectedAssignDateItem = find(
            allCourseDays,
            (courseDay) => courseDay?.id === assignDateId
          );
          const selectedDueDateItem = find(
            allCourseDays,
            (courseDay) => courseDay?.id === dueDateId
          );
          if (
            assignDateId &&
            dueDateId &&
            moment(selectedDueDateItem?.date).isBefore(
              moment(selectedAssignDateItem?.date)
              // 'day'
            )
          ) {
            return false;
          }
          return true;
        }
      ),
  });
  // const iniVal = {
  //   // ...shadowAssignment,
  //   status: tempShadowAssignment?.status || shadowAssignment?.status,
  //   assignDateId:
  //     tempShadowAssignment?.assignDateId || shadowAssignment?.assignDateId,
  //   dueDateId: tempShadowAssignment?.dueDateId || shadowAssignment?.dueDateId,
  //   // ...shadowAssignmentInfo,
  // };
  const formik = useFormik({
    // initialValues: tempShadowAssignment,
    initialValues: {
      // ...shadowAssignment,
      status: !isNil(tempShadowAssignment?.status)
        ? tempShadowAssignment?.status
        : shadowAssignment?.status,
      assignDateId:
        tempShadowAssignment?.assignDateId || shadowAssignment?.assignDateId,
      dueDateId: tempShadowAssignment?.dueDateId || shadowAssignment?.dueDateId,
      // ...shadowAssignmentInfo,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
  });

  const {
    values,
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    resetForm,
    setFieldError,
    validateForm,
  } = formik;

  const statusArray = () => {
    let status;
    if (shadowAssignmentStatus === 2) {
      return (status = [{ value: 2, name: t('assigned') }]);
    }
    if (values?.status === 0) {
      if (!assignDateObject?.future) {
        status = [
          { value: 0, name: t('draft') },
          { value: 2, name: t('assigned') },
        ];
      } else {
        status = [
          { value: 0, name: t('draft') },
          { value: 1, name: t('ready_to_assign') },
        ];
      }
    }
    if (values?.status === 1) {
      status = [
        { value: 0, name: t('draft') },
        { value: 1, name: t('ready_to_assign') },
      ];
    }
    if (values?.status === 2) {
      status = [
        { value: 0, name: t('draft') },
        { value: 2, name: t('assigned') },
      ];
    }
    return status;
  };

  const dueDateObject = find(
    allCourseDays,
    (courseDay) => Number(courseDay?.id) === Number(values.dueDateId)
  );

  const assignDateObject = find(
    allCourseDays,
    (courseDay) => Number(courseDay?.id) === Number(values.assignDateId)
  );

  const toggleCloseDrawer = useCallback(() => {
    // setVisible(false);
    onClose();
    resetForm();
    setTempShadowAssignment({});
    if (isUpdatedMasterItem) {
      /**
       *NOTE: Update current column which contains assignment
       *Reference: https://communicate.atlassian.net/browse/TL-3041
       */
      dispatch(
        myCoursesActions.myCoursesSetState({
          queueUpdate: {
            [shadowAssignment?.masterAssignment?.courseDayId]: true,
          },
        })
      );
    }
    dispatch(
      myCoursesActions.myCoursesSetState({
        errorShadowAssignment: null,
      })
    );
    // dispatch(
    //   myCoursesActions.myCoursesSetState({
    //     assignment: {},
    //     error: null,
    //   })
    // );
  }, [dispatch, isUpdatedMasterItem, onClose, resetForm, shadowAssignment]);

  const getShadowAssignmentDetail = useCallback(() => {
    if (shadowAssignmentId && visible)
      dispatch(
        myCoursesActions.getShadowAssignmentDetail({
          orgId: organizationId,
          courseId: courseId,
          shadowId: shadowAssignmentId,
        })
      );
  }, [courseId, dispatch, organizationId, shadowAssignmentId, visible]);

  useEffect(() => {
    getShadowAssignmentDetail();
  }, [getShadowAssignmentDetail, visibleMasterAssignment]);

  useEffect(() => {
    if (visible) {
      setIsUpdatedMasterItem(false);
    }
  }, [visible]);

  const getCourseDayList = useCallback(() => {
    if (sectionId && visible)
      dispatch(
        myCoursesActions.mcGetCourseDayList({
          orgId: organizationId,
          courseId: courseId,
          sectionId: sectionId,
          urlParams: { timezone: timezone },
        })
      );
  }, [courseId, dispatch, organizationId, sectionId, timezone, visible]);

  const mcUpdateShadowAssignments = useCallback(() => {
    const selectedAssignDateItem = find(
      allCourseDays,
      (courseDay) => Number(courseDay?.id) === values?.assignDateId
    );
    updateShadowAssignments &&
      //courseDayId, sourceId, shadowId, activity, timeout
      updateShadowAssignments(
        Number(selectedAssignDateItem?.courseDayId),
        Number(shadowAssignment?.assignDate?.courseDayId),
        shadowAssignmentId
      );
  }, [
    allCourseDays,
    shadowAssignment,
    shadowAssignmentId,
    updateShadowAssignments,
    values,
  ]);

  useEffect(() => {
    getCourseDayList();
  }, [getCourseDayList]);

  useEffect(() => {
    if (editShadowAssignmentSuccess) {
      toggleCloseDrawer();
      // showNotification();
      dispatch(
        myCoursesActions.myCoursesSetState({
          editShadowAssignmentSuccess: false,
        })
      );
      // props.updateShadowAssignments && props.updateShadowAssignments();
      mcUpdateShadowAssignments();
    }
  }, [
    dispatch,
    editShadowAssignmentSuccess,
    mcUpdateShadowAssignments,
    toggleCloseDrawer,
  ]);

  useEffect(() => {
    if (editShadowAssignmentFailed) {
      if ([1, 2, 3, 4, 5, 6].includes(errorShadowAssignment?.subcode)) {
        setFieldError(
          'status',
          t('error:missing_required_field_in_master_item')
        );
      }
    }
  }, [editShadowAssignmentFailed, errorShadowAssignment, setFieldError, t]);

  useEffect(() => {
    if (editMasterAssignmentSuccess && visible) {
      setIsUpdatedMasterItem(true);
      if (getCourseItemByUnit && shadowAssignment?.masterAssignment?.unitId) {
        getCourseItemByUnit();
      }
    }
  }, [
    editMasterAssignmentSuccess,
    getCourseItemByUnit,
    shadowAssignment,
    visible,
  ]);

  const handleSubmit = () => {
    const payload = {
      status: values?.status,
      dueDateId: values?.dueDateId,
      assignDateId: values?.assignDateId,
    };
    validateForm();
    setFieldTouched('dueDateId');
    setFieldTouched('assignDateId');
    if (isEmpty(errors)) {
      dispatch(
        myCoursesActions.editShadowAssignment({
          orgId: organizationId,
          courseId: courseId,
          // unitId: 67,
          shadowId: shadowAssignmentId,
          data: payload,
        })
      );
    }
  };
  const handleChange = (fieldName, value) => {
    setFieldValue(fieldName, value);
    setFieldTouched(fieldName, true);
    setTempShadowAssignment({ ...tempShadowAssignment, [fieldName]: value });
    dispatch(
      myCoursesActions.myCoursesSetState({
        error: null,
      })
    );
  };

  function EditActivityDetails(props) {
    return (
      <Box
        onClick={() =>
          setVisibleMasterAssignment(props.disabled ? false : true)
        }
      >
        <Grid
          container
          direction='row'
          className={
            props.disabled
              ? classes.disableEditActivityDetail
              : classes.editActivityDetail
          }
        >
          <Grid item>
            <CreateIcon className={classes.icon} />
          </Grid>
          <Grid item>{t('edit_master_details')}</Grid>
        </Grid>
      </Box>
    );
  }

  const showFormError =
    ![1, 2, 3, 4, 5, 6].includes(errorShadowAssignment?.subcode) &&
    isEmpty(errors) &&
    !isEmpty(errorShadowAssignment);

  const renderContent = () => (
    <form>
      {showFormError && (
        <Box mb={2}>
          <Alert severity='error'>{errorShadowAssignment?.message}</Alert>
        </Box>
      )}
      <div className={classes.content}>
        <Typography
          classes={{ root: classes.rootSectionName }}
          color='primary'
          noWrap
        >
          {shadowAssignment?.assignDate?.section?.sectionName}
        </Typography>
        <Grid container>
          <Grid item xs={6}>
            <Box mr={1.5}>
              <TblSelect
                required
                label={t('assigned_on')}
                name='assignDateId'
                onChange={(e, child) =>
                  handleChange('assignDateId', e.target.value, child)
                }
                // onChange={(e, child) => console.log(e, child)}
                value={values?.assignDateId || null}
                errorMessage={touched.assignDateId ? errors.assignDateId : ''}
                error={touched.assignDateId && errors.assignDateId}
                // status: Yup.string().nullable(),
                disabled={
                  isScheduledStatus ||
                  shadowAssignmentStatus === 2 ||
                  !hasPermission
                }
              >
                {courseDayList?.map((semester, semesterIndex) => [
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
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box ml={1.5}>
              <TblSelect
                required
                label={t('due_on')}
                name='dueDateId'
                onChange={(e, child) =>
                  handleChange('dueDateId', e.target.value, child)
                }
                errorMessage={touched.dueDateId && errors.dueDateId}
                error={touched.dueDateId && errors.dueDateId}
                value={values?.dueDateId || null}
                disabled={isScheduledStatus || !hasPermission}
                renderValue={() => dueDateObject?.courseDayName}
              >
                {values.status === 0
                  ? courseDayList?.map((semester, semesterIndex) => [
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
                    ])
                  : futureCourseDayList?.map((semester, semesterIndex) => [
                      <ClickAwayListener mouseEvent={false}>
                        <ListSubheader
                          color='primary'
                          disableSticky
                          onClick={(e) => e.stopPropagation()}
                        >
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
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box mr={1.5} mt={2}>
              <TblSelect
                required
                label={t('status')}
                name='status'
                errorMessage={errors.status}
                error={errors.status}
                // disabled={isScheduledStatus || !hasPermission}
                disabled={true}
                onChange={(e) => handleChange('status', e.target.value)}
                value={values?.status}
              >
                {!isScheduledStatus ? (
                  statusArray()?.map((stt, i) => (
                    <MenuItem value={stt.value} key={i}>
                      {stt.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={shadowAssignmentStatus}>
                    {shadowAssignmentStatus === -2
                      ? t('assigned_late')
                      : t('closed')}
                  </MenuItem>
                )}
              </TblSelect>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box ml={1.5} mt={7}>
              <EditActivityDetails disabled={!hasPermission} />
            </Box>
          </Grid>
        </Grid>
      </div>
    </form>
  );
  return (
    <>
      {editShadowAssignmentSuccess && <TblUseSnackbar />}

      {visibleMasterAssignment && (
        <CreateAssignmentDrawer
          visible={visibleMasterAssignment}
          onClose={() => setVisibleMasterAssignment(false)}
          unitId={shadowAssignment?.masterAssignment?.unitId}
          shadowAssignmentInfo={shadowAssignmentInfo}
          // unit={contextMenu?.assignment?.unitInfo || contextMenu?.unit}
          assignmentId={shadowAssignment?.masterAssignment?.id}
          // updateUnit={updateUnit}
        />
      )}
      <TblDialog
        open={visible}
        onClose={toggleCloseDrawer}
        title={
          <div className={classes.rootTitle} noWrap color='primary'>
            {/* <BallotIcon className={classes.icon} /> */}
            <TblActivityIcon
              type={COURSE_ITEM_TYPE.ASSIGNMENT}
              className={classes.icon}
            />
            <Typography
              lineHeight={'30px'}
              noWrap
              color='primary'
              className={classes.title}
            >
              {shadowAssignment?.masterAssignment?.assignmentName}
            </Typography>
          </div>
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

ShadowAssignmentDialog.propTypes = {
  visible: PropTypes.bool,
  disabled: PropTypes.bool,
  onClose: PropTypes.func,
  shadowAssignmentInfo: PropTypes.object,
  sectionId: PropTypes.bool,
  updateShadowAssignments: PropTypes.func,
  getCourseItemByUnit: PropTypes.func,
};

ShadowAssignmentDialog.defaultProps = {
  visible: false,
};

export default ShadowAssignmentDialog;
