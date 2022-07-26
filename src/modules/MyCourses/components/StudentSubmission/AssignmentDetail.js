import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import debounce from 'lodash/debounce';
import snakeCase from 'lodash/snakeCase';
import trim from 'lodash/trim';

import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';

import TblButton from 'components/TblButton';
import TblCheckbox from 'components/TblCheckBox';
import TblIconButton from 'components/TblIconButton';
import TblSelect from 'components/TblSelect';
import UserInfoCard from 'components/TblSidebar/UserInfoCard';
import TblTable from 'components/TblTable';
import SortByName from 'shared/AllCourses/components/SortByName';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';

import { ROUTE_GRADER } from 'modules/Grader/routeConstant';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

// import { expandStatus as TblStatus } from 'components/TblStatus';

import { checkPermission } from '../../../../utils';
import { ROLE_CAN_GRADER } from '../../../Grader/constants';
import {
  STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST,
  STUDENT_PROGRESS_STATUS,
} from '../../constants';
import { getStatusStudentProgressFilter, initFilterStatus } from '../../utils';

import ReleaseList from './ReleaseList';

const useStyles = makeStyles((theme) => ({
  selectSection: {
    '& .MuiOutlinedInput-root': {
      width: theme.spacing(30),
      height: theme.spacing(5),
    },
  },
  filterBtn: {
    backgroundColor: theme.newColors.gray[50],
  },
  btn: {
    height: theme.spacing(4.5),
    minWidth: theme.spacing(17),
  },
  overallGradeColumn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    // maxWidth: 'fit-content',
    // minWidth: '25%',
    // paddingLeft: '20%'
  },
  mgR9: {
    marginRight: '9px',
  },
  fz17: {
    fontSize: '17px',
  },
}));

const sortParams = { sort: 'asc', sortField: 'section' };
function AssignmentDetail(props) {
  // const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const { courseId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const {
    t,
    sectionList,
    studentList,
    getData,
    // onOpenGrader,
    id,
    unitSelected,
  } = props;
  const [sectionSelected, setSectionSelected] = useState(-1);
  const [anchorEl, setAnchorEl] = useState();
  const [openMenu, setOpenMenu] = useState(false);
  const [openRelease, setOpenRelease] = useState(false);
  const [filters, setFilters] = useState(initFilterStatus());
  const [params, setParams] = useState(sortParams);
  const [selectedFieldSort, setSelectedFieldSort] = useState('lastName');
  const permission = useSelector((state) => state.AllCourses.permission);
  const releaseGradeStudentSubmissionSuccess = useSelector(
    (state) => state.AllCourses.releaseGradeStudentSubmissionSuccess
  );
  const selectedPublicStudentIds = useSelector(
    (state) => state.AllCourses.selectedPublicStudentIds
  );
  const currentTermId = useSelector((state) => state.MyCourses.currentTermId);
  const canViewGrader = checkPermission(permission, ROLE_CAN_GRADER);
  const getIcon = useCallback(
    (sortField) =>
      params.sortField !== sortField
        ? 'icon-icn_sort_arrow_off icon-off'
        : params.sort !== 'asc'
        ? 'icon-icn_sort_arrow_down'
        : 'icon-icn_sort_arrow_up',
    [params]
  );

  const columnSection = {
    title: t('section'),
    dataIndex: 'sectionName',
    key: 'sectionName',
    titleIcon: getIcon('section'),
    titleIconAction: () => onSort('section'),
    render: (text) => <div className='text-ellipsis'>{text}</div>,
  };
  const onSort = useCallback(
    (sortField) => {
      const sort = params.sort === 'asc' ? 'desc' : 'asc';
      const newParams = { sort, sortField };
      setParams(newParams);
      getData({ ...newParams });
      // setSelectedFieldSort(''); // TODO: will replace sort name by BE
    },
    [getData, params.sort]
  );

  const onClickFilter = useCallback((e) => {
    setOpenMenu(true);
    setAnchorEl(e.currentTarget);
  }, []);

  const changeFilter = (key) => {
    if (key === 'ALL') {
      if (filters[key] === true) {
        setFilters([]);
      } else {
        setFilters(initFilterStatus());
      }
      return;
    }
    if (filters[key] === true) {
      filters['ALL'] = false;
    }
    filters[key] = !!!filters[key];
    setFilters({ ...filters });

    // onFilter();
  };

  const onSearch = debounce((e) => {
    const { value } = e.target;
    setParams({ ...params, search: trim(value) });
    getData({ ...params, search: trim(value) });
  }, 500);
  const sortName = useCallback(
    (name) => {
      setSelectedFieldSort(name);
      const sort = params.sort;
      const newParams = { sort, sortField: name };
      setParams(newParams);
      getData({ ...newParams });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.sortField]
  );

  const startGrading = (studentId = '') => {
    const searchParams = new URLSearchParams({
      assignmentId: id,
      sectionId: sectionSelected,
      filter: getStatusStudentProgressFilter(filters),
      unitId: unitSelected,
      studentId: studentId,
      ...params,
    });
    history.push({
      pathname: ROUTE_GRADER.DEFAULT(courseId),
      search: searchParams.toString(),
    });
  };
  const onOpenRelease = () => {
    setOpenRelease(!openRelease);
  };

  useDidMountEffect(() => {
    if (releaseGradeStudentSubmissionSuccess) {
      enqueueSnackbar(t('myCourses:release_grade_successfully'), {
        variant: 'success',
      });
    }
    if (
      releaseGradeStudentSubmissionSuccess &&
      currentTermId &&
      selectedPublicStudentIds
    ) {
      getData(params);
    }
  }, [releaseGradeStudentSubmissionSuccess]);
  const renderFilter = () => (
    <>
      <TblIconButton className={classes.filterBtn} onClick={onClickFilter}>
        <FilterListRoundedIcon
          aria-controls='simple-menu'
          aria-haspopup='true'
        />
      </TblIconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
      >
        {Object.keys(STUDENT_PROGRESS_STATUS).map((key) => (
          // if (key === 'LATE_TURN_IN') {
          //   return null;
          // }
          <MenuItem onClick={() => changeFilter(key)} key={key}>
            <TblCheckbox checked={!!filters[key]} />
            {t(`myCourses:${snakeCase(key)}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  const columns = useMemo(() => {
    const data = [
      {
        title: t('student'),
        dataIndex: 'name',
        key: 'name',
        titleIcon: getIcon(selectedFieldSort),
        titleIconAction: () => onSort(selectedFieldSort),
        titleIconEl: (
          <SortByName
            onClick={sortName}
            selectedFieldSort={selectedFieldSort}
          />
        ),
        render: (text, record) => <UserInfoCard itemInfo={record} />,
      },
      // {
      //   title: t('myCourses:due_time'),
      //   dataIndex: 'dueTime',
      //   key: 'dueTime',
      //   titleIcon: getIcon('dueTime'),
      //   titleIconAction: () => onSort('dueTime'),
      //   render: (text, record) => (
      //     <div className='text-ellipsis'>
      //       {moment(text).format('MMM DD, YYYY - hh:mm a')}
      //     </div>
      //   ),
      // },
      {
        title: t('status'),
        key: 'status',
        dataIndex: 'status',
        width: '20%',
        titleIcon: getIcon('status'),
        titleIconAction: () => onSort('status'),
        render: (text, record) => {
          const { name /* color */ } =
            STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST[record.status];
          // const statusColors = theme.mainColors.assignmentStatus;
          let status = t(`myCourses:${name}`);
          return (
            <Box display='flex'>
              {status}
              {/* <Box mr={0.5}>
                <TblStatus label={status} color={color} background={statusColors[name]} />
              </Box>
              {record.status === STUDENT_PROGRESS_STATUS.LATE_TURN_IN && <Box>
                <TblStatus label={'Late'} color={theme.palette.primary.main} background={statusColors.in_progress} minWidth={40} />
              </Box>} */}
            </Box>
          );
        },
      },
      {
        title: t('myCourses:overall_grade'),
        dataIndex: 'overallGrade',
        key: 'overallGrade',
        align: 'right',
        width: '20%',
        render: (text, record) => (
          <div className={`text-ellipsis ${classes.overallGradeColumn}`}>
            <span className={`${classes.mgR9}`}>
              {text ?? '- -'}/{record.totalPossiblePoints}
            </span>
            {!record.isPublish && !!record.overallGrade && (
              <Tooltip title={t('myCourses:new_grade')} placement='top-start'>
                <InfoOutlinedIcon className={`${classes.fz17}`} />
              </Tooltip>
            )}
          </div>
        ),
      },
      // {
      //   title: '',
      //   key: 'action',
      //   align: 'right',
      //   contextMenu: (record, callback) => {
      //     // console.log(record);
      //     return (
      //       <MenuItem
      //         onClick={(e) => {
      //           console.log('record', record);
      //           onOpenGrader(e, record);
      //           // startGrading(record.studentId);
      //           if (!!callback) {
      //             callback();
      //           }
      //         }}
      //       >
      //         {t('common:view_submission')}
      //       </MenuItem>
      //     );
      //   },
      // },
    ];
    const action = {
      title: '',
      width: '10%',
      key: 'action',
      align: 'right',
      contextMenu: (record, callback) => (
        // console.log(record);
        <MenuItem
          onClick={() => {
            startGrading(record.studentId);
            if (!!callback) {
              callback();
            }
          }}
        >
          {t('common:view_submission')}
        </MenuItem>
      ),
    };
    if (canViewGrader) {
      data.push(action);
    }
    if (sectionSelected === -1) {
      data.splice(1, 0, columnSection);
    }
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, renderFilter, sectionSelected]);

  const handleChangeSection = (value) => {
    setSectionSelected(value);
    setParams(sortParams);
    getData({ sectionId: value !== -1 ? value : '' }, 0);
  };

  useEffect(() => {
    setFilters(initFilterStatus());
    setParams(sortParams);
    setSectionSelected(-1);
    document.getElementById('inputSearch').value = '';
  }, [id]);

  useEffect(() => {
    getData({ filter: getStatusStudentProgressFilter(filters) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div>
      <Box display='flex' justifyContent='space-between'>
        <Box display='flex'>
          <Box className={classes.selectSection}>
            <TblSelect
              label={t('myCourses:section')}
              value={Number(sectionSelected)}
              onChange={(e) => {
                handleChangeSection(e.target.value);
              }}
            >
              <MenuItem key={-1} value={-1}>
                All
              </MenuItem>
              {sectionList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.sectionName}
                </MenuItem>
              ))}
            </TblSelect>
          </Box>
          <Box display='flex' alignItems='flex-end' ml={2}>
            {renderFilter()}
          </Box>
        </Box>
        {canViewGrader && (
          <Box display='flex' alignItems='flex-end'>
            <Box mr={1}>
              <TblButton
                variant='outlined'
                color='primary'
                onClick={onOpenRelease}
              >
                {t('myCourses:release_grades')}
              </TblButton>
            </Box>
            <Box>
              <TblButton
                variant='contained'
                color='primary'
                onClick={() => startGrading()}
              >
                {t('myCourses:start_grading')}
              </TblButton>
            </Box>
          </Box>
        )}
      </Box>

      <Box mt={3}>
        <TblTable
          columns={columns}
          rows={studentList}
          hasSearchList={true}
          keyId='studentId'
          onSearch={onSearch}
          viewDetail={
            canViewGrader
              ? (row) => {
                  if (canViewGrader) {
                    startGrading(row.studentId);
                  }
                }
              : null
          }
        />
      </Box>
      {openRelease && (
        <ReleaseList
          studentList={studentList}
          open={openRelease}
          onClose={onOpenRelease}
          sectionSelected={sectionSelected}
        />
      )}
    </div>
  );
}

AssignmentDetail.propTypes = {
  getData: PropTypes.func,
  id: PropTypes.number,
  onOpenGrader: PropTypes.func,
  sectionList: PropTypes.array,
  studentList: PropTypes.array,
  t: PropTypes.func,
  unitSelected: PropTypes.number,
};

export default AssignmentDetail;
