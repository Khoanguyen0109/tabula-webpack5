import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';

import EmptyContent from 'components/EmptyContent';
import TblActivityIcon from 'components/TblActivityIcon';
import TblCustomScrollbar from 'components/TblCustomScrollbar';
import TblInputLabel from 'components/TblInputLabel';
import TblSelect from 'components/TblSelect';

import emptyImage from 'assets/images/empty-illus.svg';
import { Layout2 } from 'layout';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { setUrlParam } from 'utils';

import myCourseActions from '../actions';
import AssignmentDetail from '../components/StudentSubmission/AssignmentDetail';
import ActivityItem from '../shared/ActivityItem';

const styles = (theme) => ({
  root: {
    '& .MuiTableCell-body': {
      padding: theme.spacing(1),
    },
  },
  filterBtn: {
    cursor: 'pointer',
    position: 'relative',
    '& .MuiSvgIcon-root': {
      position: 'absolute',
      top: theme.spacing(-1.5),
      right: theme.spacing(1),
    },
  },
});

class StudentSubmissions extends PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    t: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    theme: PropTypes.object,
    unitList: PropTypes.array,
    assignmentItem: PropTypes.object,
    orgId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    timezone: PropTypes.string,
    getUnitByCourse: PropTypes.func,
    getAssignmentByUnit: PropTypes.func,
    assignmentStudentSubmission: PropTypes.object,
    getAssignmentStudentSubmission: PropTypes.func,
    myCoursesSetState: PropTypes.func,
    mcGetUnitByCourseSuccess: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      unitSelected: '',
      idSelected: '',
      sectionSelected: '-1',
      studentSubmissionDetails: {},
      search: '',
      openMenu: false,
      filters: {},
      open: false,
      selectedItem: {},
      urlQuery: {},
      graderInfo: {},
    };
    this.unListen = this.props.history.listen((location) => {
      const urlSearchParams = new URLSearchParams(location.search);
      let unitId = urlSearchParams?.get('unitId');
      let id = urlSearchParams?.get('id');
      if (!!unitId && !!id) {
        this.setState({ unitSelected: unitId, idSelected: id }, () => {
          this.getAssignmentStudentSubmission(unitId, id);
        });
      }
    });
  }

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    if (
      !isEmpty(props.assignmentStudentSubmission) &&
      !isEqual(
        state.studentSubmissionDetails,
        props.assignmentStudentSubmission
      )
    ) {
      Object.assign(newState, {
        studentSubmissionDetails: { ...props.assignmentStudentSubmission },
      });
    }
    return !isEmpty(newState) ? newState : null;
  }

  componentDidMount() {
    this.getUnitByCourse();
    const { location } = this.props;
    const urlSearchParams = new URLSearchParams(location.search);
    let unitId = urlSearchParams?.get('unitId');
    let id = urlSearchParams?.get('id');
    if (!!unitId && !!id) {
      this.setState({ unitSelected: unitId, idSelected: id }, () => {
        this.getAssignmentStudentSubmission(unitId, id);
        this.getAssignmentByUnit();
      });
    }
  }
  componentWillUnmount() {
    this.props.myCoursesSetState({
      unitList: [],
      assignmentStudentSubmission: {},
    });
    this.unListen();
  }

  componentDidUpdate() {
    const { location, mcGetUnitByCourseSuccess, unitList } = this.props;
    if (mcGetUnitByCourseSuccess) {
      const urlSearchParams = new URLSearchParams(location.search);
      let unitId = urlSearchParams?.get('unitId');
      if (!!!unitId && !isEmpty(unitList)) {
        this.setState({ unitSelected: unitList[0].id }, () => {
          this.getAssignmentByUnit();
        });
      }
      this.props.myCoursesSetState({ mcGetUnitByCourseSuccess: false });
    }
  }

  getUnitByCourse = () => {
    const { orgId, courseId } = this.props;
    this.props.getUnitByCourse({
      orgId,
      courseId,
    });
  };

  getAssignmentByUnit = () => {
    const { orgId, courseId } = this.props;
    const { unitSelected } = this.state;
    this.props.getAssignmentByUnit({
      orgId,
      courseId,
      unitId: unitSelected,
      urlParams: { type: 'assignments' },
    });
  };

  getAssignmentStudentSubmission = (unitId, assignmentId, params = {}) => {
    const { orgId, courseId, timezone } = this.props;
    const urlParams = Object.assign(params, { timezone });
    this.props.getAssignmentStudentSubmission({
      orgId,
      courseId,
      unitId,
      assignmentId,
      urlParams,
    });
  };

  handleChange = (value) => {
    const { history, location } = this.props;

    this.setState({ unitSelected: value }, () => {
      this.getAssignmentByUnit();
      /** Update URL when change unit */
      setUrlParam(location, history, { unitId: value, id: null });
    });
  };

  getData = debounce((params) => {
    const { unitSelected, idSelected, urlQuery } = this.state;
    const newUrlQuery = Object.assign(urlQuery, params);
    this.setState({ urlQuery: newUrlQuery }, () => {
      this.getAssignmentStudentSubmission(
        unitSelected,
        idSelected,
        newUrlQuery
      );
    });
  }, 100);

  onOpenGrader = (event, schedule) => {
    this.setState({ open: true, graderInfo: schedule });
  };

  onCloseGrader = () => {
    this.setState({ open: false });
  };

  handleClickItem = (item) => {
    const { history, location } = this.props;
    const { unitSelected, selectedItem } = this.state;
    if (!isEqual(selectedItem, item)) {
      const { id } = item;
      setUrlParam(location, history, { unitId: unitSelected, id: id });
      this.setState({ selectedItem: { ...item }, urlQuery: {} });
      this.props.myCoursesSetState({ studentSubmissionDetails: {} });
    }
  };

  render() {
    const { location, classes, t, unitList, assignmentItem } = this.props;
    const { idSelected, unitSelected, studentSubmissionDetails } = this.state;
    const {
      data: studentList,
      sectionData: sectionList,
      assignmentName,
    } = studentSubmissionDetails;
    const urlSearchParams = new URLSearchParams(location.search);
    let unitId = urlSearchParams?.get('unitId');
    let id = urlSearchParams?.get('id');
    return (
      <div className={classes.root}>
        {/* <Grader open={open} onClose={this.onCloseGrader} graderInfo={graderInfo} courseId={courseId} studentList={studentList}/> */}
        <Layout2>
          <div>
            <Box mb={2}>
              <TblSelect
                label={t('myCourses:unit_name')}
                value={Number(unitSelected)}
                onChange={(e) => {
                  this.handleChange(e.target.value);
                }}
              >
                {unitList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.unitName}
                  </MenuItem>
                ))}
              </TblSelect>
            </Box>
            <TblCustomScrollbar maxHeightScroll={'calc(100vh - 200px)'}>
              {!isEmpty(assignmentItem) && !isEmpty(assignmentItem.items) && (
                <div>
                  {Object.keys(assignmentItem.items).map((key) => {
                    const list = assignmentItem.items[key];
                    if (isEmpty(list)) {
                      return <></>;
                    }
                    return (
                      <div key={key}>
                        <TblInputLabel>{key}</TblInputLabel>
                        {list.map((item, index) => {
                          const activity = { ...item };
                          activity.itemType = 1;
                          return (
                            <ActivityItem
                              key={index}
                              activity={{ ...activity }}
                              activeId={`1-${idSelected}`}
                              handleClickItem={this.handleClickItem}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </TblCustomScrollbar>
          </div>
          {(!!!unitId && !!!id) || id === 'null' ? ( // add id === null to show empty page when change unit
            <div>
              <EmptyContent
                title={t('myCourses:student_submissions')}
                emptyImage={emptyImage}
                subTitle={t(
                  'myCourses:select_an_activity_to_view_your_student_submission_list'
                )}
                className='style1'
              />
            </div>
          ) : (
            <div
              title={
                assignmentName && (
                  <TblActivityIcon name={assignmentName} type={1} />
                )
              }
            >
              {isEmpty(studentSubmissionDetails) ? (
                <Box>
                  <Box mb={3}>
                    <Skeleton
                      variant='rectangular'
                      animation='wave'
                      width={'100%'}
                      height={'24px'}
                    />
                  </Box>
                  <Box mb={1}>
                    <Skeleton
                      variant='rectangular'
                      animation='wave'
                      width={'10%'}
                      height={'20px'}
                    />
                  </Box>
                  <Box mb={3}>
                    <Skeleton
                      variant='rectangular'
                      animation='wave'
                      width={'50%'}
                      height={'44px'}
                    />
                  </Box>
                  <Skeleton
                    variant='rectangular'
                    animation='wave'
                    width={'100%'}
                    height={'61px'}
                  />
                </Box>
              ) : (
                <div>
                  <AssignmentDetail
                    t={t}
                    unitSelected={unitSelected}
                    sectionList={sectionList}
                    studentList={studentList}
                    getData={this.getData}
                    onOpenGrader={this.onOpenGrader}
                    id={idSelected}
                  />
                </div>
              )}
            </div>
          )}
        </Layout2>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  unitList: state.AllCourses.unitList,
  mcGetUnitByCourseSuccess: state.AllCourses.mcGetUnitByCourseSuccess,
  assignmentItem: state.AllCourses.activitiesByUnit,
  assignmentStudentSubmission: state.AllCourses.assignmentStudentSubmission,
});

const mapDispatchToProps = (dispatch) => ({
  getUnitByCourse: (payload) =>
    dispatch(myCourseActions.mcGetUnitByCourse(payload)),
  getAssignmentByUnit: (payload) =>
    dispatch(myCourseActions.mcGetActivitiesByUnit(payload)),
  getAssignmentStudentSubmission: (payload) =>
    dispatch(myCourseActions.mcGetAssignmentStudentSubmission(payload)),
  myCoursesSetState: (payload) =>
    dispatch(myCourseActions.myCoursesSetState(payload)),
});

const StudentSubmissionsStyled = withTheme(
  withStyles(styles)(StudentSubmissions)
);
export default flowRight(
  withSnackbar,
  withTranslation(['allCourses', 'myCourses', 'common']),
  connect(mapStateToProps, mapDispatchToProps)
)(StudentSubmissionsStyled);
