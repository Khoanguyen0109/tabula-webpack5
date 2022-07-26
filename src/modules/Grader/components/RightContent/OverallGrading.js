import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblIconButton from 'components/TblIconButton';
import TblInputGrade from 'components/TblInputGrade';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';

import PropTypes from 'prop-types';

import GraderActions from '../../actions';

const useStyles = makeStyles((theme) => ({
  skeleton: {
    width: theme.spacing(36),
    height: theme.spacing(20),
  },
  root: {
    position: 'relative',
    // margin: 'auto',
    width: theme.spacing(36),
    height: theme.spacing(14.25),
    borderRadius: theme.borderRadius.default,
    overflow: 'hidden',
    // backgroundColor: '#3FC057'
    backgroundColor: (props) => (props.overallGrade ? '#3FC057' : '#CED4DB'),
    '&::before': {
      position: 'absolute',
      top: '-80px',
      right: '-110px',
      content: '""',
      backgroundColor: (props) => (props.overallGrade ? '#8DD99A' : '#E2E5E9'),
      borderRadius: '50%',
      width: theme.spacing(19.5),
      height: theme.spacing(19.5),
    },
    '&::after': {
      position: 'absolute',
      bottom: '-80px',
      left: '-100px',
      content: '""',
      backgroundColor: (props) => (props.overallGrade ? '#8DD99A' : '#E2E5E9'),
      borderRadius: '50%',
      width: theme.spacing(21.5),
      height: theme.spacing(21.5),
    },
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.default,
    overflow: 'hidden',
    '&::before': {
      zIndex: 1,
      position: 'absolute',
      top: '-50%',
      right: '-30%',
      content: '""',
      backgroundColor: (props) => (props.overallGrade ? '#B9E8C2' : '#EDF0F2'),
      borderRadius: '50%',
      width: theme.spacing(13.5),
      height: theme.spacing(13.5),
    },
    '&::after': {
      zIndex: 1,
      position: 'absolute',
      bottom: '-50%',
      left: '-30%',
      content: '""',
      backgroundColor: (props) => (props.overallGrade ? '#B9E8C2' : '#EDF0F2'),
      borderRadius: '50%',
      width: theme.spacing(15.5),
      height: theme.spacing(15.5),
    },
  },
  content: {
    width: '100%',
    height: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    textAlign: 'center',
    color: 'white',
  },
  overallGrade: {
    color: 'white',
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.semi,
  },
  hepper: {
    display: 'flex',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.normal,
    '& .MuiSvgIcon-root': {
      marginLeft: theme.spacing(0.6),
      fontSize: theme.spacing(1.8),
    },
  },
  iconBtn: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: 'white',
    zIndex: 1,
    color: (props) => (props.overallGrade ? '#3FC057' : '#CED4DB'),
    '&:hover:': {
      backgroundColor: 'white',
    },
  },
  grading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    '& .MuiFormControl-root': {
      width: theme.spacing(13),
      height: theme.spacing(5),
      marginRight: theme.spacing(1),
      '& .MuiInputBase-root': {
        paddingRight: 0,
      },
    },
    '& span': {
      color: theme.newColors.gray[800],
      fontWeight: theme.fontWeight.semi,
      fontSize: theme.fontSize.normal,
      marginBottom: theme.spacing(1),
    },
  },
}));
function OverallGrading(props) {
  const dispatch = useDispatch();
  const params = useParams();
  const graderDetail = useSelector((state) => state.Grader.graderDetail);
  const isFetchingGraderDetail = useSelector(
    (state) => state.Grader.isFetchingGraderDetail
  );
  const graderDetailOverallGrade = useSelector(
    (state) => state.Grader.graderDetail?.overallGrade
  );
  const { t } = useTranslation('grader');
  const overallGrade = useSelector((state) => state.Grader.overallGrade);
  const { totalPossiblePoints } = props;
  const isOverTime = useSelector((state) => state.Grader.isOverTime);
  const classes = useStyles({
    overallGrade: (overallGrade || overallGrade === 0) && !isOverTime,
  });
  const [openOverallGrading, setOpenOverallGrading] = useState(false);
  const [initialOverallGrade, setInitialOverallGrade] = useState(overallGrade);
  const [isDisableEdit, setIsDisableEdit] = useState(true);
  const [loading, setLoading] = useState(false);

  const onChange = (value) => {
    setInitialOverallGrade(value);
  };

  const onClose = () => {
    setOpenOverallGrading(!openOverallGrading);
    setInitialOverallGrade(overallGrade);
  };

  /// Init overall grade
  useDidMountEffect(() => {
    dispatch(
      GraderActions.graderSetState({
        overallGrade: graderDetailOverallGrade,
      })
    );
    setOpenOverallGrading(false);
    setLoading(false);
  }, [graderDetailOverallGrade]);

  useDidMountEffect(() => {
    setInitialOverallGrade(overallGrade);
  }, [overallGrade]);

  useDidMountEffect(() => {
    setIsDisableEdit(
      (!initialOverallGrade && initialOverallGrade !== 0) ||
        initialOverallGrade === overallGrade
    );
  }, [initialOverallGrade, overallGrade]);

  const onUpdateOverallGrade = async () => {
    setLoading(true);
    dispatch(
      GraderActions.graderSetState({
        inputGradeSuccess: null,
        attemptGradedId: null,
      })
    );
    dispatch(
      GraderActions.inputOverallGrade({
        courseId: params.courseId,
        shadowAssignmentId: graderDetail.shadowAssignmentId,
        progressId: graderDetail.id,
        data: {
          overallGrade: initialOverallGrade,
          studentId: graderDetail.studentId,
        },
      })
    );
  };

  return (
    isFetchingGraderDetail ? 
      <Skeleton className={classes.skeleton}/>
    :
    <Tooltip title={isOverTime ? t('can_not_edit_submission') : ''}>
      <Box className={classes.root}>
        <div className={classes.overlay} />
        <TblIconButton
          disabled={isOverTime}
          className={classes.iconBtn}
          onClick={onClose}
        >
          <EditIcon />
        </TblIconButton>
        <Box className={classes.content}>
          <Typography className={classes.overallGrade}>
            {t('overall_grade_on_total_point', {
              overallGrade: overallGrade ?? '--',
              totalPossiblePoints,
            })}
          </Typography>
          <Box className={classes.hepper}>
            <div>{t('overall_grade')}</div>
            <HelpOutlineIcon />
          </Box>
        </Box>
        <TblDialog
          open={openOverallGrading}
          title={t('overall_grade')}
          footer={
            <>
              <Box />
              <Box display='flex'>
                <Box mr={1}>
                  <TblButton
                    variant='outlined'
                    color='primary'
                    onClick={onClose}
                  >
                    {t('common:cancel')}
                  </TblButton>
                </Box>
                <Box>
                  <TblButton
                    variant='contained'
                    color='primary'
                    onClick={onUpdateOverallGrade}
                    disabled={isDisableEdit}
                    isShowCircularProgress={loading}
                  >
                    {t('common:update')}
                  </TblButton>
                </Box>
              </Box>
            </>
          }
        >
          <Box className={classes.grading}>
            <TblInputGrade
              value={initialOverallGrade}
              onChange={onChange}
              placeholder={t('input_grade')}
              totalPossiblePoints={totalPossiblePoints}
            />
            <span>{t('out_of_total_point', { totalPossiblePoints })}</span>
          </Box>
        </TblDialog>
      </Box>
    </Tooltip>
  );
}

OverallGrading.propTypes = {
  overallGrade: PropTypes.string,
  totalPossiblePoints: PropTypes.number,
};

export default OverallGrading;
