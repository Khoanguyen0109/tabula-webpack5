import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import TblActivityIcon from 'components/TblActivityIcon';
import TblDrawer from 'components/TblDrawer';
import withReducer from 'components/TblWithReducer';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import { getUrlToStudentViewActivity } from 'shared/MyCourses/utils';

import loadable from '@loadable/component';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import myCoursesActions from 'modules/MyCourses/actions';
import reducer from 'modules/MyCourses/reducers';
import PropTypes from 'prop-types';

// import { makeStyles } from '@mui/material/styles';

import { infoByType } from '../constants';

const ViewAssignmentDetails = loadable(() => import('modules/MyCourses/components/CourseContent/ViewAssignmentDetails'));
const ViewQuizDetails = loadable(() => import('modules/MyCourses/components/CourseContent/ViewQuizDetails'));

// const useStyles = makeStyles((theme) => ({
// }));

function StudentViewActivityDrawer(props) {
  // const classes = useStyles();
  const { visible, activitySelected, onClose } = props;
  const { quizType, isTask, taskType, courseId, shadowId, sectionId } = activitySelected || {};
  const { typeLabel } = infoByType(taskType) || {};
  const infoName = isTask && !!typeLabel ? `${typeLabel}` : '';
  const activityDetails = useSelector((state) => state.AllCourses?.activityDetails);
  const studentGetShadowAssignmentError = useSelector((state) => state.AllCourses?.studentGetShadowAssignmentError);
  const studentGetShadowQuizError = useSelector((state) => state.AllCourses?.studentGetShadowQuizError);
  const dispatch = useDispatch();
  const authContext = useContext(AuthDataContext);
  const { organizationId, timezone } = authContext.currentUser;
  const { t } = useTranslation(['myCourses', 'common']);

  const getActivityDetails = useCallback((shadowId, courseId, sectionId, taskType) => {
    if (!!!shadowId) {
      return;
    }
    if (Number(taskType) === COURSE_ITEM_TYPE.QUIZ) {
      getQuizDetails(shadowId, courseId, sectionId);
    } else {
      getAssignmentDetails(shadowId, courseId, sectionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getQuizDetails = useCallback((id, courseId, sectionId) => {
    dispatch(myCoursesActions.mcGetQuizDetails({
      orgId: organizationId,
      courseId,
      shadowId: id,
      urlParams: { timezone, sectionId }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAssignmentDetails = useCallback((id, courseId, sectionId) => {
    dispatch(myCoursesActions.studentGetShadowAssignment({
      orgId: organizationId,
      courseId,
      shadowId: id,
      urlParams: { timezone, sectionId }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEmpty(activitySelected)) {
      return;
    }
    getActivityDetails(shadowId, courseId, sectionId, taskType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitySelected]);

  return (
    <>
      <TblDrawer
        anchor={'right'}
        open={visible}
        onClose={onClose}
        title={
          <Box display='flex' alignItems='center' fontSize={24}>
            <Box width={0.95}>
              <TblActivityIcon
                name={`${infoName} ${activityDetails?.name}`}
                type={isTask ? -1 : taskType}
                quizType={quizType}
              />
            </Box>
            <Box width={0.05} display='flex' alignItems='center' flexDirection='row-reverse' >
              <div onClick={onClose} className='cursor-pointer'>
                <CloseOutlinedIcon fontSize='inherit' />
              </div>
            </Box>
          </Box>
        }
      >
        {!!activityDetails && (
          <Box ml={1}>
            {isTask &&
              isEmpty(studentGetShadowAssignmentError) &&
              isEmpty(studentGetShadowQuizError) ? (
              <Box mb={2} className='text-ellipsis'>
                This task was created to {lowerCase(typeLabel)}{' '}
                <Link
                  to={getUrlToStudentViewActivity(activityDetails)}
                  target='_blank'
                  className='tbl-link'
                >
                  {activityDetails.name}
                </Link>
              </Box>
            ) : (
              ''
            )}

            {studentGetShadowAssignmentError?.errors?.subcode === 1 ||
              studentGetShadowQuizError?.errors?.subcode === 1 ? (
              <Alert severity='error'>{t('myCourses:task_unavailable')}</Alert>
            ) : taskType === COURSE_ITEM_TYPE.QUIZ ? (
              <ViewQuizDetails
                t={t}
                sectionId={76}
                details={activityDetails}
                courseIdProp={activityDetails?.courseId}
              />
            ) : (
              <ViewAssignmentDetails
                t={t}
                sectionId={76}
                details={activityDetails}
                courseIdProp={activityDetails?.courseId}
              />
            )}
          </Box>
        )}
      </TblDrawer>
    </>
  );
}

StudentViewActivityDrawer.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  activitySelected: PropTypes.object
};
const StudentAssignmentDetailWithReducer = withReducer(
  'AllCourses',
  reducer
)(StudentViewActivityDrawer);

export default StudentAssignmentDetailWithReducer;