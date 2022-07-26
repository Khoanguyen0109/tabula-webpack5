import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import CreateAssignmentDrawer from 'shared/MyCourses/containers/CreateAssignmentDrawer';
import CreateEditQuiz from 'shared/MyCourses/containers/CreateEditQuiz';

import loadable from '@loadable/component';
import { Layout1 } from 'layout';
import manageCourseTemplateActions from 'modules/ManageCourseTemplate/actions';
import TermsAndGradingPeriods from 'modules/ManageCourseTemplate/containers/Plan/TermsAndGradingPeriods';
import { GRADE_WEIGHT_TYPE_NUMBER } from 'modules/MyCourses/constants';
import PropTypes from 'prop-types';

import UnitAndActivities from './UnitAndActivities';

const ManageLesson = loadable(() =>
  import('shared/Lesson/containers/ManageLesson')
);

const useStyles = makeStyles(() => ({
  wrapper: {
    '& .MuiTypography-root': {
      height: `calc(100% - ${100}px)`,
    },
  },
}));

export default function Plan(props) {
  const { templateId, organizationId } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [visibleCreateAssignmentDialog, setVisibleCreateAssignmentDialog] =
    useState(false);
  const [visibleCreateEditQuizDialog, setVisibleCreateEditQuizDialog] =
    useState(false);
  const [isVisibleCreateEditLesson, setIsVisibleCreateEditLesson] =
    useState(false);
  const [viewDetailItem, setViewDetailItem] = useState(null);
  const isBusy = useSelector((state) => state.ManageCourseTemplate?.isBusy);
  const viewDetailTermsAndGradingPeriod = useSelector(
    (state) => state.ManageCourseTemplate.viewDetailTermsAndGradingPeriod
  );
  const getTemplateDetailTerms = useCallback(() => {
    dispatch(
      manageCourseTemplateActions.viewTemplateDetailGetTerms({
        templateId,
        organizationId,
      })
    );
  }, [dispatch, organizationId, templateId]);
  useEffect(() => {
    getTemplateDetailTerms();
  }, [getTemplateDetailTerms]);
  const onChangeTermsAndGradingPeriod = (gradingPeriodId) => {
    if (gradingPeriodId) {
      dispatch(
        manageCourseTemplateActions.viewTemplateDetailGetUnit({
          templateId,
          organizationId,
          gradingPeriodId,
          isBusy: false,
        })
      );
    }
  };
  const onViewDetail = (item) => {
    setViewDetailItem(item);
    switch (item?.type) {
      case GRADE_WEIGHT_TYPE_NUMBER.LESSON:
        setIsVisibleCreateEditLesson(true);
        break;
      case GRADE_WEIGHT_TYPE_NUMBER.ASSIGNMENT:
        setVisibleCreateAssignmentDialog(true);
        break;
      case GRADE_WEIGHT_TYPE_NUMBER.TEST:
        setVisibleCreateEditQuizDialog(true);
        break;
      default:
        break;
    }
  };
  const onCloseDialog = () => {
    setVisibleCreateAssignmentDialog(false);
    setVisibleCreateEditQuizDialog(false);
    setIsVisibleCreateEditLesson(false);
  };
  return (
    <Layout1 className={classes.wrapper}>
      {isBusy && (
        <Box>
          <Box mb={2}>
            <Skeleton
              variant='rectangular'
              animation='wave'
              width={300}
              height={50}
            />
          </Box>
          <Skeleton
            variant='rectangular'
            animation='wave'
            width={'100%'}
            height={250}
          />
        </Box>
      )}
      <Box>
        <TermsAndGradingPeriods
          viewDetailTermsAndGradingPeriod={viewDetailTermsAndGradingPeriod}
          onChangeTermsAndGradingPeriod={onChangeTermsAndGradingPeriod}
        />
      </Box>
      <UnitAndActivities
        onViewDetail={onViewDetail}
        isBusy={isBusy}
        t={t}
        orgId={organizationId}
        courseId={templateId}
      />
      {visibleCreateAssignmentDialog && (
        <CreateAssignmentDrawer
          visible={visibleCreateAssignmentDialog}
          onClose={() => onCloseDialog()}
          // unit={viewDetailItem?.unitInfo}
          assignmentId={viewDetailItem?.id}
          assignmentViewData={viewDetailItem}
          isViewOnly={true}
          courseIdProp={viewDetailItem?.courseId}
        />
      )}
      {visibleCreateEditQuizDialog && (
        <CreateEditQuiz
          orgId={organizationId}
          onClose={onCloseDialog}
          isVisible={visibleCreateEditQuizDialog}
          quizId={viewDetailItem?.id}
          courseId={viewDetailItem?.courseId}
          unitId={viewDetailItem?.unitInfo?.id}
          quizType={viewDetailItem?.quizType}
          quizViewData={viewDetailItem}
          isViewOnly={true}
        />
      )}
      {isVisibleCreateEditLesson && (
        <ManageLesson
          isVisible={isVisibleCreateEditLesson}
          lessonViewData={viewDetailItem}
          lessonInfo={viewDetailItem}
          courseId={viewDetailItem?.courseId}
          unit={viewDetailItem?.unitInfo}
          onCloseDrawer={onCloseDialog}
          isViewOnly={true}
        />
      )}
    </Layout1>
  );
}

Plan.propTypes = {
  templateId: PropTypes.number,
  organizationId: PropTypes.number,
};
