import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import TblDialog from 'components/TblDialog';

import googleActions from 'shared/Google/actions';

import ButtonGoogleSignIn from 'assets/images/btn_google_signin.png';
import loadScript from 'load-script';
import { isString } from 'lodash';
import PropTypes from 'prop-types';

import TblButton from '../../../components/TblButton';
import { GOOGLE_SUB_CODE } from '../constants';
import { setGoogleToken } from '../utils';
const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer +2,

    '& .MuiDialogContent-root': {
      paddingBottom: `${theme.spacing(1) }px !important`,
    }
  },
  btn: {
    // backgroundColor: '#4284F3',
    // color: 'white',
    marginBottom: theme.spacing(-1),
    padding: 0,
    height: theme.spacing(5),
    width: theme.spacing(22),
    '&:hover': {
      // backgroundColor: '#4284F3',
      color: 'white',
    },

    '& img': {
      width: '100%',
      height: '100%'
    }
  },
}));
const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';

let scriptLoadingStarted = false;

function GoogleEventListener(props) {
  const { t } = useTranslation('google', 'error');
  const classes = useStyles();
  const dispatch = useDispatch();
  const openOauthPopup = useSelector((state) => state.Google.openOauthPopup);
  const messageOauthPopup = useSelector((state) => state.Google.messageOauthPopup);

  const googleOauthUrlSuccess = useSelector((state) => state.Google.googleOauthUrlSuccess);

  const domain = window.location.hostname.split('.');
  const OauthGoogle = () => {
    dispatch(
      googleActions.getGoogleOauthUrl({
        urlParams: {
          redirectUrl: `${window.location.origin}/google-oauth?subdomain=${domain[0]}&rollback=${window.location.href}`,
        },
      })
    );
  };
  const onApiLoad = () => {
    try {
      window.gapi.load('picker');
    } catch (error) {
    }
  };

  const setOpenState = (bool, message ='') => {
    dispatch (googleActions.googleSetState({
      openOauthPopup: bool,
      messageOauthPopup: message
    }));

  };
  
  useEffect(() => {
    if (!!window.gapi) {
      onApiLoad();
    } else if (!scriptLoadingStarted) {
      scriptLoadingStarted = true;
      loadScript(GOOGLE_SDK_URL, onApiLoad);
    }

    window.addEventListener('message', function (event) {
      if (event.origin === window.location.origin && isString( event.data)) {
        try {
          const data = JSON.parse(event.data);
          if (data.googleAccessToken) {
            const { googleAccessToken, expiryDate } = data;
            // setOpenErrorPopup(false);
            dispatch(googleActions.googleSetState({
              googleOauthUrlSuccess: true,
            }));
            return setGoogleToken(googleAccessToken, expiryDate);
          }
          if (data.subCode) {
            switch (data.subCode) {
              case GOOGLE_SUB_CODE.NOT_ENOUGH_PERMISSION: {
                return setOpenState(true ,t('missing_permission_message'));
              }
              case GOOGLE_SUB_CODE.EMAIL_MISS_MATCH: {
                const connectedEmail = data.connectedEmail
                  ? data.connectedEmail
                  : '';
                return setOpenState(true , t('miss_match_email_message', { email: connectedEmail })) ;
              }
              case GOOGLE_SUB_CODE.ACCOUNT_ALREADY_EXISTS: {
                return setOpenState(true , t('account_already_exists_message'));
              }
              default:
                return setOpenState(false);
            }
          }
        } catch (error) {
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(googleOauthUrlSuccess){
      setOpenState(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleOauthUrlSuccess]);

  return (
    <>
      <TblDialog
        open={openOauthPopup}
        title={t('connect_an_account')}
        className={classes.root}
        onClose={() => {
          setOpenState(false);
        }}
        showScrollBar={false}
        hasCloseIcon={true}
      >
        <Box mt={3}>
        <Typography variant='bodyMedium'>{messageOauthPopup}</Typography>
        <Box mt={3} mb textAlign='center'>
          <TblButton className={classes.btn} onClick={OauthGoogle}>
             <img src={ButtonGoogleSignIn} alt='course_day_select_demo' />
          </TblButton>

        </Box>
        </Box>
   
      </TblDialog>

      {props.children}
    </>
  );
}

GoogleEventListener.propTypes = {
  children: PropTypes.node,
};

export default GoogleEventListener;
