import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import compose from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import withStyles from '@mui/styles/withStyles';

import TblConfirmDialog from 'components/TblConfirmDialog';
import TblSelect from 'components/TblSelect';
import DialogInformation from 'shared/MyCourses/components/DialogInformation';

import { QUIZ_TYPE } from 'shared/MyCourses/constants';
import CreateEditQuiz from 'shared/MyCourses/containers/CreateEditQuiz';

import loadable from '@loadable/component';
import { Layout1 } from 'layout';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import MyCoursesActions from '../actions';
import ManageUnit from '../components/ManageUnit';
import { getIndexOfTermAndGradingPeriod } from '../utils';

import GradingPeriodList from './GradingPeriodList';

const ManageLesson = loadable(() => import('shared/Lesson/containers/ManageLesson'));

const styles = (theme) => ({
  root: {
    color: theme.palette.primary.main,
  },
  wrapper: {
    '& .MuiTypography-root': {
      height: `calc(100% - ${100}px)`,
    },
  },
  semesterInfo: {
    marginBottom: theme.spacing(3),
    '& .MuiInput-input': {
      fontWeight: theme.fontWeight.semi,
      paddingLeft: 0,
    },
    '& .MuiInput-underline': {
      borderBottom: 'none',
      '&:before': {
        borderBottom: 'none',
      },
      '&:hover:not(.Mui-disabled):before': {
        borderBottom: 'none',
      },

      '& .MuiSelect-icon': {
        paddingLeft: theme.spacing(0.5),
      },
    },
  },
  termInfo: {
    fontSize: theme.fontSize.normal,
    marginBottom: theme.spacing(1),
  },
  divider: {
    width: theme.spacing(10),
    backgroundColor: theme.palette.primary.main,
    height: 2,
  },
});
const headers = {
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
};
const getUnitActivitiesUrl = (orgId, courseId, unitId) =>
  `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}`;
class UnitsAndCourseActivities extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isVisibleCreateEditLesson: false,
      isVisibleManageUnit: false,
      unitInfo: {},
      termSelected: {},
      selectedPeriod: {},
      defaultPeriod: {},
      unit: {},
      lessonInfo: {},
      quizDrawer: false,
      unitId: -1,
      quizType: QUIZ_TYPE.POP,
    };

    this.workers = {};
  }

  componentDidUpdate(prevProps) {
    const {
      t,
      error,
      isCreateNewUnitSuccess,
      termsList,
      isEditUnitSuccess,
      deleteUnitSuccess,
      isDeletingUnit,
      deleteQuizSuccess,
      isDeletingAssignment,
      deleteAssignmentSuccess,
      isDeleteLessonSuccess,
      isDeletingQuiz
    } = this.props;
    const { unitInfo, termSelected, selectedQuiz, selectedAssignment, /*selectedLesson,*/ unitName } = this.state;
    if (prevProps.isFetchingTermsList) {
      const { indexTerm, indexGdp } = getIndexOfTermAndGradingPeriod(termsList) || {};
      const defaultTerm = termsList[indexTerm];
      const defaultPeriod = defaultTerm?.gradingPeriods[indexGdp];
      this.setState({ termSelected: termsList[indexTerm], defaultPeriod });
      this.getUnitsByTerm(termsList[indexTerm]?.id);
    }
    if (prevProps.isCreatingUnit || prevProps.isEditingUnit) {
      if (isEmpty(error)) {
        this.setState({ isVisibleManageUnit: false });
        if (isEmpty(unitInfo)) {
          this.props.enqueueSnackbar(
            t('common:object_created', { objectName: 'Unit' }),
            { variant: 'success' }
          );
        } else {
          this.props.enqueueSnackbar(t('common:change_saved'), {
            variant: 'success',
          });
        }
      }
    }
    if (isCreateNewUnitSuccess || isEditUnitSuccess) {
      if (!!termSelected?.id || !!termsList[0]?.id) {
        this.getUnitsByTerm(termSelected?.id ?? termsList[0]?.id, false);
      }
      this.props.setMyCoursesState(
        isCreateNewUnitSuccess
          ? { isCreateNewUnitSuccess: false }
          : { isEditUnitSuccess: false }
      );
    }
    if (isDeletingQuiz && !isEmpty(selectedQuiz)) {
      if (deleteQuizSuccess) {
        this.props.enqueueSnackbar(t('common:deleted'), { variant: 'success' });
        this.updateUnit(this.props.unitId);
        this.props.setState({ deleteQuizSuccess: false, isDeletingQuiz: false });
        this.setState({ callback: null, confirmMessage: null, selectedQuiz: null, isDeletingQuiz: false });
      }
      if (!isEmpty(error)) {
        // if (error?.subcode === 1) {
        //   this.setState({errorMessage: t('common:cannot_delete_master', {objectName: selectedQuiz.name})});
        // } else {
        this.setState({ errorMessage: error.message });
        // }
        this.setState({ callback: null, confirmMessage: null, selectedQuiz: null });
        this.props.setState({ deleteQuizSuccess: false, error: null, isDeletingQuiz: false });
      }

    }
    if (prevProps.isDeletingLesson) {
      if (isEmpty(error) && isDeleteLessonSuccess) {
        this.props.enqueueSnackbar(t('common:deleted'), { variant: 'success' });
      } else {
        // this.props.enqueueSnackbar(error?.message, { variant: 'error' });
        // if (error?.subcode === 1) {
        //   this.setState({errorMessage: t('common:cannot_delete_master', {objectName: selectedLesson.name})});
        // } else {
        this.setState({ errorMessage: error.message });
        // }
      }
      this.cancelConfirm();
      this.updateUnit(this.props.unitId);
    }
    if (isDeletingAssignment && !isEmpty(selectedAssignment)) {
      if (deleteAssignmentSuccess) {
        this.props.enqueueSnackbar(t('common:deleted'), { variant: 'success' });
        this.updateUnit(this.props.unitId);
        this.props.setState({ deleteAssignmentSuccess: false, isDeletingAssignment: false });
        this.setState({ callback: null, confirmMessage: null, selectedAssignment: null, isDeletingAssignment: false });
      }
      if (!isEmpty(error)) {
        // if (error?.subcode === 1) {
        //   this.setState({errorMessage: t('common:cannot_delete_master', {objectName: selectedAssignment.name})});
        // } else {
        this.setState({ errorMessage: error.message });
        // }
        this.setState({ callback: null, confirmMessage: null, selectedQuiz: null });
        this.props.setState({ deleteAssignmentSuccess: false, error: null, isDeletingAssignment: false });
      }
      // if (isEmpty(error)) {
      //   this.props.enqueueSnackbar(t('common:deleted'), { variant: 'success' });
      // } else {
      //   if (error?.subcode === 1) {
      //     this.setState({errorMessage: t('common:cannot_delete_master', {objectName: selectedAssignment.name})});
      //   } else {
      //     this.setState({errorMessage: error.message});
      //   }
      //   // this.props.enqueueSnackbar(error?.message, { variant: 'error' });
      // }
      // this.cancelConfirm();
      // this.updateUnit(this.props.unitId);
    }
    if (isDeletingUnit && unitName) {
      if (deleteUnitSuccess) {
        this.props.enqueueSnackbar(t('common:deleted'), { variant: 'success' });
        this.setState({ callback: null, confirmMessage: null, unitName: '' });
        this.props.setState({ deleteUnitSuccess: false, isDeletingUnit: false });
      }
      if (!isEmpty(error)) {
        if (error?.subcode === 1 || error?.subcode === 2 || error?.subcode === 3) {
          this.setState({ errorMessage: t('common:cannot_delete_master', { objectName: unitName }) });
        } else {
          this.setState({ errorMessage: error.message });
        }
        this.setState({ callback: null, confirmMessage: null, unitName: '' });
        this.props.setState({ deleteUnitSuccess: false, isDeletingUnit: false });
      }
    }
  }
  componentDidMount() {
    const {
      currentUser: { organizationId, organization },
      courseId,
    } = this.props;
    this.props.getTermsListByCourse({
      orgId: organizationId,
      courseId: courseId,
      urlParams: { attribute: 'term', timezone: organization.timezone },
      termsList: [],
      isFetchingTermsList: true,
    });
    this.props.getAllCourseDays({ orgId: organizationId, courseId });
  }

  getUnitsByTerm = (termId, isEnableFetching = true) => {
    const {
      currentUser: { organizationId, organization },
      courseId,
    } = this.props;
    this.props.getUnitsByTerm({
      orgId: organizationId,
      courseId: courseId,
      urlParams: {
        termIds: termId,
        timezone: organization.timezone,
        groupBy: 'gradingPeriod',
      },
      isFetchingUnitsList: isEnableFetching,
    });
  };

  handleOnChangeSelectTerm = (e, child) => {
    this.setState({ termSelected: child?.props?.originValue });
    this.workers = {};
    this.getUnitsByTerm(child?.props?.value);
  };

  onCreateNewUnit = (unit) => {
    this.setState(
      {
        isVisibleManageUnit: true,
        unitInfo: {},
        selectedPeriod: unit?.gradingPeriod,
      },
      () => {
        this.props.setMyCoursesState({ error: {} });
      }
    );
  };

  onEditUnit = (unit) => {
    this.setState(
      {
        isVisibleManageUnit: true,
        unitInfo: unit,
        selectedPeriod: unit?.gradingPeriod,
      },
      () => {
        this.props.setMyCoursesState({ error: {} });
      }
    );
  };

  onCancel = () => {
    this.setState({ isVisibleManageUnit: false }, () => {
      this.props.setMyCoursesState({ error: {} });
    });
  };

  onCreateNewLesson = (unit) => {
    this.setState({ unit, lessonInfo: {}, isVisibleCreateEditLesson: true });
    if (!isEmpty(this.props.error)) {
      this.props.setMyCoursesState({ error: {} });
    }
  };

  onEditLesson = (lesson) => {
    this.setState({
      unit: lesson?.unitInfo,
      lessonInfo: lesson,
      isVisibleCreateEditLesson: true,
    });
    if (!isEmpty(this.props.error)) {
      this.props.setMyCoursesState({ error: {} });
    }
  };

  onCloseDrawerCreateEditLesson = () => {
    this.setState({ isVisibleCreateEditLesson: false });
  };

  onCreateNewQuiz = (unitId, quizType, quizId) => {
    this.setState({ unitId, quizType, quizId, quizDrawer: true });
  };

  onDeleteQuiz = (unitId, item) => {
    const {
      t,
      currentUser: { organizationId },
      courseId,
    } = this.props;
    const confirmMessage = t('common:delete_master_object', {
      objectName: item.name,
    });
    const callback = () => {
      this.props.deleteQuiz({
        orgId: organizationId,
        courseId,
        unitId,
        deleteQuizSuccess: false,
        quizId: item.id,
        isDeletingQuiz: true
      });
    };
    this.setState({ confirmMessage, callback, selectedQuiz: item });
  };

  onDeleteAssignment = (unitId, item) => {
    const {
      t,
      currentUser: { organizationId },
      courseId,
    } = this.props;
    const confirmMessage = t('common:delete_master_object', {
      objectName: item.name,
    });
    const callback = () => {
      this.props.deleteAssignment({
        orgId: organizationId,
        courseId,
        unitId,
        deleteAssignmentSuccess: false,
        assignmentId: item.id,
        isDeletingAssignment: true
      });
    };
    this.setState({ confirmMessage, callback, selectedAssignment: item });
  };

  onDeleteUnit = (unitId, unitName) => {
    const {
      t,
      currentUser: { organizationId, timezone },
      courseId,
      termsList
    } = this.props;
    const confirmMessage = t('common:delete_master_object', {
      objectName: unitName,
    });
    const { termSelected } = this.state;
    const callback = () => {
      this.props.deleteUnit({
        orgId: organizationId,
        courseId,
        unitId,
        deleteUnitSuccess: false,
        timezone,
        termId: termSelected?.id ?? termsList[0]?.id,
        isDeletingUnit: true,
      });
    };
    this.setState({ confirmMessage, callback, unitName });
  };
  cancelConfirm = () => {
    this.setState({ confirmMessage: null, callback: null, isDeletingQuiz: false, selectedQuiz: null });
  };

  onConfirmed = () => {
    const { callback } = this.state;
    callback();
  };

  onDeleteLesson = (lesson) => {
    const {
      t,
      currentUser: { organizationId },
      courseId,
    } = this.props;
    const confirmMessage = t('delete_master_object', {
      objectName: lesson.name,
    });
    const callback = () => {
      this.props.deleteLesson({
        orgId: organizationId,
        courseId,
        unitId: lesson?.unitInfo?.id,
        lessonId: lesson?.id,
        isDeletingLesson: true,
        error: {},
      });
    };
    this.setState({ confirmMessage, callback, selectedLesson: lesson });
  };

  handleDeleteLesson = () => {
    const {
      currentUser: { organizationId },
      courseId,
    } = this.props;
    const { unit, lesson } = this.state;
    this.props.deleteLesson({
      orgId: organizationId,
      courseId,
      unitId: unit?.id,
      lessonId: lesson?.id,
      isDeletingLesson: true,
      error: {},
    });
  };

  handleSubmitUnit = (values) => {
    const { unitInfo, selectedPeriod } = this.state;
    const {
      currentUser: { organizationId },
    } = this.props;
    const { courseId } = this.props;
    const payload = {
      orgId: organizationId,
      courseId,
      unitId: unitInfo?.id,
      unit: Object.assign(values, { gradingPeriodId: selectedPeriod?.id, unitName: trim(values.unitName) }),
      error: {},
    };
    if (!isEmpty(unitInfo)) {
      this.props.editUnit(Object.assign(payload, { isEditingUnit: true }));
    } else {
      this.props.createNewUnit(Object.assign(payload, { isCreatingUnit: true }));
    }
  };

  updateUnit = (unitId) => {
    const {
      currentUser: { organizationId },
      courseId,
    } = this.props;
    this.workers[`unit-${unitId}`].postMessage({
      uid: unitId,
      headers,
      action: getUnitActivitiesUrl(organizationId, courseId, unitId),
    });
  };

  formatDate = (day) => moment(day).format('MMM DD, YYYY');

  onCloseQuiz = () => {
    const { unitId } = this.state;
    this.updateUnit(unitId);
    this.setState({ quizDrawer: false });
  };

  onCloseError = () => {
    this.setState({ errorMessage: null });
    this.props.setState({ deleteUnitSuccess: false, isDeletingUnit: false, error: {} });
  }

  updateAllUnit = () => {
    const { gradingPeriodList } = this.props;
    const units = gradingPeriodList.map((period) => period.units);
    units.forEach((unit) => {
      this.updateUnit(unit.id);
    });
    // this.updateUnit()
  }

  render() {
    const {
      t,
      termsList,
      isFetchingTermsList,
      classes,
      gradingPeriodList,
      isCreatingUnit,
      error,
      courseId,
      currentUser: { organizationId },
      isEditingUnit,
    } = this.props;
    const {
      isVisibleManageUnit,
      unitInfo,
      termSelected,
      unitId,
      quizDrawer,
      quizType,
      lessonInfo,
      unit,
      isVisibleCreateEditLesson,
      quizId,
      confirmMessage,
      errorMessage,
      defaultPeriod
    } = this.state;

    if (!!isFetchingTermsList || !termsList) {
      return (
        <Layout1>
          <Box mb={2}>
            <Skeleton variant='rectangular' animation='wave' width={300} height={50} />
          </Box>
          <Skeleton
            variant='rectangular'
            animation='wave'
            width={'100%'}
            height={250}
          />
        </Layout1>
      );
    }

    return (
      <Layout1 className={classes.wrapper}>
        {isVisibleManageUnit && (
          <ManageUnit
            t={t}
            open={isVisibleManageUnit}
            unitInfo={unitInfo}
            onCancel={this.onCancel}
            onSubmit={this.handleSubmitUnit}
            isSubmitting={isCreatingUnit || isEditingUnit}
            error={error}
          />
        )}
        <TblConfirmDialog
          cancelText={t('common:cancel')}
          okText={t('common:delete_all')}
          open={!!confirmMessage}
          onConfirmed={this.onConfirmed}
          message={confirmMessage}
          onCancel={this.cancelConfirm}
          title={t('common:warning')}
        />
        <TblConfirmDialog
          cancelText={t('common:ok')}
          hiddenConfirmButton={true}
          open={!!errorMessage}
          message={errorMessage}
          onCancel={this.onCloseError}
          title={t('common:error')}
        />
        <ManageLesson
          isVisible={isVisibleCreateEditLesson}
          lessonInfo={lessonInfo}
          courseId={courseId}
          unit={unit}
          onCloseDrawer={this.onCloseDrawerCreateEditLesson}
          updateUnit={this.updateUnit}
        />
          <CreateEditQuiz
            orgId={organizationId}
            onClose={this.onCloseQuiz}
            isVisible={quizDrawer}
            quizId={quizId}
            courseId={courseId}
            unitId={unitId}
            quizType={quizType}
          />

        <DialogInformation/>

        <Box className={classes.semesterInfo}>
          <TblSelect
            small
            value={Number(termSelected?.id) || 0}
            onChange={this.handleOnChangeSelectTerm}

          >
            {termsList?.map((term, index) => (
              <MenuItem
                key={`menu-item-${index}`}
                originValue={term}
                value={Number(term.id)}
              >
                {term.termName}
              </MenuItem>
            ))}
          </TblSelect>
          <Box className={classes.termInfo}>
            {!isEmpty(termSelected) ? (
              <span>
                {this.formatDate(termSelected?.firstDay)} -{' '}
                {this.formatDate(termSelected?.lastDay)}
              </span>
            ) : (
              <span>
                {this.formatDate(termsList[0]?.firstDay)} -{' '}
                {this.formatDate(termsList[0]?.lastDay)}
              </span>
            )}
          </Box>
          {/* <Divider className={classes.divider} /> */}
        </Box>
        <GradingPeriodList
          orgId={organizationId}
          courseId={courseId}
          onCreateUnit={this.onCreateNewUnit}
          formatDate={this.formatDate}
          gradingPeriodList={gradingPeriodList}
          t={t}
          onEditUnit={this.onEditUnit}
          onCreateQuiz={this.onCreateNewQuiz}
          onCreateLesson={this.onCreateNewLesson}
          onEditLesson={this.onEditLesson}
          Workers={this.workers}
          onRemoveUnit={this.onDeleteUnit}
          onRemoveQuiz={this.onDeleteQuiz}
          onDeleteLesson={this.onDeleteLesson}
          onRemoveAssignment={this.onDeleteAssignment}
          updateUnit={this.updateUnit}
          termId={termSelected?.id}
          defaultPeriodId={defaultPeriod?.id}
        />
      </Layout1>
    );
  }
}

UnitsAndCourseActivities.propTypes = {
  classes: PropTypes.object,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  createNewUnit: PropTypes.func,
  currentUser: PropTypes.object,
  deleteAssignment: PropTypes.func,
  deleteAssignmentSuccess: PropTypes.bool,
  deleteLesson: PropTypes.func,
  deleteQuiz: PropTypes.func,
  deleteQuizSuccess: PropTypes.bool,
  deleteUnit: PropTypes.func,
  deleteUnitSuccess: PropTypes.bool,
  editUnit: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  error: PropTypes.object,
  getAllCourseDays: PropTypes.func,
  getGradingPeriodByTerm: PropTypes.func,
  getTermsListByCourse: PropTypes.func,
  getUnitsByTerm: PropTypes.func,
  getUnitsListByTerm: PropTypes.func,
  gradingPeriodList: PropTypes.array,
  isCreateNewLessonSuccess: PropTypes.bool,
  isCreateNewUnitSuccess: PropTypes.bool,
  isCreatingUnit: PropTypes.bool,
  isDeleteLessonSuccess: PropTypes.bool,
  isDeletingAssignment: PropTypes.bool,
  isDeletingLesson: PropTypes.func,
  isDeletingQuiz: PropTypes.bool,
  isDeletingUnit: PropTypes.bool,
  isEditUnitSuccess: PropTypes.bool,
  isEditingUnit: PropTypes.bool,
  isFetchingTermsList: PropTypes.bool,
  setMyCoursesState: PropTypes.func,
  setState: PropTypes.func,
  t: PropTypes.func,
  termsList: PropTypes.array,
  unitId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

UnitsAndCourseActivities.defaultProps = {
  classes: {},
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  termsList: state.AllCourses.termsListByCourse,
  isFetchingTermsList: state.AllCourses.isFetchingTermsList,
  isCreatingUnit: state.AllCourses.isCreatingUnit,
  error: state.AllCourses.error,
  isCreateNewUnitSuccess: state.AllCourses.isCreateNewUnitSuccess,
  gradingPeriodList: state.AllCourses.gradingPeriodList,
  isEditingUnit: state.AllCourses.isEditingUnit,
  isEditUnitSuccess: state.AllCourses.isEditUnitSuccess,
  isDeleteLessonSuccess: state.AllCourses.isDeleteLessonSuccess,
  deleteUnitSuccess: state.AllCourses.deleteUnitSuccess,
  isDeletingLesson: state.AllCourses.isDeletingLesson,
  isDeletingUnit: state.AllCourses.isDeletingUnit,
  isDeletingQuiz: state.AllCourses.isDeletingQuiz,
  isDeletingAssignment: state.AllCourses.isDeletingAssignment,
  isCreateNewLessonSuccess: state.AllCourses.isCreateNewLessonSuccess,
  deleteQuizSuccess: state.AllCourses.deleteQuizSuccess,
  deleteAssignmentSuccess: state.AllCourses.deleteAssignmentSuccess,
  unitId: state.AllCourses.unitId,
});
const mapDispatchToProps = (dispatch) => ({
  createNewUnit: (payload) => dispatch(MyCoursesActions.createNewUnit(payload)),
  editUnit: (payload) => dispatch(MyCoursesActions.editUnit(payload)),
  setMyCoursesState: (payload) =>
    dispatch(MyCoursesActions.myCoursesSetState(payload)),
  getTermsListByCourse: (payload) =>
    dispatch(MyCoursesActions.getTermsListByCourse(payload)),
  getUnitsByTerm: (payload) =>
    dispatch(MyCoursesActions.getUnitsByTerm(payload)),
  getAllCourseDays: (payload) => dispatch(MyCoursesActions.getAllCourseDays(payload)),
  deleteLesson: (payload) => dispatch(MyCoursesActions.deleteLesson(payload)),
  deleteQuiz: (payload) => dispatch(MyCoursesActions.mcDeleteQuiz(payload)),
  deleteAssignment: (payload) =>
    dispatch(MyCoursesActions.deleteAssignment(payload)),
  deleteUnit: (payload) => dispatch(MyCoursesActions.deleteUnit(payload)),
  setState: (payload) => dispatch(MyCoursesActions.myCoursesSetState(payload)),
});
const UnitsAndCourseActivitiesWithStyle = withStyles(styles)(
  UnitsAndCourseActivities
);
export default compose(
  withTranslation(['myCourses', 'common', 'error']),
  connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(UnitsAndCourseActivitiesWithStyle));
