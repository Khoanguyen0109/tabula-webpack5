import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

import TblIconButton from 'components/TblIconButton';
import UserInfoCard from 'components/TblSidebar/UserInfoCard';
import TblTooltip from 'components/TblTooltip';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';
import useEventListener from 'utils/customHook/useEventListener';
import { checkKeyPressNotInTextArea } from 'utils/customHook/useEventListener';

import { isEqual } from 'date-fns/esm';
import { getStatusStudentSubmission } from 'modules/MyCourses/utils';

import GraderActions from '../../actions';
import GradingList from '../GradingList/GradingList';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '56px',
    width: '250px',
  },
  userInfo: {
    width: '85%',
    // maxWidth: theme.spacing(90),
    '&:hover': {
      cursor: 'pointer',
    },
  },
  groupBtn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& .MuiIconButton-root': {
      padding: 0,
    },
  },
}));
function StudentInfo() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const gradingList = useSelector((state) => state.Grader.gradingList);
  const studentSelected = useSelector((state) => state.Grader.studentSelected);
  const statusGraded = useSelector((state) => state.Grader.statusGraded);

  const [studentInfo, setStudentInfo] = useState({});
  // const studentInfo = gradingList.find((g) => g.studentId === studentSelected);
  const onClose = () => setOpen(!open);

  useEffect(() => {
    const currentStudent = gradingList.find(
      (g) => g.studentId === studentSelected
    );
    if (currentStudent) {
      setStudentInfo({ ...currentStudent });
    }
  }, [studentSelected, gradingList]);

  // Update status submission when input grade success
  useDidMountEffect(() => {
    if (statusGraded !== studentInfo.status)
      setStudentInfo({
        ...studentInfo,
        status: statusGraded,
      });
  }, [statusGraded]);

  const handleKey = (e) => {
    const { key } = e;
    if (!checkKeyPressNotInTextArea(e)) {
      return;
    }
    const KEY_UP = ['87', 'w'];
    const KEY_DOWN = ['83', 's'];
    if (KEY_UP.includes(String(key))) {
      onPrevious();
    }
    if (KEY_DOWN.includes(String(key))) {
      onNext();
    }
  };
  useEventListener('keydown', handleKey);
  const selectStudent = (item) => {
    dispatch(
      GraderActions.graderSetState({
        studentSelected: item.studentId,
        shadowAssignmentId: item.shadowAssignmentId,
      })
    );
  };
  const onNext = () => {
    const index = gradingList.findIndex(
      (grading) => grading.studentId === studentSelected
    );
    if (gradingList[index + 1]) {
      selectStudent(gradingList[index + 1]);
    }
  };

  const onPrevious = () => {
    const index = gradingList.findIndex(
      (grading) => grading.studentId === studentSelected
    );
    if (gradingList[index - 1]) {
      selectStudent(gradingList[index - 1]);
    }
  };

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.userInfo} onClick={onClose}>
          <UserInfoCard
            itemInfo={{ name: studentInfo?.name }}
            status={getStatusStudentSubmission(t, studentInfo?.status)}
          />
        </Box>
        <Box className={classes.groupBtn}>
          <TblIconButton
            onClick={onPrevious}
            disabled={studentSelected === gradingList[0].studentId}
          >
            <TblTooltip title={t('grader:previous_w')} placement='top'>
              <ExpandLessIcon />
            </TblTooltip>
          </TblIconButton>

            <TblIconButton
              onClick={onNext}
              disabled={
                studentSelected ===
                gradingList[gradingList.length - 1].studentId
              }
            >
              <TblTooltip title={t('grader:next_s')} placement='bottom'>
                <ExpandMoreIcon />
              </TblTooltip>
            </TblIconButton>
        </Box>
      </Box>
      {open && <GradingList open={open} onClose={onClose} />}
    </>
  );
}
export const StudentInfoMemo = React.memo(
  (props) => <StudentInfo {...props} />,
  (prev, next) => (
      isEqual(prev.gradingList, next.gradingList) ||
      isEqual(prev.studentSelected, next.studentSelected)
    )
);

export default StudentInfoMemo;
