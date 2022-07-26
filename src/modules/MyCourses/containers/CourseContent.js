import React from 'react';
import { withTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import Box from '@mui/material/Box';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import EmptyContent from 'components/EmptyContent';
import TblActivityIcon from 'components/TblActivityIcon';
import ErrorPage from 'components/TblErrorPage';
import TblSelect from 'components/TblSelect';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import loadable from '@loadable/component';
import emptyImage from 'assets/images/undraw_empty_street.svg';
import { Layout2 } from 'layout';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { setUrlParam } from 'utils';

import Worker from '../../../workers/course.content.worker.js';
import myCourseActions from '../actions';
import ActivitiesList from '../components/CourseContent/ActivitiesList';
import StudentViewAssignment from '../components/CourseContent/StudentViewAssignment';

const ViewLessonDetails = loadable(() =>
  import('../components/CourseContent/ViewLessonDetails')
);
const ViewQuizDetails = loadable(() =>
  import('../components/CourseContent/ViewQuizDetails')
);

const styles = (theme) => ({
  root: {
    '& .MuiSelect-root': {
      height: 'auto',
    },
    '& .MuiMenuItem-root': {
      '.hidden': {
        display: 'none',
      },
    },
  },
  hidden: {
    display: 'none',
  },
  weekTitle: {
    color: theme.palette.primary.main,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
  },
  weekSubTitle: {
    color: theme.palette.primary.main,
    fontSize: theme.fontSize.normal,
  },
});

class CourseContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      weekActive: null,
      termName: null,
      idActive: null,
      sectionId: null,
      sectionSchedulesIdSelected: null,
      courseContent: {},
      courseActivitiesContent: {},
      selectedItem: {},
      activityDetails: {},
    };
    this.worker = new Worker(new URL('../../../workers/course.content.worker.js', import.meta.url));
    this.worker.onmessage = (e) => {
      const payload = e.data;
      const cloneCourseActivitiesContent = cloneDeep(
        this.state.courseActivitiesContent
      );
      cloneCourseActivitiesContent[payload.sectionSchedulesId] = payload.data;
      this.setState({
        courseActivitiesContent: { ...cloneCourseActivitiesContent },
      });
    };
    this.unListen = this.props.history.listen((location) => {
      const urlSearchParams = new URLSearchParams(location.search);
      let idParam = urlSearchParams?.get('id');
      let weekParam = urlSearchParams?.get('week');
      const sectionId = urlSearchParams?.get('sectionId');
      if (!!idParam && !!weekParam) {
        this.setState(
          {
            idActive: idParam,
            sectionId,
            weekActive: weekParam,
            selectedItem: {},
          },
          () => {
            const [type, id] = idParam.split('-');
            this.getActivityDetails(type, id);
          }
        );
      }
    });
    this.emptyContent = (
      <EmptyContent
        title={
          <Typography variant='headingSmall' color='primary'>
            {props.t('myCourses:course_contents')}
          </Typography>
        }
        emptyImage={emptyImage}
        subTitle={props.t('myCourses:select_an_activity_to_view_the_details')}
        className='style1'
      />
    );
  }
  static getDerivedStateFromProps(props, state) {
    let newState = {};
    if (
      !isEmpty(props.courseContent) &&
      !isEqual(props.courseContent.content, state.courseContent)
    ) {
      Object.assign(newState, { courseContent: props.courseContent?.content });
    }
    if (!isEqual(props.activityDetails, state.activityDetails)) {
      Object.assign(newState, { activityDetails: props.activityDetails });
    }
    return !isEmpty(newState) ? newState : null;
  }

  componentDidMount() {
    this.getCourseContent();
  }

  componentWillUnmount() {
    this.props.myCoursesSetState({
      activityDetails: {},
    });
    this.unListen();
  }

  componentDidUpdate(prevProps) {
    const { location, history } = this.props;
    if (
      this.props.mcGetCourseContentSuccess &&
      this.props.mcGetCourseContentSuccess !==
        prevProps.mcGetCourseContentSuccess
    ) {
      let weekActive = this.getWeekSelected();
      setUrlParam(location, history, { week: weekActive }, 'replace');
      this.setState({ weekActive, termName: this.getTermName(weekActive) });
      this.props.myCoursesSetState({ mcGetCourseContentSuccess: false });
    }
  }

  getWeekSelected = () => {
    const {
      location,
      courseContent: { listTerms },
    } = this.props;
    const { courseContent } = this.state;
    const urlSearchParams = new URLSearchParams(location.search);
    let week = urlSearchParams?.get('week');
    let weeks = [];
    let currentWeek = '';
    Object.keys(courseContent).forEach((termKey) => {
      Object.keys(courseContent[termKey]).forEach((weekKey) => {
        weeks.push(weekKey);
        if (courseContent[termKey][weekKey][0]?.isCurrent) {
          currentWeek = `${weekKey}_${listTerms[termKey]}`;
        }
      });
    });
    if (!!!currentWeek && !isEmpty(courseContent)) {
      const firstTermName = Object.keys(courseContent)[0];
      const firstDayInFirstTerm = Object.keys(courseContent[firstTermName])[0];
      currentWeek = `${firstDayInFirstTerm}_${listTerms[firstTermName]}`;
    }
    return !!!week ||
      (!!week &&
        !!week.split('_')[2] &&
        !weeks.includes(`${week.split('_')[0]}`))
      ? currentWeek
      : week;
  };

  getCourseContent = () => {
    const { courseId, orgId, timezone } = this.props;
    const { studentId } = this.props.match.params;
    this.props.getCourseContent({
      orgId,
      courseId,
      urlParams: { timezone, studentId },
    });
  };

  getCourseActivityBySectionSchedule = (sectionSchedulesId) => {
    const { courseId, orgId, timezone } = this.props;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    };
    const payload = {
      headers,
      method: 'GET',
      action: `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/all-items/${sectionSchedulesId}?timezone=${timezone}`,
      sectionSchedulesId,
    };
    this.worker.postMessage({
      payload,
    });
  };

  getActivityDetails = (type, id) => {
    const { sectionId } = this.state;
    if (!!!id && !!!sectionId) {
      return;
    }
    if (Number(type) === COURSE_ITEM_TYPE.LESSON) {
      this.getLessonDetails(id, sectionId);
    } else if (Number(type) === COURSE_ITEM_TYPE.QUIZ) {
      this.getQuizDetails(id, sectionId);
    } else {
      this.getAssignmentDetails(id, sectionId);
    }
  };

  getLessonDetails = (id, sectionId) => {
    const { courseId, orgId, timezone } = this.props;
    this.props.getLessonDetails({
      orgId,
      courseId,
      shadowId: id,
      urlParams: { timezone, sectionId },
      isFetchingLessonDetails: true,
    });
  };

  getQuizDetails = (id, sectionId) => {
    const { courseId, orgId, timezone, studentId } = this.props;
    this.props.getQuizDetails({
      orgId,
      courseId,
      shadowId: id,
      urlParams: { timezone, studentId, sectionId },
      isFetchingQuizDetails: true,
    });
  };

  getAssignmentDetails = (id, sectionId) => {
    const { courseId, orgId, timezone, studentId } = this.props;
    this.props.studentGetShadowAssignment({
      orgId,
      courseId,
      shadowId: id,
      urlParams: { sectionId, studentId, timezone },
    });
  };

  renderListClassSection = (data) => {
    const { t } = this.props;
    if (!!!data) {
      return <></>;
    }
    const week = data?.split('_')[0];
    const { courseContent, courseActivitiesContent, /*termName ,*/ idActive } =
      this.state;
    const termName = this.getTermName(data);
    return !isEmpty(termName) && courseContent[termName]?.[week]?.length ? (
      courseContent[termName][week].map((item, index) => (
        <ActivitiesList
          key={index}
          data={item}
          activitiesList={
            courseActivitiesContent[item.sectionSchedulesId] || []
          }
          handleClickItem={this.handleClickItem}
          activeId={idActive}
          fetchData={this.getCourseActivityBySectionSchedule}
        />
      ))
    ) : (
      <Box pl={1}>
        <Typography variant='bodyMedium' className='emptyText'>
          {t('common:empty')}
        </Typography>
      </Box>
    );
  };

  handleClickItem = (item) => {
    const { location, history } = this.props;
    const { weekActive, selectedItem } = this.state;
    if (!isEqual(selectedItem, item)) {
      const { itemType, id, quizType, sectionId } = item;
      let idKey = `${itemType}-${id}`;
      if (quizType) {
        idKey = `${idKey}-${quizType}`;
      }
      setUrlParam(location, history, {
        week: weekActive,
        id: idKey,
        sectionId,
      });
      this.setState({ selectedItem: { ...item } });
    }
  };

  onChangeWeek = (e) => {
    const { value } = e.target;
    const termName = this.getTermName(value);
    if (!!!value) {
      return;
    }
    this.setState({ weekActive: value, termName });
  };

  getTermName = (value) => {
    const { listTerms } = this.props.courseContent;
    const weekKey = value?.split('_') || [];
    const week = weekKey[0];
    const termId = weekKey[1];
    const { courseContent } = this.state;
    let termName = '';
    Object.keys(courseContent).forEach((termKey) => {
      Object.keys(courseContent[termKey]).forEach((dateKey) => {
        if (dateKey === week && Number(termId) === listTerms[termKey]) {
          termName = termKey;
        }
      });
    });
    return termName;
  };

  renderContent = () => {
    const { t, isFetchingLessonDetails, isFetchingQuizDetails } = this.props;
    const {
      courseContent,
      weekActive,
      termName,
      activityDetails,
      idActive,
      sectionId,
    } = this.state;
    const [type, id] = idActive?.split('-') || [];
    if (
      isEmpty(courseContent) ||
      isEmpty(activityDetails) ||
      !!!weekActive ||
      !!!termName ||
      !!!type ||
      !!!id
    ) {
      return this.emptyContent;
    }
    switch (Number(type)) {
      case COURSE_ITEM_TYPE.LESSON:
        return (
          <ViewLessonDetails
            t={t}
            sectionId={sectionId}
            lessonDetails={activityDetails}
            isFetching={isFetchingLessonDetails}
          />
        );
      case COURSE_ITEM_TYPE.ASSIGNMENT:
        return (
          <StudentViewAssignment
            shadowId={id}
            sectionId={sectionId}
            getAssignmentDetails={(id, sectionId) =>
              this.getAssignmentDetails(id, sectionId)
            }
          />
        );
      case COURSE_ITEM_TYPE.QUIZ:
        return (
          <ViewQuizDetails
            t={t}
            sectionId={sectionId}
            details={activityDetails}
            isFetching={isFetchingQuizDetails}
          />
        );
      default:
        return <></>;
    }
  };

  render() {
    const { classes, errorCode } = this.props;
    const { courseContent, weekActive, activityDetails, idActive } = this.state;
    const [type, , quizType] = idActive?.split('-') || [];
    if (isEmpty(this.props.courseContent) || isEmpty(courseContent)) {
      return <></>;
    }
    return (
      <div className={classes.root}>
        <Layout2>
          <div>
            <Box mb={2}>
              <TblSelect
                label={<span>Week</span>}
                value={weekActive}
                onChange={this.onChangeWeek}
              >
                {Object.keys(courseContent).map((termKey) => [
                  <ListSubheader color='primary' disableSticky>
                    {termKey}
                  </ListSubheader>,
                  Object.keys(courseContent[termKey])?.map(
                    (weekKey, weekIndex) => {
                      if (courseContent[termKey][weekKey].length === 0) {
                        // eslint-disable-next-line array-callback-return
                        return;
                      }
                      const info = courseContent[termKey][weekKey][0];
                      const { listTerms } = this.props.courseContent;
                      return (
                        <MenuItem value={`${weekKey}_${listTerms[termKey]}`}>
                          <Box display='flex' flexDirection='column'>
                            <Box flexGrow={1} className={classes.weekTitle}>
                              Week {weekIndex + 1}{' '}
                              <span className='hidden'>- {info.termName}</span>{' '}
                              {info.isCurrent ? '(Current)' : ''}
                            </Box>
                            <Box flexGrow={1} className={classes.weekSubTitle}>
                              {moment(info.startweek).format('MMM DD, YYYY')} -{' '}
                              {moment(info.endweek).format('MMM DD, YYYY')}
                            </Box>
                          </Box>
                        </MenuItem>
                      );
                    }
                  ),
                ])}
              </TblSelect>
            </Box>

            <PerfectScrollbar>
              <Box height='calc(100vh - 320px)'>
                {this.renderListClassSection(weekActive)}
              </Box>
            </PerfectScrollbar>
          </div>
          {!isEmpty(activityDetails) ? (
            <div
              title={
                activityDetails.name && (
                  <TblActivityIcon
                    name={activityDetails.name}
                    type={type}
                    quizType={quizType}
                  />
                )
              }
            >
              <Box pl={1}>{this.renderContent()}</Box>
            </div>
          ) : !!errorCode ? (
            <div>
              <ErrorPage errorCode={errorCode} />
            </div>
          ) : (
            <div>{this.emptyContent}</div>
          )}
        </Layout2>
      </div>
    );
  }
}

CourseContent.propTypes = {
  activityDetails: PropTypes.object,
  classes: PropTypes.object,
  courseContent: PropTypes.object,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errorCode: PropTypes.number,
  getCourseContent: PropTypes.func,
  getLessonDetails: PropTypes.func,
  getQuizDetails: PropTypes.func,
  history: PropTypes.object,
  isFetchingLessonDetails: PropTypes.bool,
  isFetchingQuizDetails: PropTypes.bool,
  location: PropTypes.object,
  match: PropTypes.object,
  mcGetCourseContentSuccess: PropTypes.bool,
  myCoursesSetState: PropTypes.func,
  orgId: PropTypes.number,
  studentGetShadowAssignment: PropTypes.func,
  studentId: PropTypes.number,
  t: PropTypes.func,
  timezone: PropTypes.string,
};

CourseContent.defaultProps = {};

const mapStateToProps = (state) => ({
  courseContent: state.AllCourses.courseContent,
  permission: state.AllCourses.permission,
  activityDetails: state.AllCourses.activityDetails,
  mcGetCourseContentSuccess: state.AllCourses.mcGetCourseContentSuccess,
  isFetchingLessonDetails: state.AllCourses.isFetchingLessonDetails,
  isFetchingQuizDetails: state.AllCourses.isFetchingQuizDetails,
  errorCode: state.AllCourses.errorCode,
});

const mapDispatchToProps = (dispatch) => ({
  getCourseContent: (payload) =>
    dispatch(myCourseActions.mcGetCourseContent(payload)),
  getLessonDetails: (payload) =>
    dispatch(myCourseActions.mcGetLessonDetails(payload)),
  getQuizDetails: (payload) =>
    dispatch(myCourseActions.mcGetQuizDetails(payload)),
  studentGetShadowAssignment: (payload) =>
    dispatch(myCourseActions.studentGetShadowAssignment(payload)),
  myCoursesSetState: (payload) =>
    dispatch(myCourseActions.myCoursesSetState(payload)),
});

const CourseContentStyled = withStyles(styles)(CourseContent);
export default flowRight(
  withSnackbar,
  withTranslation(['allCourses', 'myCourses', 'common']),
  connect(mapStateToProps, mapDispatchToProps)
)(CourseContentStyled);
