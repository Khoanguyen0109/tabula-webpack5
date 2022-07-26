import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';

import {
  AppBar,
  Box,
  Divider,
  MenuItem,
  Skeleton,
  Toolbar,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import TblButton from 'components/TblButton';
import TblSelect from 'components/TblSelect';

import clsx from 'clsx';
import { LayoutContext } from 'layout';
import { ROUTE_MY_COURSES } from 'modules/MyCourses/constantsRoute';
import { initFilterStatus } from 'modules/MyCourses/utils';

import GraderActions from '../../actions';

import FilterButton from './FilterButton';
import PercentGradeView from './PercentGradeView';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(10),
    backgroundColor: 'white',
    boxShadow: '0px 1px 4px rgba(33, 37, 41, 0.16)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingTop: theme.spacing(3.2),
    paddingBottom: theme.spacing(3.2),
  },
  courseName: {
    color: theme.newColors.gray[900],
    maxWidth: theme.spacing(40),
  },
  select: {
    width: theme.spacing(30),
    height: theme.spacing(5),
  },
  divider: {
    display: 'flex',
    height: theme.spacing(3),
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  box: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  iconBack: {
    color: theme.palette.primary.main,
    paddingRight: theme.spacing(1.5),
    cursor: 'pointer',
    width: '50px',
  },
}));
const GraderSelector = (state) => state.Grader;
function GraderNavBar() {
  const { t } = useTranslation('grader');
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { courseId } = useParams();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  // eslint-disable-next-line quotes
  const unitId = urlParams.get('unitId');

  const layout = useContext(LayoutContext);
  const {
    basicInfo,
    assignmentList,
    sectionList,
    assignmentSelected,
    sectionSelected,
    filtersSelected,
    summary,
    total,
  } = useSelector(GraderSelector);
  const setState = (value) => dispatch(
      GraderActions.graderSetState({
        ...value,
        sortField: 'grading',
      })
    );
  const handleChangeAssignment = (value) => {
    setState({
      assignmentSelected: value,
      sectionSelected: -1,
    });
  };

  const handleChangeSection = (value) => {
    // console.log('value', value);
    setState({
      sectionSelected: value,
    });
    // setUrlParam(location, history, {sectionId: value});
  };

  const changeFilter = useCallback(
    (key) => {
      if (key === 'ALL') {
        if (filtersSelected[key] === true) {
          setState({
            filtersSelected: [],
          });
        } else {
          setState({
            filtersSelected: initFilterStatus(),
          });
        }
        return;
      }
      if (filtersSelected[key] === true) {
        filtersSelected['ALL'] = false;
      }
      filtersSelected[key] = !!!filtersSelected[key];
      setState({
        filtersSelected: { ...filtersSelected },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtersSelected]
  );

  const stopGrading = () => {
    layout.setFullScreen(false);
    if (!unitId) {
      return history.push(ROUTE_MY_COURSES.DEFAULT);
    }
    return history.push({
      pathname: ROUTE_MY_COURSES.MY_COURSES_DETAIL(courseId),
      search: new URLSearchParams({
        active: 'gradebook',
      }).toString(),
      // search: '?active=student_submissions'
    });
  };
  return (
    <AppBar className={classes.root} position='static'>
      <Toolbar className={classes.toolbar}>
        <Box ml={0.5} className={classes.container}>
          <span
            className={`icon-icn_back ${classes.iconBack}`}
            onClick={stopGrading}
           />

          {basicInfo?.courseName ? (
            <Typography
              variant='labelLarge'
              className={clsx(classes.courseName, 'text-ellipsis')}
            >
              {`${t('grader') } ${ basicInfo.courseName}`}
            </Typography>
          ) : (
            <Skeleton height={32} width={120} />
          )}
        </Box>
        <Box className={classes.container}>
          <Box className={clsx(classes.box, classes.select)}>
            <TblSelect
              value={Number(assignmentSelected)}
              onChange={(e) => {
                handleChangeAssignment(e.target.value);
              }}
            >
              {assignmentList?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.assignmentName}
                </MenuItem>
              ))}
            </TblSelect>
          </Box>
          <Box className={clsx(classes.box, classes.select)}>
            <TblSelect
              value={Number(sectionSelected)}
              onChange={(e) => {
                handleChangeSection(e.target.value);
              }}
            >
              <MenuItem key={-1} value={-1}>
                {t('grader:all_sections')}
              </MenuItem>
              {sectionList?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.sectionName}
                </MenuItem>
              ))}
            </TblSelect>
          </Box>
          <Box className={classes.box}>
            <FilterButton
              filters={filtersSelected || []}
              changeFilter={changeFilter}
            />
          </Box>
          <Box className={clsx(classes.box, classes.divider)}>
            <Divider orientation='vertical' flexItem />
          </Box>
          <PercentGradeView graded={summary?.graded || 0} total={total} />
          <Box className={clsx(classes.box, classes.divider)}>
            <Divider orientation='vertical' flexItem />
          </Box>{' '}
          <Box className={classes.box}>
            <TblButton
              color='primary'
              variant='contained'
              onClick={stopGrading}
            >
              {t('grader:stop_grading')}
            </TblButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default GraderNavBar;
