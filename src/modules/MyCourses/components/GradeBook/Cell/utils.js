import isNil from 'lodash/isNil';

import { isAfter, isBefore, isEqual } from 'date-fns';

import { SUBMISSION_METHOD } from '../../../../../shared/MyCourses/constants';
import { STUDENT_PROGRESS_STATUS } from '../../../constants';

export const renderStatusOptions = (t, formattedValue, value, colDef) => {
  const {
    originalDueTime,
    finalDueTime,
    // eslint-disable-next-line react/prop-types
  } = colDef;

  const CAN_CHANGE_TO_TURN_IN_OPTIONS = [
    STUDENT_PROGRESS_STATUS.NOT_TURN_IN,
    STUDENT_PROGRESS_STATUS.MISSING,
    STUDENT_PROGRESS_STATUS.LATE_TURN_IN,
  ];
  const CAN_CHANGE_TO_TURN_IN_LATE_OPTIONS = [
    STUDENT_PROGRESS_STATUS.TURN_IN,
    STUDENT_PROGRESS_STATUS.MISSING,
  ];
  const CAN_CHANGE_TO_MISSING_OPTIONS = [
    STUDENT_PROGRESS_STATUS.TURN_IN,
    STUDENT_PROGRESS_STATUS.LATE_TURN_IN,
  ];

  const today = new Date();
  
  const canChangeToTurnIn =
    CAN_CHANGE_TO_TURN_IN_OPTIONS.includes(formattedValue.status) &&
    !(isNil(formattedValue) || isNil(value));
  const canChangeToTurnInLate =
    isAfter(today, new Date(originalDueTime)) &&
    CAN_CHANGE_TO_TURN_IN_LATE_OPTIONS.includes(formattedValue.status) && colDef.masterAssignment?.allowLateTurnIn;

  const canChangeToMissing =
    isAfter(today, new Date(originalDueTime)) &&
    (isBefore(today, new Date(finalDueTime)) ||
      isEqual(today, new Date(finalDueTime))) &&
    CAN_CHANGE_TO_MISSING_OPTIONS.includes(formattedValue.status);
  const options = [
    {
      label: t('turn_in'),
      value: STUDENT_PROGRESS_STATUS.TURN_IN,
      hotKey: 't',
      disabled: !canChangeToTurnIn,
      disabledMessage: value.status === STUDENT_PROGRESS_STATUS.TURN_IN ? '' : t('unable_to_change_turn_in'),
    },
    {
      label: t('turn_in_late'),
      value: STUDENT_PROGRESS_STATUS.LATE_TURN_IN,
      hotKey: 'l',
      disabled: !canChangeToTurnInLate,
      disabledMessage: value.status === STUDENT_PROGRESS_STATUS.LATE_TURN_IN ? '' : colDef.masterAssignment?.allowLateTurnIn ? t('unable_to_change_turn_in_late'): t('dont_allow_to_change_turn_in_late'),
    },
    {
      label: t('missing'),
      value: STUDENT_PROGRESS_STATUS.MISSING,
      hotKey: 'm',
      disabled: !canChangeToMissing,
      disabledMessage: value.status === STUDENT_PROGRESS_STATUS.MISSING ? '' : t('unable_to_change_missing'),
    },
  ];
  return options;
};

export const disableDropDown = (submissionMethod, value) => (
    (submissionMethod === SUBMISSION_METHOD.OFFLINE &&
      !isNaN(value.overallGrade) &&
      !isNil(value.overallGrade)) ||
    value.status === STUDENT_PROGRESS_STATUS.MISSED
  );

export const mapStatusWithHotKey = {
  [STUDENT_PROGRESS_STATUS.TURN_IN]: {
    hotKey: 't'
  },
  [STUDENT_PROGRESS_STATUS.LATE_TURN_IN]: {
    hotKey: 'l'
  },
  [STUDENT_PROGRESS_STATUS.MISSING]: {
    hotKey: 'm'
  },
  [STUDENT_PROGRESS_STATUS.NOT_TURN_IN]: {
    hotKey: ''
  },
  [STUDENT_PROGRESS_STATUS.MISSED]: {
  }
};