import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import TblTabs from 'components/TblTabs';

import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { useAuthDataContext } from '../../../../../AppRoute/AuthProvider';
import TblDialog from '../../../../../components/TblDialog';
import useDidMountEffect from '../../../../../utils/customHook/useDidMoutEffect';
import myCourseActions from '../../../actions';

import ActivityDetails from './ActivityDetails';

function AssignmentDetail(props) {
  const { open ,cellSelected, onClose, disableOverallGrade } = props;
  const dispatch = useDispatch();
  const params = useParams();
  const { t } = useTranslation('myCourses');
  const { courseId } = params;
  // const cellSelected = useSelector((state) => state.AllCourses.cellSelected);
  const graderDetail = useSelector((state) => state.AllCourses.graderDetail);
  const fullName =
    `${graderDetail?.students?.firstName } ${ graderDetail?.students?.lastName}`;

  // eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars
  const [currentTab, setCurrentTab] = useState(0);
  const [attemptSelected, setAttemptSelected] = useState({});
  const [attemptList, setAttemptList] = useState([]);
  // const {
  //   student: { firstName, lastName },
  //   status,
  //   overallGrade,
  //   shadowAssignment: {
  //     masterAssignment: { assignmentName, percentCredit },
  //     originalDueTime,
  //     finalDueTime,
  //   },
  //   submissionAttempts,
  // } = graderDetail;
  // const fullName =  `${firstName} ${lastName}`;
  const { currentUser } = useAuthDataContext();
  const { organizationId } = currentUser;

  const handleClose = () => {
    onClose();
    dispatch(
      myCourseActions.allCoursesSetState({
        graderDetail: null,
      })
    );
  };

  useEffect(() => {
    if (open) {
      const {
        value: { shadowAssignmentId },
        row: { id },
      } = cellSelected;
      dispatch(
        myCourseActions.mcGetGraderDetail({
          orgId: organizationId,
          courseId,
          shadowId: shadowAssignmentId,
          studentId: id,
          isFetchingGraderDetail: true,
          graderDetail: null,
          error: null,
        })
      );
    }
  }, [cellSelected, courseId, dispatch, open, organizationId]);

  useDidMountEffect(() => {
    if (graderDetail || !isEmpty(graderDetail)) {
      const submissionAttempts = graderDetail?.submissionAttempts.map(
        (item, index) => ({
          ...item,
          attemptIndex: graderDetail.submissionAttempts.length - index,
        })
      );
      setAttemptList(submissionAttempts);
      if (
        graderDetail.submissionAttempts[0] &&
        graderDetail.submissionAttempts[0].id
      ) {
        setAttemptSelected({
          ...graderDetail.submissionAttempts[0],
          attemptIndex: graderDetail.submissionAttempts.length,
        });
      }
    }
  }, [graderDetail?.submissionAttempts]);

  const onChangeTab = () => {};
  const renderTab = () => {
    switch (currentTab) {
      case 0:
        return (
          <ActivityDetails
            attemptSelected={attemptSelected}
            attemptList={attemptList}
            disableOverallGrade={disableOverallGrade}
          />
        );

      default:
        break;
    }
  };
  const loading = !(graderDetail && !isEmpty(graderDetail));
  return (
    <TblDialog
      open={open}
      hasCloseIcon={true}
      loading={loading}
      onClose={handleClose}
      title={fullName}
      subtitle2={
        graderDetail?.shadowAssignment?.masterAssignment.assignmentName
      }

    >
      <>
        <TblTabs
          onChange={onChangeTab}
          selectedTab={currentTab}
          selfHandleChange={true}
          // minWidthItem={102}
          tabs={[
            {
              label: t('activity_details'),
              name: t('activity_details'),
            },
          ]}
        />
        {renderTab()}
      </>
    </TblDialog>
  );
}

AssignmentDetail.propTypes = {
  cellSelected: PropTypes.object,
  disableOverallGrade: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

export default AssignmentDetail;
