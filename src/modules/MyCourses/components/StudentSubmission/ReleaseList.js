import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import isNil from 'lodash/isNil';

import { Box, Skeleton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import TblButton from 'components/TblButton';
import TblCheckbox from 'components/TblCheckBox';
import TblCheckboxWithLable from 'components/TblCheckBox/CheckBoxWithLabel';
import TblDialog from 'components/TblDialog';
import UserInfoCard from 'components/TblSidebar/UserInfoCard';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';

import { useAuthDataContext } from 'AppRoute/AuthProvider';
import myCoursesAction from 'modules/MyCourses/actions';
import { getStatusStudentProgressFilter } from 'modules/MyCourses/utils';
import PropTypes from 'prop-types';
const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      //   padding: 0,
      //   marginRight: theme.spacing(1.25),
    },
  },
  selectAll: {
    width: theme.spacing(60),
    marginLeft: theme.spacing(0.5),
    marginTop: theme.spacing(3),
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: theme.spacing(10),
  },
}));

function ReleaseList(props) {
  const { sectionSelected, open, onClose } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  const authContext = useAuthDataContext();
  const {
    currentUser: { organizationId },
  } = authContext;
  const location = useLocation();
  const { courseId } = useParams();
  const [selectList, setSelectList] = useState([]);

  const releaseListStudentSubmission = useSelector(
    (state) => state.MyCourses.releaseListStudentSubmission
  );
  const currentTermId = useSelector((state) => state.MyCourses.currentTermId);

  const releaseList =
    releaseListStudentSubmission?.filter(
      (item) =>
        !item.isPublish && !isNil(item.overallGrade)
    ) ?? [];
  const [selectStudentIds, setSelectStudentIds] = useState([]);

  const urlSearchParams = new URLSearchParams(location.search);
  let unitId = urlSearchParams?.get('unitId');
  let id = urlSearchParams?.get('id');

  const onSelectAll = () => {
    if (releaseList && selectList.length !== releaseList.length) {
      const allId = releaseList.map((item) => item.assignmentSubmissionId);
      const allStudentId = releaseList.map((item) => item.studentId);
      setSelectStudentIds(allStudentId);
      return setSelectList(allId);
    }
    setSelectStudentIds([]);
    return setSelectList([]);
  };

  const onSelect = (item) => {
    if (selectList.includes(item.assignmentSubmissionId)) {
      setSelectStudentIds(
        selectStudentIds.filter((studentId) => studentId !== item.studentId)
      );
      return setSelectList(
        selectList.filter((t) => t !== item.assignmentSubmissionId)
      );
    }
    setSelectStudentIds([...selectStudentIds, item.studentId]);
    return setSelectList([...selectList, item.assignmentSubmissionId]);
  };

  const onRelease = () => {
    dispatch(
      myCoursesAction.releaseGradeStudentSubmission({
        courseId,
        listAssignmentSubmissionIds: selectList,
        selectedPublicStudentIds: selectStudentIds,
        currentTermId
      })
    );
    onClose();
  };

  useEffect(() => {
    dispatch(
      myCoursesAction.getReleaseListStudentSubmission({
        orgId: organizationId,
        courseId,
        unitId,
        assignmentId: id,
        urlParams: {
          sectionId: sectionSelected !== -1 ? sectionSelected : '',
          filter: getStatusStudentProgressFilter({ GRADED: true }),
        },
        // reset state
        releaseListStudentSubmission: null,
        releaseGradeStudentSubmissionSuccess: null,
      })
    );
  }, [courseId, dispatch, id, open, organizationId, sectionSelected, unitId]);
  useDidMountEffect(() => {
    if (releaseListStudentSubmission) {
      onSelectAll();
    }
  }, [releaseListStudentSubmission]);
  return (
    <TblDialog
      title={t('grader:release_grades')}
      open={open}
      onClose={onClose}
      hasCloseIcon={true}
      className={classes.root}
      footer={
        <>
          <Box />
          <Box display='flex'>
            <Box mr={1}>
              <TblButton variant='outlined' color='primary' onClick={onClose}>
                {t('common:cancel')}
              </TblButton>
            </Box>
            <Box>
              <TblButton
                disabled={selectList.length === 0}
                variant='contained'
                color='primary'
                onClick={() => onRelease()}
              >
                {t('myCourses:release')}
              </TblButton>
            </Box>
          </Box>
        </>
      }
    >
      {!releaseListStudentSubmission ? (
        <Box>
          <Skeleton height={200} />
        </Box>
      ) : (
        <>
          {releaseList && releaseList.length !== 0 && (
            <Box className={classes.selectAll}>
              <TblCheckboxWithLable
                label={t('common:select_all')}
                checked={selectList.length === releaseList.length}
                onChange={onSelectAll}
              />
            </Box>
          )}
          <Box>
            {releaseList.length === 0 ? (
              <Box mt={3}>
                <Typography variant='bodyMedium'>
                  {t('myCourses:no_new_grade')}{' '}
                </Typography>
              </Box>
            ) : (
              releaseList.map((item) => {
                const selected = selectList.includes(
                  item.assignmentSubmissionId
                );
                return (
                  <Box className={classes.item}>
                    <Box display='flex' width='80%' alignItems='center'>
                      <TblCheckbox
                        checked={selected}
                        onChange={() => onSelect(item)}
                      />
                      <UserInfoCard
                        itemInfo={{ name: item.name, lastName: item.lastName }}
                      />
                    </Box>
                    <Typography sx={{ paddingRight: theme.spacing(2) }}>
                      {t('grader:graded_vs_total', {
                        graded: item.overallGrade,
                        total: item.totalPossiblePoints,
                      })}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Box>
        </>
      )}
    </TblDialog>
  );
}

ReleaseList.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  sectionSelected: PropTypes.number,
};

export default ReleaseList;
