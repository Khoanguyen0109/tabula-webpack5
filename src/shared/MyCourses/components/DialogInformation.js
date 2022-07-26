import React, { useCallback, useContext } from 'react';
// import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';

import { USER_BEHAVIOR } from 'shared/User/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import myCoursesActions from 'modules/MyCourses/actions';
import { setUrlParam } from 'utils';

function DialogInformation() {
  const dispatch = useDispatch();
  const { t } = useTranslation(['dialog, common']);
  const authContext = useContext(AuthDataContext);
  const {
    settings: { behavior },
  } = authContext.currentUser; 
  const history = useHistory();
  const location = useLocation();
  const dialogInformationState = useSelector((state) => state.AllCourses.dialogInformationState) ?? {};
  const { visible, messageKey ,values,components ,count } = dialogInformationState; 
  const urlSearchParams = new URLSearchParams(location.search);
  const active = urlSearchParams?.get('active');
  const toggleCloseDrawer = useCallback(() => {
    dispatch(
      myCoursesActions.myCoursesSetState({
        dialogInformationState: {}
      })
    );
    if (!behavior.includes(USER_BEHAVIOR.HAVE_PLANED) && active === 'unit_course_activities') {
      setUrlParam(location, history, { active: 'plan' }, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  return (
    <>
      <TblDialog
        open={visible}
        onClose={toggleCloseDrawer}
        fullWidth
        footer={
          <Box display='flex' flexDirection='row-reverse' width='100%'>
            <TblButton variant='contained' color='primary' onClick={toggleCloseDrawer}>{t('common:ok')}</TblButton>
          </Box>
        }
      > 
        <Trans
          i18nKey={messageKey}
          values={values|| {}}
          components={components||{}}
          count={count||''}
         />
      </TblDialog>
    </>
  );
}

DialogInformation.propTypes = {
 
};

DialogInformation.defaultProps = {

};

export default DialogInformation;
