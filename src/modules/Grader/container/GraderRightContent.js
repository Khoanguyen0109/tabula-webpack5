import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { Box, Divider, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import clsx from 'clsx';

import GraderActions from '../actions';
import Grading from '../components/RightContent/Grading';
import OverallGrading from '../components/RightContent/OverallGrading';
import StudentInfo from '../components/RightContent/StudentInfo';
import {isTermOver7Days} from '../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',

    '& .title': {
      color: theme.newColors.gray[800],
      fontWeight: theme.fontWeight.semi,
      fontSize: theme.fontSize.small,
    },
  },
  gradingContainer: {},
  commentContainer: {
    width: theme.spacing(36),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: theme.spacing(30),
    height: theme.spacing(0.25),
    backgroundColor: theme.newColors.gray[200],
  },
  boxItem: {
    width: theme.spacing(36),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: 'white',
    border: '1px solid #E9ECEF',
    borderRadius: theme.borderRadius.default,
  },
  emptyText: {
    color: theme.newColors.gray[800],
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
  },
}));
function GraderRightContent() {
  const classes = useStyles();
  const { t } = useTranslation('grader');
  const dispatch = useDispatch();

  const gradingList = useSelector((state) => state.Grader.gradingList);
  const terms = useSelector((state) => state.Grader.basicInfo.terms);
  const graderDetail = useSelector((state) => state.Grader.graderDetail);

  const graderDetailCreatedAt = graderDetail.createdAt;
  useEffect(() => {
    if (graderDetailCreatedAt && terms && terms.length) {
      const termIdOfGradeDetail = graderDetail?.shadowAssignment?.assignDate?.courseDay?.gradingPeriod?.termId;
      const indexTerm = terms.findIndex((term) => term.id === termIdOfGradeDetail);
      dispatch(
        GraderActions.graderSetState({
          isOverTime: isTermOver7Days(terms[indexTerm])
        })
      );

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, graderDetailCreatedAt, dispatch]);
  const fetchingGradingList = useSelector(
    (state) => state.Grader.fetchingGradingList
  );

  if (fetchingGradingList) {
    return (
      <Box className={classes.root}>
        <Box className={clsx(classes.boxItem)}>
          <Skeleton width='100%' height={88} />
        </Box>
      </Box>
    );
  }
  return (
    <Box className={classes.root}>
      {gradingList.length > 0 ? (
        <>
          <Box className={classes.gradingContainer}>
            <Box className={clsx(classes.boxItem)}>
              <StudentInfo />
            </Box>
            <Box className={clsx(classes.boxItem)}>
              <Grading
                totalPossiblePoints={gradingList[0].totalPossiblePoints}
              />
            </Box>
            <OverallGrading
              totalPossiblePoints={gradingList[0].totalPossiblePoints}
            />
          </Box>
          {/* <Box display='flex' width={240} > */}
          <Divider className={classes.divider} variant='middle' />
          {/* </Box> */}
          {/* <Box className={classes.commentContainer}>
            <Comments />
          </Box> */}
        </>
      ) : (
        <Box className={clsx(classes.boxItem)}>
          <Typography className={classes.emptyText}>
            {t('no_students')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default GraderRightContent;
