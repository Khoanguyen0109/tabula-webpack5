import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import compose from 'lodash/flowRight';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

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
import TblSelect from 'components/TblSelect';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import courseActions from 'modules/MyCourses/actions';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import { LESSON_STATUS } from '../../constants';

const styles = (theme) => ({
  editIcon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    fontSize: theme.spacing(3),
    cursor: 'pointer',
    color: theme.mainColors.primary2[0]
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
  disabled: {
    cursor: 'default',
    color: theme.mainColors.gray[6],
    '&:hover': {
      textDecoration: 'none',
      color: theme.mainColors.gray[6],
      cursor: 'default',
    },
  }
});

class EditShadowLesson extends React.PureComponent {
  state = {
    isUpdatedMasterItem: false
  }

  componentDidUpdate(prevProps) {
    const { t, errorShadow, mcUpdateShadowLessonSuccess, isEditLessonSuccess } = this.props;
    if (this.props.open && this.props.open !== prevProps.open) {
      this.getCourseDayList();
      this.getShadowLessonDetail();
      this.setState({ isUpdatedMasterItem: false });
    }
    if (prevProps.isEditingShadowLesson) {
      if (isEmpty(errorShadow) && mcUpdateShadowLessonSuccess) {
        this.props.enqueueSnackbar(t('common:change_saved'), {
          variant: 'success',
        });
        this.onCloseDrawer();
      } else {
        if ([1, 2, 3].includes(errorShadow?.subcode)) {
          if (this.formikRef) {
            this.formikRef.setFieldError(
              'status',
              t('error:missing_required_field_in_master_item')
            );
          }
        }
      }
    }
    if (mcUpdateShadowLessonSuccess) {
      this.props.setMyCoursesState({ mcUpdateShadowLessonSuccess: false });
    }
    if (isEditLessonSuccess && this.props.open) {
      const { shadowLessonDetail, getCourseItemByUnit } = this.props;
      this.getShadowLessonDetail();
      this.setState({ isUpdatedMasterItem: true });
      if (getCourseItemByUnit && shadowLessonDetail?.masterLesson?.unitId) {
        getCourseItemByUnit();
      }
    }
  }

  onOpenEditMasterLesson = () => {
    const { shadowLessonDetail, hasPermission, setIsVisibleMasterLesson, setMasterLessonInfo } = this.props;
    if (hasPermission) {
      setIsVisibleMasterLesson(true);
      setMasterLessonInfo(Object.assign(shadowLessonDetail?.masterLesson, {
        name: shadowLessonDetail?.masterLesson?.lessonName,
      }));
      this.props.setMyCoursesState({ errorShadow: {} });
      if (this.formikRef && !!this.formikRef?.errors?.status) {
        this.formikRef.setFieldError('status', null);
      }
    }
  };

  onCloseDrawer = () => {
    const { shadowLessonDetail, onCloseDrawer, setMyCoursesState } = this.props;
    if (this.state.isUpdatedMasterItem) {
      /**
       *NOTE: Update current column which contains lesson
       *Reference: https://communicate.atlassian.net/browse/TL-3041
       */
      setMyCoursesState({ queueUpdate: { [shadowLessonDetail?.sectionSchedule?.courseDayId]: true } });
    }
    if (onCloseDrawer) {
      onCloseDrawer();
    }
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

  getShadowLessonDetail = () => {
    const {
      currentUser: { organizationId },
      courseId,
      shadowId,
    } = this.props;
    this.props.getShadowLessonDetail({
      orgId: organizationId,
      courseId,
      shadowId,
      errorShadow: {},
      isFetchingShadowLessonDetail: true,
      shadowLessonDetail: {}
    });
  };

  getInitialValues = () => {
    const { shadowLessonDetail } = this.props;
    let initialValues = {
      sectionScheduleId: '', status: LESSON_STATUS.DRAFT,
    };
    if (!isEmpty(shadowLessonDetail)) {
      initialValues = {
        sectionScheduleId: shadowLessonDetail?.sectionSchedule?.id,
        status: shadowLessonDetail?.status,
      };
    }

    return { ...initialValues };
  };

  render() {
    const {
      t,
      open,
      // onCloseDrawer,
      classes,
      courseDayList,
      isEditingShadowLesson,
      errorShadow,
      shadowLessonDetail,
      shadowId,
      courseId,
      isFetchingShadowLessonDetail,
      shadowLessonInfo,
      hasPermission
    } = this.props;
    const statusArray = [
      { value: LESSON_STATUS.DRAFT, text: t('common:draft') },
      { value: LESSON_STATUS.PUBLIC, text: t('common:published') },
    ];
    return (
      <Formik
        innerRef={(node) => (this.formikRef = node)}
        initialValues={this.getInitialValues()}
        enableReinitialize={true}
        onSubmit={(values) => {
          const {
            courseDayList,
            currentUser: { organizationId },
          } = this.props;
          const activity = Object.assign(values, {
            sectionScheduleId: Number(values.sectionScheduleId),
          });
          const newCourseDayList = [];
          forEach(courseDayList, (item) => {
            forEach(item?.dates, (element) => {
              newCourseDayList.push(element);
            });
          });
          const courseDayObject = newCourseDayList.find(
            (item) => item?.id === values.sectionScheduleId.toString()
          );
          const payload = {
            orgId: organizationId,
            courseId,
            shadowId,
            activity,
            isEditingShadowLesson: true,
            isInModal: true,
            courseDayId: courseDayObject?.courseDayId,
            sourceId: shadowLessonDetail?.sectionSchedule?.courseDayId,
            errorShadow: {}
          };
          this.props.editShadowLesson(payload);
        }}
      >
        {({ errors, touched, handleSubmit, submitCount }) => (
          <TblDialog
            fullWidth={true}
            onClose={this.onCloseDrawer}
            title={
              <Box display='flex' alignItems='center'>
                {/* <ImportContactsIcon className={classes.iconCourseItem} /> */}
                <TblActivityIcon type={COURSE_ITEM_TYPE.LESSON} className={classes.iconCourseItem} />
                <Box ml={1} width={'98%'}>
                  <div className={`text-ellipsis ${classes.title}`}>
                    {isEmpty(shadowLessonInfo)
                      ? t('common:lesson')
                      : shadowLessonDetail?.masterLesson?.lessonName ?? shadowLessonInfo?.name}
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
                {hasPermission &&
                  <TblButton
                    size='medium'
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                    type='submit'
                    disabled={isEditingShadowLesson}
                    isShowCircularProgress={isEditingShadowLesson}
                  >
                    {t('common:save')}
                  </TblButton>}
              </>
            }
          >
            {!isEmpty(errorShadow) &&
              ![1, 2, 3].includes(errorShadow?.subcode) && (
                <Box mb={2}>
                  <Alert severity='error'>{errorShadow?.message}</Alert>
                </Box>
              )}
            {/* <CreateEditLesson
              isVisible={isVisibleEditMasterLesson}
              lessonInfo={lessonInfo}
              onCloseDrawer={this.onCloseEditMasterLesson}
              courseId={shadowLessonDetail?.masterLesson?.courseId}
              unit={{ id: shadowLessonDetail?.masterLesson?.unitId }}
            /> */}
            {isFetchingShadowLessonDetail ? (
              <>
                <Skeleton variant='rectangular' animation='wave' width={'100%'} />
                <Box mt={2}>
                  <Grid container spacing={0}>
                    <Grid item xs={6}>
                      <Box mr={1.5}>
                        <Skeleton
                          variant='rectangular'
                          animation='wave'
                          width={'100%'}
                          height={'61px'}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box ml={1.5}>
                        <Skeleton
                          variant='rectangular'
                          animation='wave'
                          width={'100%'}
                          height={'61px'}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : (
                <Form>
                  <Box ml={1}>
                    <Typography
                      component='div'
                      variant='bodyMedium'
                      color='primary'
                    >
                      {shadowLessonDetail?.sectionSchedule?.section?.sectionName}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Grid container spacing={0}>
                      <Grid item xs={6}>
                        <Box mr={1.5}>
                          <Field
                            name='sectionScheduleId'
                            label={t('course_day', { count: 1 })}
                            as={TblSelect}
                            required
                            disabled={!hasPermission}
                          >
                            {
                              courseDayList.map((item) => [
                                <ClickAwayListener mouseEvent={false}>
                                  <ListSubheader color='primary' disableSticky>
                                    {item?.termName}
                                  </ListSubheader>
                                </ClickAwayListener>,
                                item?.dates.map((element) => (
                                  <MenuItem value={element.id} key={element.id}>{element.courseDayName}</MenuItem>
                                ))]
                              )
                            }
                          </Field>
                          <Box
                            mt={2}
                            display='flex'
                            alignItems='center'
                          >
                            <div className={`${classes.editIcon} ${clsx({ [classes.disabled]: !hasPermission })}`} onClick={this.onOpenEditMasterLesson}>
                              <EditIcon color='inherit' fontSize='inherit' />
                            </div>
                            <Box ml={1}>
                              <div className={`${classes.editActivityDetails} ${clsx({ [classes.disabled]: !hasPermission })}`} onClick={this.onOpenEditMasterLesson}>
                                <Typography
                                  component='div'
                                  variant='bodyMedium'
                                  color='inherit'
                                >
                                  {t('edit_master_details')}
                                </Typography>
                              </div>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box ml={1.5}>
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
                            {statusArray.map((item) => (
                              <MenuItem value={item.value} key={item.value}>
                                {item.text}
                              </MenuItem>
                            ))}
                          </Field>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Form>
              )}
          </TblDialog>
        )}
      </Formik>
    );
  }
}

EditShadowLesson.propTypes = {
  classes: PropTypes.object,
  t: PropTypes.func,
  open: PropTypes.bool,
  onCloseDrawer: PropTypes.func,
  courseDayList: PropTypes.array,
  currentUser: PropTypes.object,
  courseId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  sectionId: PropTypes.number,
  shadowId: PropTypes.number,
  editShadowLesson: PropTypes.func,
  shadowLessonDetail: PropTypes.object,
  getCourseDayList: PropTypes.func,
  isEditingShadowLesson: PropTypes.bool,
  getShadowLessonDetail: PropTypes.func,
  errorShadow: PropTypes.object,
  setMyCoursesState: PropTypes.func,
  mcUpdateShadowLessonSuccess: PropTypes.bool,
  enqueueSnackbar: PropTypes.func,
  isFetchingShadowLessonDetail: PropTypes.bool,
  shadowLessonInfo: PropTypes.object,
  hasPermission: PropTypes.bool,
  isEditLessonSuccess: PropTypes.bool,
  getCourseItemByUnit: PropTypes.func,
  setIsVisibleMasterLesson: PropTypes.func,
  setMasterLessonInfo: PropTypes.func
};

EditShadowLesson.defaultProps = {
  courseDayList: [],
  shadowLessonDetail: null,
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  courseDayList: state.AllCourses.courseDayList,
  shadowLessonDetail: state.AllCourses.shadowLessonDetail,
  isEditingShadowLesson: state.AllCourses.isEditingShadowLesson,
  mcUpdateShadowLessonSuccess: state.AllCourses.mcUpdateShadowLessonSuccess,
  errorShadow: state.AllCourses.errorShadow,
  isFetchingShadowLessonDetail: state.AllCourses.isFetchingShadowLessonDetail,
  isEditLessonSuccess: state.AllCourses.isEditLessonSuccess,
});
const mapDispatchToProps = (dispatch) => ({
  setMyCoursesState: (payload) =>
    dispatch(courseActions.myCoursesSetState(payload)),
  getCourseDayList: (payload) =>
    dispatch(courseActions.mcGetCourseDayList(payload)),
  getShadowLessonDetail: (payload) =>
    dispatch(courseActions.mcGetShadowLessonDetail(payload)),
  editShadowLesson: (payload) =>
    dispatch(courseActions.mcUpdateShadowLesson(payload)),
});

export default compose(
  withTranslation('myCourses', 'common', 'error'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(EditShadowLesson));
