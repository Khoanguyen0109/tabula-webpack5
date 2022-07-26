import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblDialog from 'components/TblDialog';
import TblIconButton from 'components/TblIconButton';
import UserInfoCard from 'components/TblSidebar/UserInfoCard';

import { getStatusStudentSubmission } from 'modules/MyCourses/utils';
import PropTypes from 'prop-types';
import { setUrlParam } from 'utils';

import GraderActions from '../../actions';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialogTitle-root': {
      '& .MuiTypography-root': {
        fontSize: `${theme.fontSize.xMedium }!important`,
      },
    },

    '& .closeButton': {
      top: theme.spacing(1.5),
    },
  },
  wrapperItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: theme.spacing(10),
  
  },
  info: {
    width: '85%',
  },
  iconBtn: {
    '& .MuiSvgIcon-root': {
      color: theme.newColors.gray[900],
    },
  },
}));
function GradingList(props) {
  const classes = useStyles();
  const { open, onClose } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation('grader');
  const gradingList = useSelector((state) => state.Grader.gradingList);

  const onSelectStudent = (item) => {
      dispatch(GraderActions.graderSetState({
          studentSelected: item.studentId, 
          shadowAssignmentId: item.shadowAssignmentId
          
      }));
      setUrlParam(location, history, {studentId: item.studentId });
      onClose();
  };
  return (
    <TblDialog
      open={open}
      title={t('grading_list')}
      hasCloseIcon={true}
      className={classes.root}
      onClose={onClose}
    >
      {gradingList.length>0 && gradingList.map((item) => (
            <Box className={classes.wrapperItem} onClick={ () => onSelectStudent(item)}>
              <Box className={classes.info} >
              <UserInfoCard
                itemInfo={{ name: item.name }}
status={getStatusStudentSubmission( t , item.status)}
              />
              </Box>
         
              <TblIconButton className={classes.iconBtn}>
                <ArrowForwardIosIcon />
              </TblIconButton>
            </Box>
          )
      )}
    </TblDialog>
  );
}

GradingList.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};

export default GradingList;
