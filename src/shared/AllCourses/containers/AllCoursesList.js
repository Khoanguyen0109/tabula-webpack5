import React from 'react';
import { connect } from 'react-redux';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import trim from 'lodash/trim';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import withStyles from '@mui/styles/withStyles';

import TblTable from 'components/TblTable';

import { COURSE_STATUS } from 'shared/MyCourses/constants';

import { ROUTE_SCHOOL_YEAR } from 'modules/SchoolYear/constantsRoute';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import { bindActionCreators } from 'redux';

import allCoursesActions from '../actions';
import EmptyCourse from '../components/EmptyCourse';
import { ROUTE_ALL_COURSES } from '../constantsRoute';

const styles = (theme) => ({
  status: {
    textTransform: 'capitalize',
    borderRadius: theme.spacing(1),
    minWidth: '80px',
    height: '24px',
    margin: 'auto',
  },
  draft: {
    background: theme.mainColors.orange[0],
    color: theme.newColors.gray[50],
  },
  published: {
    background: theme.mainColors.primary2[0],
    color: theme.newColors.gray[50],
  },
  archived: {
    background: theme.mainColors.gray[2],
  },
  waiting: {
    background: theme.mainColors.red[0],
    color: theme.newColors.gray[50],
    textTransform: 'none',
  },
});

const MINUS_HEIGHT_OF_SPACE_UPPER = 285;
class AllCoursesList extends React.PureComponent {
  state = {
    params: {
      sort: 'desc',
      page: 1,
      limit: 50,
      search: '',
    },
  };

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    if (!isNil(props?.search) && !isEqual(props.search, state.params.search)) {
      Object.assign(state.params, { search: props.search, page: 1 });
      props.allCoursesActions.getAllCoursesList({
        id: props.currentUser.organizationId,
        urlParams: Object.assign(state.params, {
          timezone: props.currentUser.timezone,
        }),
      });
    }
    return !isEmpty(newState) ? newState : null;
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser?.organizationId) {
      this.getAllCoursesList();
    }
  }
  componentDidUpdate(prevProps) {
    const {
      currentUser,
      currentUser: { timezone },
      schoolYearId,
      status,
    } = this.props;
    const { params } = this.state;

    if (schoolYearId !== 0) {
      Object.assign(params, { schoolYear: schoolYearId });
    } else {
      delete params.schoolYear;
    }
    if (status !== 0) {
      Object.assign(params, { status });
    } else {
      delete params.status;
    }
    if (
      this.props.schoolYearId !== prevProps.schoolYearId ||
      this.props.status !== prevProps.status
    ) {
      this.props.allCoursesActions.getAllCoursesList({
        id: currentUser.organizationId,
        urlParams: Object.assign(params, { timezone }),
        isBusy: true,
      });
    }
  }

  getAllCoursesList = () => {
    const {
      currentUser,
      currentUser: { timezone },
    } = this.props;
    const { params } = this.state;
    this.props.allCoursesActions.getAllCoursesList({
      id: currentUser.organizationId,
      urlParams: Object.assign(params, { timezone }),
      isBusy: true,
    });
  };

  onSort = () => {
    const {
      params,
      params: { sort },
    } = this.state;
    this.setState(
      Object.assign(params, { sort: sort === 'asc' ? 'desc' : 'asc' }),
      () => this.getAllCoursesList()
    );
  };

  onChangePage = (e, page, limit) => {
    const { params } = this.state;
    params.page = page + 1;
    if (limit) {
      params.limit = limit;
      params.page = 1;
    }
    this.setState({ params }, () => {
      this.getAllCoursesList();
    });
  };

  emptyDataClick = () => {
    const emptySchoolYear = this.props.schoolYearList.length === 0;
    if (emptySchoolYear) {
      this.props.history.push(ROUTE_SCHOOL_YEAR.DEFAULT);
    } else {
      this.props.toggleCreateCourseDialog();
    }
  };

  render() {
    const { search, schoolYearId, status, schoolYearList } = this.props;
    const { t, classes, allCoursesList, isBusy, total, history } = this.props;
    const {
      params,
      params: { limit },
    } = this.state;
    const renderContextMenu = (record, handleCloseMoreMenu, t) => {
      const enableDelete = record.status === COURSE_STATUS.DRAFT;
      const isPublised = record.status === COURSE_STATUS.PUBLISHED;
      return (
        <>
          <MenuItem
            onClick={() =>
              history.push(ROUTE_ALL_COURSES.ALL_COURSES_DETAIL(record.id))
            }
          >
            {t('common:view_details')}
          </MenuItem>
          {enableDelete && (
            <MenuItem
              onClick={() => {
                this.props.onOpenConfirm(record.id);
                handleCloseMoreMenu();
              }}
            >
              {t('common:delete')}
            </MenuItem>
          )}
          {isPublised && (
            <MenuItem
              onClick={() => {
                this.props.onOpenSaveAsTemplateDialog(record);
                handleCloseMoreMenu();
              }}
            >
              {t('common:save_as_coure_template')}
            </MenuItem>
          )}
        </>
      );
    };

    const columns = [
      {
        title: t('common:name'),
        dataIndex: 'courseName',
        key: 'courseName',
        render: (text) => (
          <div className='text-ellipsis'>{trim(text)}</div>
        ),
      },
      {
        title: t('created_date'),
        titleIcon:
          params.sort !== 'asc'
            ? 'icon-icn_sort_arrow_down'
            : 'icon-icn_sort_arrow_up',
        dataIndex: 'createdAt',
        key: 'createdAt',
        titleIconAction: this.onSort,
        render: (text) => (
          <div className='text-ellipsis'>
            {moment(text).format('MMM DD, YYYY')}
          </div>
        ),
      },
      {
        title: t('subject'),
        dataIndex: 'subject',
        key: 'subject',
        render: (text, record) => (
            <div className='text-ellipsis'>
              {record?.subject?.subjectName || ''}
            </div>
          ),
      },
      {
        title: t('school_year'),
        dataIndex: 'schoolYear',
        key: 'schoolYear',
        render: (text, record) => (
            <div className='text-ellipsis'>
              {record?.schoolYear?.name || ''}
            </div>
          ),
      },
      {
        title: t('common:status'),
        key: 'status',
        dataIndex: 'status',
        align: 'center',
        render: (text, record) => {
          let status;
          switch (record.status) {
            case -1:
              status = 'draft';
              break;
            case 1:
              status = 'published';
              break;
            case 2:
              status = 'archived';
              break;
            case 0:
              status = 'waiting';
              break;
            default:
              break;
          }
          return (
            <Chip
              label={status === 'waiting' ? 'Waiting for Teacher' : status}
              className={`${classes.status} ${classes[status]}`}
            />
          );
        },
      },
      {
        key: 'action',
        align: 'right',
        contextMenu: (record, handleCloseMoreMenu) =>
          renderContextMenu(record, handleCloseMoreMenu, t),
      },
    ];

    const emptyData =
      !search && !schoolYearId && !status && allCoursesList.length === 0;
    const emptySchoolYear = schoolYearList.length === 0;
    const emptySearch = !!search || !!schoolYearId || !!status;
    return (
      <Box mt={2}>
        <TblTable
          columns={columns}
          rows={allCoursesList}
          pagination
          isBusy={isBusy}
          onChangePage={this.onChangePage}
          rowsPerPage={limit}
          total={total}
          viewDetail={(row) =>
            this.props.history.push(
              ROUTE_ALL_COURSES.ALL_COURSES_DETAIL(row.id)
            )
          }
          delta={MINUS_HEIGHT_OF_SPACE_UPPER}
          scrollInline={true}
          emptySearch={emptySearch}
          emptyContent={
            (emptySchoolYear || emptyData) && (
              <EmptyCourse
                emptySchoolYear={emptySchoolYear}
                emptyDataClick={this.emptyDataClick}
              />
            )
          }
        />
      </Box>
    );
  }
}

AllCoursesList.propTypes = {
  allCoursesActions: PropTypes.object,
  allCoursesList: PropTypes.array,
  classes: PropTypes.object,
  currentUser: PropTypes.object,
  history: PropTypes.object,
  isBusy: PropTypes.bool,
  onOpenConfirm: PropTypes.func,
  schoolYearActions: PropTypes.object,
  schoolYearId: PropTypes.number,
  schoolYearList: PropTypes.array,
  search: PropTypes.string,
  status: PropTypes.number,
  subjectActions: PropTypes.object,
  subjectsList: PropTypes.array,
  t: PropTypes.func,
  termsList: PropTypes.array,
  toggleCreateCourseDialog: PropTypes.func,
  total: PropTypes.number,
  onOpenSaveAsTemplateDialog: PropTypes.func,
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  allCoursesList: state.AllCourses.allCoursesList,
  isBusy: state.AllCourses.isBusy,
  total: state.AllCourses.total,
});

const mapDispatchToProps = (dispatch) => ({
  allCoursesActions: bindActionCreators(allCoursesActions, dispatch),
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(AllCoursesList)
);
