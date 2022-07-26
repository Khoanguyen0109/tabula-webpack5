import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import compose from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import TblConfirmDialog from 'components/TblConfirmDialog';

import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import myCoursesActions from '../../actions';

class ConfirmRelink extends React.PureComponent {
  componentDidUpdate(prevProps) {
    const {
      relinkShadowItemSuccess,
      enqueueSnackbar,
      t,
      myCoursesSetState,
      error,
      confirmData,
      isInConfirmRelink,
    } = this.props;
    if (relinkShadowItemSuccess && !prevProps.relinkShadowItemSuccess) {
      enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
      this.onUpdateCourseDays();
      myCoursesSetState({
        relinkShadowItemSuccess: false,
        isInConfirmRelink: false,
      });
    }
    if (
      !isEmpty(error) &&
      error?.subcode &&
      prevProps?.error?.subcode !== error?.subcode &&
      isInConfirmRelink
    ) {
      const message = this.generateErrorMessage(
        confirmData?.type,
        error?.subcode,
        error
      );
      if (error?.subcode !== 24) {
        enqueueSnackbar(message, { variant: 'error' });
        myCoursesSetState({ error: {}, isInConfirmRelink: false });
      }
    }
  }

  onUpdateCourseDays = () => {
    const {
      myCoursesSetState,
      shadowLessonDetail,
      confirmData,
      shadowAssignment,
      shadowQuizDetail,
    } = this.props;
    let queueUpdate = {};
    switch (confirmData?.type) {
      case 'lessons':
        queueUpdate = {
          [shadowLessonDetail?.sectionSchedule?.courseDayId]: true,
          [shadowLessonDetail?.masterLesson?.courseDayId]: true,
        };
        break;
      case 'assignments':
        queueUpdate = {
          [shadowAssignment?.assignDate?.courseDayId]: true,
          [shadowAssignment?.masterAssignment?.courseDayId]: true,
        };
        break;
      case 'quizzes':
        queueUpdate = {
          [shadowQuizDetail?.executeDate?.courseDayId]: true,
          [shadowQuizDetail?.masterQuiz?.executeDateId]: true,
        };
        break;
      default:
        break;
    }
    if (!isEmpty(queueUpdate)) {
      myCoursesSetState({ queueUpdate });
    }
  };

  generateErrorMessage = (type, subcode, error = {}) => {
    const { t } = this.props;
    switch (type) {
      case 'lessons':
        return error?.message ?? t('error:general_error');
      case 'assignments':
        switch (subcode) {
          case 15:
            return t('error:relink_shadow_assignment_status');
          case 16:
          case 17:
            return error?.message ?? t('error:general_error');
          case 18:
            return t('error:relink_shadow_item_in_the_past');
          default:
            return error?.message ?? t('error:general_error');
        }
      case 'quizzes':
        switch (subcode) {
          case 21:
            return t('error:relink_shadow_quiz_status');
          case 22:
            return error?.message ?? t('error:general_error');
          case 23:
            return t('error:relink_shadow_item_in_the_past');
          case 24:
            this.props.myCoursesSetState({
              isShowUpdateMakeUpDeadlineModal: true,
            });
            this.onHideConfirmModal();
            return error?.message;
          default:
            return error?.message ?? t('error:general_error');
        }
      default:
        return t('error:general_error');
    }
  };

  onConfirmed = () => {
    const { confirmData, relinkShadowItem } = this.props;
    if (
      !!confirmData?.type &&
      !!confirmData?.orgId &&
      !!confirmData?.id &&
      !!confirmData?.courseId &&
      !!relinkShadowItem
    ) {
      const { orgId, courseId, type, id } = confirmData;
      relinkShadowItem({
        orgId,
        courseId,
        type,
        shadowId: id,
        data: { relink: true },
        relinkShadowItemSuccess: false,
        isInConfirmRelink: true,
      });
      this.onHideConfirmModal();
    }
  };

  onHideConfirmModal = () => {
    this.props.myCoursesSetState({ isShowConfirmRelinkModal: false });
  };

  render() {
    const { t, isShowConfirmRelinkModal, confirmData } = this.props;
    return (
      <TblConfirmDialog
        cancelText={t('common:cancel')}
        okText={t('relink')}
        open={!!isShowConfirmRelinkModal}
        onConfirmed={this.onConfirmed}
        message={t('confirm_message_relink', {
          itemName: confirmData?.name ?? '',
        })}
        onCancel={this.onHideConfirmModal}
        title={t('common:confirmation')}
      />
    );
  }
}

ConfirmRelink.propTypes = {
  t: PropTypes.func,
  isShowConfirmRelinkModal: PropTypes.bool,
  myCoursesSetState: PropTypes.func,
  confirmData: PropTypes.object,
  relinkShadowItem: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  relinkShadowItemSuccess: PropTypes.bool,
  shadowLessonDetail: PropTypes.object,
  shadowAssignment: PropTypes.object,
  shadowQuizDetail: PropTypes.object,
  error: PropTypes.object,
  isInConfirmRelink: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isShowConfirmRelinkModal: state.AllCourses.isShowConfirmRelinkModal,
  confirmData: state.AllCourses.confirmData,
  relinkShadowItemSuccess: state.AllCourses.relinkShadowItemSuccess,
  shadowLessonDetail: state.AllCourses.shadowLessonDetail,
  shadowAssignment: state.AllCourses.shadowAssignment,
  shadowQuizDetail: state.AllCourses.shadowQuizDetail,
  error: state.AllCourses.error,
  isInConfirmRelink: state.AllCourses.isInConfirmRelink,
});
const mapDispatchToProps = (dispatch) => ({
  relinkShadowItem: (payload) =>
    dispatch(myCoursesActions.relinkShadowItem(payload)),
  myCoursesSetState: (payload) =>
    dispatch(myCoursesActions.myCoursesSetState(payload)),
});

export default compose(
  withTranslation('myCourses', 'common', 'error'),
  connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(ConfirmRelink));
