import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';

import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import ErrorPage from 'components/TblErrorPage';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { LayoutContext } from 'layout';
import myCourseActions from 'modules/MyCourses/actions.js';
import { setUrlParam } from 'utils';
import { checkPermission } from 'utils';

import { STUDENT_PROGRESS_STATUS } from '../../MyCourses/constants';
import {
  getStatusStudentProgressFilter,
  initFilterStatus,
} from '../../MyCourses/utils';
import GraderActions from '../actions';
import GraderNavBar from '../components/Navbar/GraderNavBar';
import { ROLE_CAN_GRADER } from '../constants';

import GraderLeftContent from './GraderLeftContent';
import GraderRightContent from './GraderRightContent';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.newColors.gray[500],
  },
  content: {
    display: 'flex',
    margin: 'auto',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    alignItems: 'flex-start',
    justifyContent: 'center',
    maxWidth: theme.breakpoints.values.xl,
  },
}));

function Grader() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const layout = useContext(LayoutContext);

  const authContext = useContext(AuthDataContext);
  const { currentUser } = authContext;
  const { organizationId, timezone } = currentUser;

  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const { courseId } = params;
  const urlParams = new URLSearchParams(location.search);
  const assignmentId = urlParams.get('assignmentId');
  const sectionId = urlParams.get('sectionId');
  const filters = urlParams.get('filter');
  const studentId = urlParams.get('studentId');
  const sortParams = urlParams.get('sort');
  const sortFieldParams = urlParams.get('sortField');
  const initFilter = {};
  if (filters) {
    filters.split(',').forEach((value) => {
      value = parseInt(value);
      const keyFound = Object.keys(STUDENT_PROGRESS_STATUS).find(
        (key) => STUDENT_PROGRESS_STATUS[key] === value
      );
      initFilter[keyFound] = true;
      return;
    });
  }
  const permission = useSelector((state) => state.Grader.permission);

  const assignmentList = useSelector((state) => state.Grader.assignmentList);
  const gradingList = useSelector((state) => state.Grader.gradingList);
  const assignmentSelected = useSelector(
    (state) => state.Grader.assignmentSelected
  );

  const sectionSelected = useSelector((state) => state.Grader.sectionSelected);
  const filtersSelected = useSelector((state) => state.Grader.filtersSelected);
  const studentSelected = useSelector((state) => state.Grader.studentSelected);
  const shadowAssignmentId = useSelector(
    (state) => state.Grader.shadowAssignmentId
  );
  const inputGradeSuccess = useSelector(
    (state) => state.Grader.inputGradeSuccess
  );
  const currentTermId = useSelector(
    (state) =>
      state.Grader.graderDetail?.shadowAssignment?.assignDate?.courseDay
        ?.gradingPeriod?.termId
  );

  const sort = useSelector((state) => state.Grader.sort);
  const sortField = useSelector((state) => state.Grader.sortField);

  const getParams = () => {
    const params = {
      assignmentId: assignmentSelected,
      filter: getStatusStudentProgressFilter(filtersSelected),
      sortField: sortField,
      sort: sort,
      sectionId: sectionSelected,
    };
    setUrlParam(location, history, params);
    if (sectionSelected === -1) {
      delete params.sectionId;
      // Object.assign(params , {sectionId: sectionSelected });
    }
    Object.assign(params, { timezone });
    return params;
  };

  const getGradingList = useCallback(() => {
    const params = getParams();
    dispatch(
      GraderActions.graderSetState({
        fetchingGradingList: true,
      })
    );
    dispatch(
      GraderActions.getGradingList({
        orgId: organizationId,
        courseId: courseId,
        assignmentId: assignmentSelected,
        urlParams: params,
      })
    );
    dispatch(
      GraderActions.getTotalGraded({
        orgId: organizationId,
        courseId: courseId,
        assignmentId: assignmentSelected,
        urlParams: params,
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    assignmentSelected,
    courseId,
    dispatch,
    filtersSelected,
    organizationId,
    sectionSelected,
  ]);

  // Get Total when input success
  const getTotalGraded = useCallback(() => {
    if (inputGradeSuccess) {
      const params = getParams();
      dispatch(
        GraderActions.getTotalGraded({
          orgId: organizationId,
          courseId: courseId,
          assignmentId: assignmentSelected,
          urlParams: params,
        })
      );
      currentTermId &&
        dispatch(
          myCourseActions.mcCalculateOverallCourseGrade({
            courseId,
            termId: currentTermId,
            data: {
              studentId: studentSelected,
            },
          })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputGradeSuccess]);

  const getCoursePermission = useCallback(() => {
    dispatch(
      GraderActions.getPermissionCourse({
        orgId: organizationId,
        courseId,
      })
    );
  }, [dispatch, organizationId, courseId]);

  const getBasicInfo = () => {
    dispatch(
      GraderActions.getBasicInfo({
        orgId: organizationId,
        courseId,
      })
    );
  };

  const selectStudent = (item) => {
    dispatch(
      GraderActions.graderSetState({
        studentSelected: item.studentId,
        shadowAssignmentId: item.shadowAssignmentId,
      })
    );
  };

  useEffect(() => {
    if (!layout.fullScreen) {
      layout.setFullScreen(true);
    }
    dispatch(
      GraderActions.getActivitiesInGrader({
        orgId: organizationId,
        courseId: courseId,
      })
    );
    getCoursePermission();
    getBasicInfo();
    return () => {
      dispatch(GraderActions.graderResetState());
      if (layout.fullScreen) {
        layout.setFullScreen(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (assignmentList) {
      dispatch(
        GraderActions.graderSetState({
          sectionSelected: !!!sectionId ? -1 : parseInt(sectionId),
          assignmentSelected:
            parseInt(assignmentId) ?? assignmentList[0].id ?? -1,
          filtersSelected:
            !filters && filters !== '' ? initFilterStatus() : initFilter,
          sort: sortParams ?? '',
          sortField: sortFieldParams ?? 'grading',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentList]);

  useDidMountEffect(() => {
    if (assignmentSelected && assignmentSelected !== -1) {
      dispatch(
        GraderActions.getSectionsByActivityGrader({
          orgId: organizationId,
          courseId,
          activityId: assignmentSelected,
          fetchingSectionList: true,
        })
      );
    }
  }, [assignmentSelected]);

  useDidMountEffect(() => {
    getGradingList();
  }, [getGradingList]);

  useDidMountEffect(() => {
    getTotalGraded();
  }, [getTotalGraded]);

  useDidMountEffect(() => {
    const praseStudentId = parseInt(studentId);
    const studentSelected = gradingList.find(
      (g) => g.studentId === praseStudentId
    );
    if (studentId && studentId !== '' && studentSelected) {
      selectStudent(studentSelected);
    } else {
      if (gradingList[0] && gradingList[0].studentId) {
        selectStudent(gradingList[0]);
      }
    }
  }, [gradingList]);

  useDidMountEffect(() => {
    setUrlParam(location, history, { studentId: studentSelected });
    dispatch(
      GraderActions.getGraderDetail({
        orgId: organizationId,
        courseId,
        shadowId: shadowAssignmentId,
        studentId: studentSelected,
        isFetchingGraderDetail: true,
      })
    );
  }, [studentSelected, shadowAssignmentId]);

  if (permission && !checkPermission(permission, ROLE_CAN_GRADER)) {
    return (
      <ErrorPage
        errorCode='403'
        shortDescription='forbidden'
        detailDescription='no_permission'
        isNotFoundPage={false}
        isPublic={true}
      />
    );
  }

  return (
    <Box className={classes.root}>
      <GraderNavBar />
      <Box className={classes.content}>
        <Box flexGrow={1} mr={3}>
          <GraderLeftContent />
        </Box>
        <Box>
          <GraderRightContent />
        </Box>
      </Box>
    </Box>
  );
}

export default Grader;
