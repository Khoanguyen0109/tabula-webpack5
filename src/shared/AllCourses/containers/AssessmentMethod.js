import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import TblIndicator from 'components/TblIndicator';
import TblSelect from 'components/TblSelect';
import TblTable from 'components/TblTable';
import TblUseSnackbar from 'components/TblUseSnackbar';

import { COURSE_MANAGER } from 'utils/roles';

import { COURSE_STATUS } from 'shared/MyCourses/constants';

import assessmentMethodActions from 'modules/AssessmentMethod/actions';
import PropTypes from 'prop-types';
import { checkPermission } from 'utils';

import allCourseActions from '../actions';
import { getAssessmentMethodDetails } from '../utils';

const ROLES_UPDATE = [COURSE_MANAGER];
class AssessmentMethod extends React.PureComponent {
  state = {
    rows: [],
    assessmentMethod: null,
  };

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    if (
      !isUndefined(props?.assessmentMethod) ||
      !props.assessmentMethod ||
      !isEqual(props.assessmentMethod, state.assessmentMethod)
    ) {
      const rows = getAssessmentMethodDetails(
        props.assessmentMethodList,
        props?.assessmentMethod?.id
      );
      Object.assign(newState, {
        assessmentMethod: props.assessmentMethod,
        rows,
      });
    }
    return !isEmpty(newState) ? newState : null;
  }

  componentDidMount() {
    const orgId = this.props.currentUser.organizationId;
    const courseId = this.props.match.params.courseId;
    this.props.getAssessmentMethodList({
      orgId,
    });
    this.props.getAssessmentMethodInCourse({
      orgId,
      courseId,
      assessmentMethod: null,
    });
  }

  componentDidUpdate() {
    if (this.props.isUpdateAssessmentMethodInCourseSuccess) {
      const orgId = this.props.currentUser.organizationId;
      const courseId = this.props.location.pathname.split('/')[2];
      this.props.getAssessmentMethodInCourse({
        orgId,
        courseId,
        isUpdateAssessmentMethodInCourseSuccess: false,
      });
    }
  }

  onChangeAssessmentMethod = (e) => {
    const { assessmentMethodList } = this.props;
    const orgId = this.props.currentUser.organizationId;
    const courseId = this.props.location.pathname.split('/')[2];
    const assessmentMethodId = e.target.value;
    const rows = getAssessmentMethodDetails(
      assessmentMethodList,
      assessmentMethodId
    );
    if (!isEmpty(rows)) {
      this.setState({ rows }, () => {
        this.props.updateAssessmentMethodInCourse({
          orgId,
          courseId,
          data: { assessmentMethodId },
        });
      });
    }
  };
  componentWillUnmount() {
    this.props.resetAllCourseReducer({
      isGetAssessmentMethodInCourseSuccess: false,
    });
  }

  render() {
    const {
      t,
      assessmentMethodList,
      isUpdateAssessmentMethodInCourseSuccess,
      currentUser,
      basicInfo,
    } = this.props;
    const { rows, assessmentMethod } = this.state;
    const hasPermission = checkPermission(currentUser, ROLES_UPDATE);
    const hasPermissionUpdate =
      hasPermission && basicInfo.status === COURSE_STATUS.DRAFT;

    const columns = [
      {
        title: t('common:name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('first_range'),
        dataIndex: 'rangeFrom',
        key: 'rangeFrom',
      },
      {
        title: t('second_range'),
        dataIndex: 'rangeTo',
        key: 'rangeTo',
      },
    ];
    const selectObject = document.getElementById('select-field');
    const selectWidth = !isNull(selectObject) ? selectObject.offsetWidth : 0;

    return (
      <Grid containers>
        {isUpdateAssessmentMethodInCourseSuccess && <TblUseSnackbar />}
        {!!hasPermission && <Box mb={1.5}><TblIndicator content={t('unable_to_update_AM')} /></Box>}
        <Grid item xs={8}>
          <TblSelect
            required
            disabled={!hasPermissionUpdate}
            label={t('common:name')}
            onChange={this.onChangeAssessmentMethod}
            value={assessmentMethod?.id ?? ''}
            id='select-field'
            // error={!assessmentMethod && this.props.isGetAssessmentMethodInCourseSuccess}
          >
            {assessmentMethodList.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <Box width={selectWidth - 45} className='text-ellipsis'>
                  {item.methodName}
                </Box>
              </MenuItem>
            ))}
          </TblSelect>
        </Grid>
        <Grid item xs={12}>
          <Box mt={2}>
            <TblTable
              tableLabel={t('grade_scale_details')}
              columns={columns}
              rows={rows}
              noSideBorder={false}
            />
          </Box>
        </Grid>
      </Grid>
    );
  }
}

AssessmentMethod.propTypes = {
  currentUser: PropTypes.object,
  match: PropTypes.object,
  getAssessmentMethodList: PropTypes.func,
  t: PropTypes.func,
  assessmentMethodList: PropTypes.array,
  getAssessmentMethodInCourse: PropTypes.func,
  location: PropTypes.object,
  updateAssessmentMethodInCourse: PropTypes.func,
  resetAllCourseReducer: PropTypes.func,
  assessmentMethod: PropTypes.object,
  isUpdateAssessmentMethodInCourseSuccess: PropTypes.bool,
  isGetAssessmentMethodInCourseSuccess: PropTypes.bool,
  basicInfo: PropTypes.object,
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  assessmentMethodList: state.AssessmentMethod.assessmentMethodList,
  isGetAssessmentMethodInCourseSuccess:
    state.AllCourses.isGetAssessmentMethodInCourseSuccess,
  assessmentMethod: state.AllCourses.assessmentMethod,
  isUpdateAssessmentMethodInCourseSuccess:
    state.AllCourses.isUpdateAssessmentMethodInCourseSuccess,
  basicInfo: state.AllCourses.basicInfo,
});

const mapDispatchToProps = (dispatch) => ({
  getAssessmentMethodList: (payload) =>
    dispatch(assessmentMethodActions.getAssessmentMethodList(payload)),
  getAssessmentMethodInCourse: (payload) =>
    dispatch(allCourseActions.getAssessmentMethodInCourse(payload)),
  updateAssessmentMethodInCourse: (payload) =>
    dispatch(allCourseActions.updateAssessmentMethodInCourse(payload)),
  resetAllCourseReducer: (payload) =>
    dispatch(allCourseActions.resetAllCourseReducer(payload)),
});

export default withTranslation(['assessmentMethod', 'common'])(
  connect(mapStateToProps, mapDispatchToProps)(AssessmentMethod)
);
