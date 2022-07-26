import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import find from 'lodash/find';
import flattenDeep from 'lodash/flattenDeep';
import compose from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import withStyles from '@mui/styles/withStyles';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblSelect from 'components/TblSelect';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import { Field, Form, Formik } from 'formik';
import courseActions from 'modules/MyCourses/actions';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

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

class MasterQuizAnnouncedTimeDialog extends React.PureComponent {
  state = {
    fetchingQuizInfo: true,
    isBusy: false,
  };

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    if (
      props.currentQuiz &&
      !isEmpty(props.currentQuiz) &&
      state.fetchingQuizInfo
    ) {
      newState.fetchingQuizInfo = false;
    }
    if (props.error && !isEmpty(props.error) && state.isBusy) {
      newState.isBusy = false;
    }
    if (isEmpty(newState)) {
      return null;
    }
    return newState;
  }

  componentDidUpdate(prevProps) {
    const { error, t, isInMasterQuizAnnouncedTime } = this.props;
    if (this.props.isVisible && this.props.isVisible !== prevProps.isVisible) {
      this.getAllCourseDays();
      this.getQuizDetail();
    }
    if (
      !isEmpty(error) &&
      error?.subcode === 1 &&
      this.formikRef &&
      isInMasterQuizAnnouncedTime
    ) {
      this.formikRef.setFieldError(
        'announceDateId',
        t('error:error_first_less_equal_last', {
          first: t('announced_on'),
          last: t('taken_on'),
        })
      );
    }
    if (
      !prevProps.editQuizSuccess &&
      this.props.editQuizSuccess &&
      this.props.isVisible
    ) {
      const { currentQuiz } = this.props;
      this.props.updateMasterItem(
        currentQuiz?.executeDateId,
        'none',
        currentQuiz?.unitId,
        { quizId: currentQuiz?.id },
        0
      );
      this.props.enqueueSnackbar(t('common:change_saved'), {
        variant: 'success',
      });
      this.onCloseDialog();
    }
  }

  getAllCourseDays = () => {
    const {
      currentUser: { organizationId },
      courseId,
    } = this.props;
    this.props.getAllCourseDays({ orgId: organizationId, courseId });
  };

  getQuizDetail = () => {
    const {
      currentUser: { organizationId },
      courseId,
      unitId,
      quizId,
    } = this.props;
    if (
      !isNil(organizationId) &&
      !isNil(courseId) &&
      !isNil(unitId) &&
      !isNil(quizId)
    ) {
      this.props.getQuiz({
        organizationId,
        courseId,
        unitId,
        quizId,
        currentQuiz: {},
      });
    }
  };

  getInitialValues = () => {
    const { currentQuiz } = this.props;
    let initialValues = {
      executeDateId: '',
      announceDateId: '',
    };
    if (!isEmpty(currentQuiz)) {
      Object.assign(initialValues, {
        executeDateId: currentQuiz?.executeDateId,
        announceDateId: currentQuiz?.announceDateId,
      });
    }
    return { ...initialValues };
  };

  getValidationFields = () => {
    const { t } = this.props;
    return {
      announceDateId: Yup.string()
        .nullable()
        .required(t('common:required_message')),
    };
  };

  onCloseDialog = () => {
    this.props.setState({ currentQuiz: {}, error: {} });
    this.setState({ isBusy: false, fetchingQuizInfo: true }, () => {
      this.props.onCloseDialog();
    });
  };

  render() {
    const {
      isVisible,
      classes,
      t,
      courseDays,
      currentQuiz,
      masterQuizInfo,
      currentUser: { organizationId },
      courseId,
      unitId,
      quizId,
      error,
    } = this.props;
    const { fetchingQuizInfo, isBusy } = this.state;
    let executeDateObject = {};
    const allCourseDays = flattenDeep(
      courseDays?.map((semester) => semester?.dates)
    );
    if (!isEmpty(currentQuiz)) {
      executeDateObject = find(
        allCourseDays,
        (courseDay) => courseDay?.id === currentQuiz?.executeDateId
      );
    }

    const validationSchema = Yup.object().shape(this.getValidationFields());

    if (!isVisible) {
      return null;
    }

    return (
      <Formik
        innerRef={(node) => (this.formikRef = node)}
        initialValues={this.getInitialValues()}
        enableReinitialize={true}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={false}
        onSubmit={(values) => {
          const payload = { ...values };
          delete payload.executeDateId;
          this.setState({ isBusy: true }, () => {
            this.props.editQuiz({
              orgId: organizationId,
              unitId,
              quizId,
              courseId,
              quiz: { ...payload },
              editQuizSuccess: false,
              isInMasterQuizAnnouncedTime: true,
              error: {},
            });
          });
        }}
      >
        {({ errors, touched, handleSubmit, submitCount }) => (
          <TblDialog
            open={isVisible}
            fullWidth={true}
            onClose={this.onCloseDialog}
            title={
              <Box display='flex' alignItems='center'>
                {/* <PlaylistAddCheckRoundedIcon className={classes.iconCourseItem} /> */}
                <TblActivityIcon
                  type={COURSE_ITEM_TYPE.QUIZ}
                  className={classes.icon}
                />
                <Box ml={1} width={'98%'} lineHeight={'30px'}>
                  <div className={`text-ellipsis ${classes.title}`}>
                    {isEmpty(masterQuizInfo)
                      ? t('common:quiz')
                      : masterQuizInfo?.name}
                  </div>
                </Box>
              </Box>
            }
            footer={
              <>
                <TblButton
                  variant='outlined'
                  size='medium'
                  color='primary'
                  onClick={this.onCloseDialog}
                >
                  {t('common:cancel')}
                </TblButton>
                <TblButton
                  size='medium'
                  variant='contained'
                  color='primary'
                  onClick={handleSubmit}
                  type='submit'
                  disabled={isBusy}
                  isShowCircularProgress={isBusy}
                >
                  {t('common:save')}
                </TblButton>
              </>
            }
          >
            {!isEmpty(error) && error?.subcode !== 1 && (
              <Box mb={2}>
                <Alert severity='error'>{error?.message}</Alert>
              </Box>
            )}
            {fetchingQuizInfo ? (
              <Grid container>
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
            ) : (
              <Form>
                <Grid container>
                  <Grid item xs={6}>
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
                      >
                        {courseDays.map((item) => [
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
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box ml={1.5}>
                      <Field
                        name='executeDateId'
                        label={t('taken_on')}
                        as={TblSelect}
                        required
                        renderValue={() => executeDateObject?.courseDayName}
                        disabled={true}
                      >
                        <MenuItem
                          value={executeDateObject?.id}
                          key={executeDateObject?.id}
                        >
                          {executeDateObject?.courseDayName}
                        </MenuItem>
                      </Field>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </TblDialog>
        )}
      </Formik>
    );
  }
}

MasterQuizAnnouncedTimeDialog.propTypes = {
  currentUser: PropTypes.object,
  courseDays: PropTypes.array,
  error: PropTypes.object,
  currentQuiz: PropTypes.object,
  classes: PropTypes.object,
  editQuizSuccess: PropTypes.bool,
  isVisible: PropTypes.bool,
  onCloseDialog: PropTypes.func,
  editQuiz: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  t: PropTypes.func,
  getAllCourseDays: PropTypes.func,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unitId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  quizId: PropTypes.number,
  getQuiz: PropTypes.func,
  masterQuizInfo: PropTypes.object,
  setState: PropTypes.func,
  updateMasterItem: PropTypes.func,
  isInMasterQuizAnnouncedTime: PropTypes.bool,
};

MasterQuizAnnouncedTimeDialog.defaultProps = {
  courseDays: [],
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  courseDays: state.AllCourses.courseDays,
  error: state.AllCourses.error,
  currentQuiz: state.AllCourses.currentQuiz,
  editQuizSuccess: state.AllCourses.editQuizSuccess,
  isInMasterQuizAnnouncedTime: state.AllCourses.isInMasterQuizAnnouncedTime,
});
const mapDispatchToProps = (dispatch) => ({
  setState: (payload) => dispatch(courseActions.myCoursesSetState(payload)),
  setMyCoursesState: (payload) =>
    dispatch(courseActions.myCoursesSetState(payload)),
  getAllCourseDays: (payload) =>
    dispatch(courseActions.getAllCourseDays(payload)),
  getQuiz: (payload) => dispatch(courseActions.mcGetQuiz(payload)),
  editQuiz: (payload) => dispatch(courseActions.mcEditQuiz(payload)),
});

export default compose(
  withTranslation('myCourses', 'common', 'error'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(MasterQuizAnnouncedTimeDialog));
