import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import TurnOnNotificationImg from 'assets/images/img_turnonnotificaiton.png';
import { startOfToday } from 'date-fns';
import { add } from 'date-fns/esm';
import PropTypes from 'prop-types';

import { LOCAL_STORAGE } from '../../../utils/constants';
import { isGuardian, isStudent } from '../../../utils/roles';

const useStyles = makeStyles((theme) => ({
  turnOnButton: {
    backgroundColor: theme.customColors.primary1.main,
    '&:hover': {   
       backgroundColor: theme.customColors.primary1.main,
    }
  },
}));
function RequestNotificationDialog(props) {
  const classes = useStyles();
  const { t } = useTranslation('notification');

  const { open, onShowOrHideDialog, handleRequestNotificationPermission } =
    props;
  const authContext = useContext(AuthDataContext);
  const { currentUser } = authContext;

  const onLate = () => {
    localStorage.setItem(LOCAL_STORAGE.RE_REQUEST_NOTIFICATION_PERMISSION, add(startOfToday(), {days: 1}) ); //
    onShowOrHideDialog();
  };
  const renderBody = useMemo(() => 
     (
      <>
        <DialogContentText>
          <div>
            {isStudent(currentUser) &&
              t('notification:request_permission_student_content_1')}
            {isGuardian(currentUser) &&
              t('notification:request_permission_guardian_content_1')}
          </div>
          <div>
            {' '}
            {isStudent(currentUser) &&
              t('notification:request_permission_student_content_2')}
            {isGuardian(currentUser) &&
              t('notification:request_permission_guardian_content_2')}
          </div>
        </DialogContentText>{' '}
        <DialogContentText>
            {t('notification:click_allow_instruction')}
        </DialogContentText>
      </>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [currentUser]);
  return (
    <TblDialog
      open={open}
      subtitle={t('notification:request_permission_title')}
      onClose={onLate}
      hasCloseIcon={true}
      maxWidth='xs'
      header={
        <img className='img' src={TurnOnNotificationImg} alt='' width='100%' />
      }
      footer={
        <>
          <TblButton
            variant='outlined'
            color='primary'
            onClick={onLate}
          >
            {t('notification:later')}
          </TblButton>
          <TblButton
          className={classes.turnOnButton}
            variant='contained'
            color='primary'
            onClick={() => {
              handleRequestNotificationPermission();
            }}
          >
            {t('notification:turn_on_notification')}

          </TblButton>
        </>
      }
    >
      <Box className={classes.content}>{renderBody}</Box>
    </TblDialog>
  );
}

RequestNotificationDialog.propTypes = {
  handleRequestNotificationPermission: PropTypes.func,
  onShowOrHideDialog: PropTypes.func,
  open: PropTypes.bool,
};

export default RequestNotificationDialog;
