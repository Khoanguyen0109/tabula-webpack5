import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import find from 'lodash/find';
import flattenDeep from 'lodash/flattenDeep';
import compose from 'lodash/flowRight';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';

import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import CreateEditQuiz from 'shared/MyCourses/containers/CreateEditQuiz';

import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import courseActions from 'modules/MyCourses/actions';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { QUIZ_STATUS, QUIZ_TYPE } from '../../constants';

const styles = (theme) => ({
  editIcon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    fontSize: theme.spacing(3),
    cursor: 'pointer',
    color: theme.mainColors.primary2[0],
  },
  editActivityDetails: {
    color: theme.mainColors.primary2[0],
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: theme.mainColors.primary2[0],
      cursor: 'pointer',
    },
  },
  iconCourseItem: {
    fontSize: theme.fontSizeIcon.medium,
  },
  title: {
    width: 'calc(100% - 24px)',
  },
  content: {
    '& .TblInputs': {
      marginBottom: 0,
    },
    '& .shadow-quiz': {
      marginBottom: 0,
    },
  },
  disabled: {
    cursor: 'default',
    color: theme.mainColors.gray[6],
    '&:hover': {
      textDecoration: 'none',
      color: theme.mainColors.gray[6],
      cursor: 'default',
    },
  },
});

class EditShadowQuiz extends React.PureComponent {
  state = {
    isVisibleEditMasterQuiz: false,
    masterQuizInfo: {},
    isUpdatedMasterItem: false,
  };

  componentDidUpdate(prevProps) {
    const {
      t,
      errorShadow,
      mcUpdateShadowQuizzesSuccess,
      editQuizSuccess,
      open,
      setMyCoursesState,
      updateShadowQuizzes,
      courseDayList,
      shadowQuizDetail,
      shadowId,
    } = this.props;
    if (this.props.open && this.props.open !== prevProps.open) {
      this.getCourseDayList();
      this.getShadowQuizDetail();
      this.setState({ isUpdatedMasterItem: false });
    }
    if (prevProps.isEditingShadowQuizzes) {
      if (isEmpty(errorShadow) && mcUpdateShadowQuizzesSuccess) {
        this.props.enqueueSnackbar(t('common:change_saved'), {
          variant: 'success',
        });
        this.onCloseDrawer();
      } else {
        if (
          [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(
            errorShadow?.subcode
          )
        ) {
          if (this.formikRef) {
            this.formikRef.setFieldError(
              'status',
              t('error:missing_required_field_in_master_item')
            );
          }
        }
      }
    }
    if (mcUpdateShadowQuizzesSuccess) {
      setMyCoursesState({ mcUpdateShadowQuizzesSuccess: false });
      const newCourseDayList = [];
      forEach(courseDayList, (item) => {
        forEach(item?.dates, (element) => {
          newCourseDayList.push(element);
        });
      });
      const courseDayObject = newCourseDayList.find(
        (item) => item?.id === this.formikRef.values.executeDateId
      );
      if (updateShadowQuizzes) {
        updateShadowQuizzes(
          Number(courseDayObject?.courseDayId),
          Number(shadowQuizDetail?.executeDate?.courseDayId),
          shadowId
        );
      }
    }
    if (!prevProps.editQuizSuccess && editQuizSuccess && open) {
      const { getCourseItemByUnit, shadowQuizDetail } = this.props;
      //NOTE: Fix bug don't reload data after edit master quiz success
      this.getShadowQuizDetail();
      this.setState({ isUpdatedMasterItem: true });
      if (getCourseItemByUnit && shadowQuizDetail?.masterQuiz?.unitId) {
        getCourseItemByUnit();
      }
    }
  }

  componentWillUnmount() {
    this.props.setMyCoursesState({
      errorShadow: {},
      error: {},
      shadowQuizDetail: {},
    });
  }

  onCloseDrawer = () => {
    const { shadowQuizDetail, onCloseDrawer, setMyCoursesState } = this.props;
    if (this.formikRef) {
      this.formikRef.resetForm();
    }
    if (this.state.isUpdatedMasterItem) {
      /**
       *NOTE: Update current column which contains quiz
       *Reference: https://communicate.atlassian.net/browse/TL-3041
       */
      setMyCoursesState({
        queueUpdate: { [shadowQuizDetail?.executeDate?.courseDayId]: true },
      });
    }
    if (onCloseDrawer) {
      onCloseDrawer();
    }
  };

  onOpenEditMasterQuiz = () => {
    const { shadowQuizDetail, hasPermission } = this.props;
    if (hasPermission) {
      this.setState(
        {
          isVisibleEditMasterQuiz: true,
          masterQuizInfo: shadowQuizDetail?.masterQuiz,
        },
        () => {
          this.props.setMyCoursesState({ errorShadow: {} });
          if (this.formikRef && !!this.formikRef?.errors?.status) {
            this.formikRef.setFieldError('status', null);
          }
        }
      );
    }
  };

  onCloseEditMasterQuiz = () => {
    this.setState({ isVisibleEditMasterQuiz: false });
  };

  getCourseDayList = () => {
    const {
      currentUser: { organizationId, timezone },
      courseId,
      sectionId,
    } = this.props;
    this.props.getCourseDayList({
      orgId: organizationId,
      courseId,
      sectionId,
      urlParams: { timezone },
    });
  };

  getShadowQuizDetail = () => {
    const {
      currentUser: { organizationId },
      courseId,
      shadowId,
    } = this.props;
    this.props.getShadowQuizDetail({
      orgId: organizationId,
      courseId,
      shadowId,
      errorShadow: {},
      isFetchingShadowQuizDetail: true,
      shadowQuizDetail: {},
    });
  };

  renderEditActivityDetails = (t) => {
    const { classes, hasPermission } = this.props;
    return (
      <Box ml={1.5} mt={7} display='flex'>
        <div
          className={`${classes.editIcon} ${clsx({
            [classes.disabled]: !hasPermission,
          })}`}
          onClick={this.onOpenEditMasterQuiz}
        >
          <EditIcon color='inherit' fontSize='inherit' />
        </div>
        <Box ml={1}>
          <div
            className={`${classes.editActivityDetails} ${clsx({
              [classes.disabled]: !hasPermission,
            })}`}
            onClick={this.onOpenEditMasterQuiz}
          >
            <Typography variant='bodyMedium' color='inherit'>
              {t('edit_master_details')}
            </Typography>
          </div>
        </Box>
      </Box>
    );
  };

  renderTakenOnList = (values) => {
    const { courseDayList } = this.props;
    switch (values.status) {
      case QUIZ_STATUS.DRAFT:
        return courseDayList.map((item) => [
          <ClickAwayListener mouseEvent={false}>
            <ListSubheader color='primary' disableSticky>
              {item?.termName}
            </ListSubheader>
          </ClickAwayListener>,
          item?.dates.map((element) => (
            <MenuItem value={element.id} key={element.id}>
              {element.courseDayName}
            </MenuItem>
          )),
        ]);
      case QUIZ_STATUS.PUBLIC:
      case QUIZ_STATUS.PUBLIC_VISIBLE:
        return courseDayList.map((item) => [
          <ClickAwayListener mouseEvent={false}>
            <ListSubheader color='primary' disableSticky>
              {item?.termName}
            </ListSubheader>
          </ClickAwayListener>,
          item?.dates
            .filter((element) => element?.future)
            .map((element) => (
              <MenuItem value={element.id} key={element.id}>
                {element.courseDayName}
              </MenuItem>
            )),
        ]);
      default:
        break;
    }
  };

  renderPopQuiz = (
    t,
    { setFieldValue, errors, touched, submitCount, values }
  ) => {
    const { courseDayList, hasPermission, shadowQuizDetail } = this.props;
    const allCourseDays = flattenDeep(
      courseDayList?.map((semester) => semester?.dates)
    );
    const executeDateObject = find(
      allCourseDays,
      (courseDay) => courseDay?.id === values.executeDateId
    );

    return (
      <Grid xs={12} item container>
        <Grid xs={6} item>
          <Box mr={1.5}>
            <Field
              name='executeDateId'
              label={t('taken_on')}
              as={TblSelect}
              required
              error={
                !!(
                  errors.executeDateId &&
                  (touched.executeDateId || submitCount)
                )
              }
              errorMessage={
                !!(
                  errors.executeDateId &&
                  (touched.executeDateId || submitCount)
                )
                  ? errors.executeDateId
                  : false
              }
              renderValue={() => executeDateObject?.courseDayName ?? ''}
              disabled={
                !hasPermission ||
                [QUIZ_STATUS.PUBLISHED, QUIZ_STATUS.CLOSED].includes(
                  shadowQuizDetail?.status
                )
              }
            >
              {this.renderTakenOnList(values)}
            </Field>
          </Box>
        </Grid>
        <Grid xs={6} item>
          <Box ml={1.5}>
            <Field
              name='makeupDeadline'
              label={t('make_up_deadline')}
              as={TblInputs}
              inputType='date'
              classNameForBox='shadow-quiz'
              // required
              onChange={(value) => {
                setFieldValue('makeupDeadline', value);
              }}
              error={
                !!(
                  errors.makeupDeadline &&
                  (touched.makeupDeadline || submitCount)
                )
              }
              errorMessage={
                !!(
                  errors.makeupDeadline &&
                  (touched.makeupDeadline || submitCount)
                )
                  ? errors.makeupDeadline
                  : false
              }
              viewOnly={!hasPermission}
              disabled={!hasPermission}
            />
          </Box>
        </Grid>
      </Grid>
    );
  };

  renderAnnounceQuiz = (
    t,
    { setFieldValue, errors, touched, submitCount, values }
  ) => {
    const { courseDayList, hasPermission, shadowQuizDetail } = this.props;
    const allCourseDays = flattenDeep(
      courseDayList?.map((semester) => semester?.dates)
    );
    const executeDateObject = find(
      allCourseDays,
      (courseDay) => courseDay?.id === values.executeDateId
    );
    return (
      <Grid xs={12} item container>
        <Grid xs={6} item>
          <Box mr={1.5}>
            <Field
              name='announceDateId'
              label={t('announced_on')}
              as={TblSelect}
              required
              error={
                !!(
                  errors.announceDateId &&
                  (touched.announceDateId || submitCount)
                )
              }
              errorMessage={
                !!(
                  errors.announceDateId &&
                  (touched.announceDateId || submitCount)
                )
                  ? errors.announceDateId
                  : false
              }
              disabled={
                !hasPermission ||
                [
                  QUIZ_STATUS.PUBLIC_VISIBLE,
                  QUIZ_STATUS.PUBLISHED,
                  QUIZ_STATUS.CLOSED,
                ].includes(shadowQuizDetail?.status)
              }
            >
              {courseDayList.map((item) => [
                <ClickAwayListener mouseEvent={false}>
                  <ListSubheader color='primary' disableSticky>
                    {item?.termName}
                  </ListSubheader>
                </ClickAwayListener>,
                item?.dates.map((element) => (
                  <MenuItem value={element.id} key={element.id}>
                    {element.courseDayName}
                  </MenuItem>
                )),
              ])}
            </Field>
            <Box mt={2}>
              <Field
                name='makeupDeadline'
                label={t('make_up_deadline')}
                as={TblInputs}
                inputType='date'
                classNameForBox='shadow-quiz'
                // required
                onChange={(value) => {
                  setFieldValue('makeupDeadline', value);
                }}
                error={
                  !!(
                    errors.makeupDeadline &&
                    (touched.makeupDeadline || submitCount)
                  )
                }
                errorMessage={
                  !!(
                    errors.makeupDeadline &&
                    (touched.makeupDeadline || submitCount)
                  )
                    ? errors.makeupDeadline
                    : false
                }
                disabled={!hasPermission}
              />
            </Box>
          </Box>
        </Grid>
        <Grid xs={6} item>
          <Box ml={1.5}>
            <Field
              name='executeDateId'
              label={t('taken_on')}
              as={TblSelect}
              required
              error={
                !!(
                  errors.executeDateId &&
                  (touched.executeDateId || submitCount)
                )
              }
              errorMessage={
                !!(
                  errors.executeDateId &&
                  (touched.executeDateId || submitCount)
                )
                  ? errors.executeDateId
                  : false
              }
              renderValue={() => executeDateObject?.courseDayName}
              disabled={
                !hasPermission ||
                [QUIZ_STATUS.PUBLISHED, QUIZ_STATUS.CLOSED].includes(
                  shadowQuizDetail?.status
                )
              }
            >
              {this.renderTakenOnList(values)}
            </Field>
          </Box>
        </Grid>
      </Grid>
    );
  };

  renderStatus = (t) => {
    const { shadowQuizDetail } = this.props;
    const statusArray = [
      { value: 0, text: t('common:draft') },
      {
        value: [QUIZ_STATUS.DRAFT, QUIZ_STATUS.PUBLIC].includes(
          shadowQuizDetail?.status
        )
          ? 1
          : shadowQuizDetail?.status,
        text: t('common:published'),
      },
    ];
    switch (shadowQuizDetail?.status) {
      case QUIZ_STATUS.DRAFT:
      case QUIZ_STATUS.PUBLIC_VISIBLE:
      case QUIZ_STATUS.PUBLIC:
        return statusArray.map((item) => (
          <MenuItem value={item.value} key={item.value}>
            {item.text}
          </MenuItem>
        ));
      case QUIZ_STATUS.PUBLISHED:
        return (
          <MenuItem value={QUIZ_STATUS.PUBLISHED}>
            {t('common:published')}
          </MenuItem>
        );
      case QUIZ_STATUS.CLOSED:
        return (
          <MenuItem value={QUIZ_STATUS.CLOSED}>{t('common:closed')}</MenuItem>
        );
      default:
        break;
    }
  };

  renderContent = ({ values, errors, touched, submitCount, setFieldValue }) => {
    const {
      t,
      shadowQuizDetail,
      shadowQuizInfo: { quizType },
      classes,
    } = this.props;
    return (
      <div className={classes.content}>
        <Box ml={1}>
          <Typography variant='bodyMedium' color='primary'>
            {shadowQuizDetail?.executeDate?.section?.sectionName ??
              'Section Name'}
          </Typography>
        </Box>
        <Form>
          <Box mt={2}>
            <Grid container spacing={0}>
              {quizType === QUIZ_TYPE.ANNOUNCED
                ? this.renderAnnounceQuiz(t, {
                    setFieldValue,
                    errors,
                    touched,
                    submitCount,
                    values,
                  })
                : this.renderPopQuiz(t, {
                    setFieldValue,
                    errors,
                    touched,
                    submitCount,
                    values,
                  })}
              <Grid item container xs={12}>
                <Grid item xs={6}>
                  <Box mr={1.5} mt={2}>
                    <Field
                      name='status'
                      as={TblSelect}
                      label={t('common:status')}
                      // disabled={!hasPermission}
                      disabled={true}
                      error={
                        !!(errors.status && (touched.status || submitCount))
                      }
                      errorMessage={
                        !!(errors.status && (touched.status || submitCount))
                          ? errors.status
                          : false
                      }
                    >
                      {this.renderStatus(t)}
                    </Field>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  {this.renderEditActivityDetails(t)}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Form>
      </div>
    );
  };

  getInitialValues = () => {
    const {
      shadowQuizDetail,
      shadowQuizInfo: { quizType },
    } = this.props;
    let initialValues = {
      executeDateId: '',
      status: QUIZ_STATUS.DRAFT,
      makeupDeadline: null,
    };
    if (quizType === QUIZ_TYPE.ANNOUNCED) {
      Object.assign(initialValues, {
        announceDateId: '',
      });
    }
    if (!isEmpty(shadowQuizDetail)) {
      initialValues = {
        executeDateId: shadowQuizDetail?.executeDateId,
        status: shadowQuizDetail?.status,
        makeupDeadline: !!shadowQuizDetail?.makeupDeadline
          ? moment(shadowQuizDetail?.makeupDeadline)
          : shadowQuizDetail?.makeupDeadline,
      };
      if (quizType === QUIZ_TYPE.ANNOUNCED) {
        Object.assign(initialValues, {
          announceDateId: shadowQuizDetail?.announceDateId,
        });
      }
    }

    return { ...initialValues };
  };

  getValidationFields = () => {
    const {
      t,
      shadowQuizInfo: { quizType },
      courseDayList,
    } = this.props;
    let validationFields = {
      makeupDeadline: Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        // .required(t('common:required_message'))
        .test(
          'checkBeforeAfter',
          t('error:error_last_greater_equal_first', {
            first: t('taken_on'),
            last: t('make_up_deadline'),
          }),
          function (makeupDeadline) {
            const executeDateId = this.resolve(Yup.ref('executeDateId'));
            const allCourseDays = flattenDeep(
              courseDayList?.map((semester) => semester?.dates)
            );
            const selectedExecuteDateItem = find(
              allCourseDays,
              (courseDay) => courseDay?.id === executeDateId
            );
            if (
              makeupDeadline &&
              executeDateId &&
              moment(makeupDeadline).isBefore(
                moment(selectedExecuteDateItem?.endTime),
                'day'
              )
            ) {
              return false;
            }
            return true;
          }
        ),
      executeDateId: Yup.string()
        .when('status', {
          is: QUIZ_STATUS.DRAFT,
          then: Yup.string().required(t('common:required_message')),
        })
        .when('status', {
          is: (val) =>
            val === QUIZ_STATUS.PUBLIC || val === QUIZ_STATUS.PUBLIC_VISIBLE,
          then: Yup.string()
            .required(t('common:required_message'))
            .test(
              'checkFuture',
              t('error:error_last_greater_equal_first', {
                first: t('current_moment'),
                last: t('taken_on'),
              }),
              function (executeDateId) {
                const allCourseDays = flattenDeep(
                  courseDayList?.map((semester) => semester?.dates)
                );
                const selectedExecuteItem = find(
                  allCourseDays,
                  (courseDay) => courseDay?.id === executeDateId
                );

                if (!selectedExecuteItem?.future) {
                  return false;
                }
                return true;
              }
            ),
        }),
    };
    if (quizType === QUIZ_TYPE.ANNOUNCED) {
      Object.assign(validationFields, {
        announceDateId: Yup.string()
          .nullable()
          // .required(t('common:required_message'))
          .test(
            'checkBeforeAfter',
            t('error:error_first_less_equal_last', {
              first: t('announced_on'),
              last: t('taken_on'),
            }),
            function (announceDateId) {
              const executeDateId = this.resolve(Yup.ref('executeDateId'));
              const allCourseDays = flattenDeep(
                courseDayList?.map((semester) => semester?.dates)
              );
              const selectedAnnounceItem = find(
                allCourseDays,
                (courseDay) => courseDay?.id === announceDateId
              );
              const selectedExecuteDateItem = find(
                allCourseDays,
                (courseDay) => courseDay?.id === executeDateId
              );

              if (
                announceDateId &&
                executeDateId &&
                moment(selectedAnnounceItem?.date).isAfter(
                  moment(selectedExecuteDateItem?.date),
                  'day'
                )
              ) {
                return false;
              }
              return true;
            }
          )
          /**
           * NOTE: This code to handle for improvement TL-3045
           * Reference: https://communicate.atlassian.net/browse/TL-3045
           */
          .when('status', {
            is: (val) =>
              val === QUIZ_STATUS.PUBLIC || val === QUIZ_STATUS.PUBLIC_VISIBLE,
            then: Yup.string().required(t('common:required_message')),
          }),
        executeDateId: Yup.string()
          .required(t('common:required_message'))
          .test(
            'checkBeforeAfter',
            t('error:error_last_greater_equal_first', {
              first: t('announced_on'),
              last: t('taken_on'),
            }),
            function (executeDateId) {
              const announceDateId = this.resolve(Yup.ref('announceDateId'));
              const allCourseDays = flattenDeep(
                courseDayList?.map((semester) => semester?.dates)
              );
              const selectedAnnounceItem = find(
                allCourseDays,
                (courseDay) => courseDay?.id === announceDateId
              );
              const selectedExecuteDateItem = find(
                allCourseDays,
                (courseDay) => courseDay?.id === executeDateId
              );

              if (
                announceDateId &&
                executeDateId &&
                moment(selectedAnnounceItem?.date).isAfter(
                  moment(selectedExecuteDateItem?.date),
                  'day'
                )
              ) {
                return false;
              }
              return true;
            }
          )
          .when('status', {
            is: QUIZ_STATUS.DRAFT,
            then: Yup.string().required(t('common:required_message')),
          })
          .when('status', {
            is: (val) =>
              val === QUIZ_STATUS.PUBLIC || val === QUIZ_STATUS.PUBLIC_VISIBLE,
            then: Yup.string()
              .required(t('common:required_message'))
              .test(
                'checkFuture',
                t('error:error_last_greater_equal_first', {
                  first: t('current_moment'),
                  last: t('taken_on'),
                }),
                function (executeDateId) {
                  const allCourseDays = flattenDeep(
                    courseDayList?.map((semester) => semester?.dates)
                  );
                  const selectedExecuteItem = find(
                    allCourseDays,
                    (courseDay) => courseDay?.id === executeDateId
                  );

                  if (!selectedExecuteItem?.future) {
                    return false;
                  }
                  return true;
                }
              ),
          }),
      });
    }
    return validationFields;
  };

  render() {
    const {
      t,
      open,
      /*shadowQuizInfo: { quizType },*/ shadowQuizInfo,
      classes,
      isEditingShadowQuizzes,
      errorShadow,
      currentUser: { organizationId },
      courseId,
      shadowId,
      isFetchingShadowQuizDetail,
      hasPermission,
      shadowQuizDetail,
      // courseDayList
    } = this.props;
    const { isVisibleEditMasterQuiz, masterQuizInfo } = this.state;
    const validationSchema = Yup.object().shape(this.getValidationFields());
    return (
      <Formik
        innerRef={(node) => (this.formikRef = node)}
        initialValues={this.getInitialValues()}
        validationSchema={validationSchema}
        enableReinitialize={true}
        validateOnChange={true}
        validateOnBlur={false}
        onSubmit={(values) => {
          const newValues = { ...values };
          let activity = Object.assign(newValues, {
            executeDateId: newValues.executeDateId,
            // NOTE: Set 23:59 to makeupDeadline follow TL-3091
            makeupDeadline: moment(newValues.makeupDeadline).isValid()
              ? moment(newValues.makeupDeadline)
                  .hour('23')
                  .minute('59')
                  .format()
              : null,
          });
          //NOTE: Don't send fields disabled
          if (
            [QUIZ_STATUS.PUBLISHED, QUIZ_STATUS.CLOSED].includes(
              activity.status
            )
          ) {
            activity = omit(activity, ['executeDateId', 'announceDateId']);
          }
          const payload = {
            orgId: organizationId,
            courseId,
            shadowId,
            activity,
            isInModal: true,
            isEditingShadowQuizzes: true,
            errorShadow: {},
          };
          this.props.updateShadowQuiz(payload);
        }}
      >
        {(propsForm) => (
          <TblDialog
            fullWidth={true}
            onClose={this.onCloseDrawer}
            title={
              <Box display='flex' alignItems='center'>
                {/* {quizType === QUIZ_TYPE.ANNOUNCED ? <PlaylistAddCheckRoundedIcon className={classes.iconCourseItem} /> : < PollRoundedIcon className={classes.iconCourseItem} />} */}
                <TblActivityIcon
                  type={COURSE_ITEM_TYPE.QUIZ}
                  className={classes.iconCourseItem}
                />
                <Box ml={1} width={'98%'}>
                  <div className={`text-ellipsis ${classes.title}`}>
                    {isEmpty(shadowQuizInfo)
                      ? t('common:lesson')
                      : shadowQuizDetail?.masterQuiz?.quizName ??
                        shadowQuizInfo?.name}
                  </div>
                </Box>
              </Box>
            }
            open={open}
            footer={
              <>
                <TblButton
                  variant='outlined'
                  size='medium'
                  color='primary'
                  onClick={this.onCloseDrawer}
                >
                  {t('common:cancel')}
                </TblButton>
                {hasPermission && (
                  <TblButton
                    size='medium'
                    variant='contained'
                    color='primary'
                    onClick={propsForm.handleSubmit}
                    type='submit'
                    disabled={isEditingShadowQuizzes}
                    isShowCircularProgress={isEditingShadowQuizzes}
                  >
                    {t('common:save')}
                  </TblButton>
                )}
              </>
            }
          >
            {!isEmpty(errorShadow) &&
              ![3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(
                errorShadow?.subcode
              ) && (
                <Box mb={2}>
                  <Alert severity='error'>{errorShadow?.message}</Alert>
                </Box>
              )}
            {isVisibleEditMasterQuiz && (
              <CreateEditQuiz
                orgId={organizationId}
                onClose={this.onCloseEditMasterQuiz}
                isVisible={isVisibleEditMasterQuiz}
                quizId={masterQuizInfo?.id}
                courseId={courseId}
                unitId={masterQuizInfo?.unitId}
                quizType={null}
              />
            )}
            {isFetchingShadowQuizDetail ? (
              <>
                <Skeleton
                  variant='rectangular'
                  animation='wave'
                  width={'100%'}
                />
                <Box mt={2}>
                  <Grid container spacing={0}>
                    <Grid item xs={6}>
                      <Box mr={1.5}>
                        <Skeleton
                          variant='rectangular'
                          animation='wave'
                          height={'61px'}
                          width={'100%'}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box ml={1.5}>
                        <Skeleton
                          variant='rectangular'
                          animation='wave'
                          height={'61px'}
                          width={'100%'}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : (
              this.renderContent(propsForm)
            )}
          </TblDialog>
        )}
      </Formik>
    );
  }
}

EditShadowQuiz.propTypes = {
  courseDayList: PropTypes.array,
  shadowQuizDetail: PropTypes.object,
  shadowQuizInfo: PropTypes.object,
  t: PropTypes.func,
  open: PropTypes.bool,
  onCloseDrawer: PropTypes.func,
  classes: PropTypes.object,
  currentUser: PropTypes.object,
  getCourseDayList: PropTypes.func,
  getShadowQuizDetail: PropTypes.func,
  updateShadowQuiz: PropTypes.func,
  isEditShadowQuizzesSuccess: PropTypes.bool,
  mcUpdateShadowQuizzesSuccess: PropTypes.bool,
  isEditingShadowQuizzes: PropTypes.bool,
  enqueueSnackbar: PropTypes.func,
  errorShadow: PropTypes.object,
  setMyCoursesState: PropTypes.func,
  hasPermission: PropTypes.bool,
  isFetchingShadowQuizDetail: PropTypes.bool,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  shadowId: PropTypes.number,
  sectionId: PropTypes.number,
  getCourseItemByUnit: PropTypes.func,
  editQuizSuccess: PropTypes.bool,
  updateShadowQuizzes: PropTypes.func,
};

EditShadowQuiz.defaultProps = {
  courseDayList: [],
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  courseDayList: state.AllCourses.courseDayList,
  shadowQuizDetail: state.AllCourses.shadowQuizDetail,
  isEditingShadowQuizzes: state.AllCourses.isEditingShadowQuizzes,
  mcUpdateShadowQuizzesSuccess: state.AllCourses.mcUpdateShadowQuizzesSuccess,
  errorShadow: state.AllCourses.errorShadow,
  isFetchingShadowQuizDetail: state.AllCourses.isFetchingShadowQuizDetail,
  editQuizSuccess: state.AllCourses.editQuizSuccess,
});
const mapDispatchToProps = (dispatch) => ({
  setMyCoursesState: (payload) =>
    dispatch(courseActions.myCoursesSetState(payload)),
  getCourseDayList: (payload) =>
    dispatch(courseActions.mcGetCourseDayList(payload)),
  getShadowQuizDetail: (payload) =>
    dispatch(courseActions.mcGetShadowQuizDetail(payload)),
  updateShadowQuiz: (payload) =>
    dispatch(courseActions.mcUpdateShadowQuizzes(payload)),
});

export default compose(
  withTranslation('myCourses', 'common', 'error'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(EditShadowQuiz));
