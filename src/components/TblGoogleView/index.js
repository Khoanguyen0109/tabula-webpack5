import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Box, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';

import googleActions from 'shared/Google/actions';

import PropTypes from 'prop-types';

import { useAuthDataContext } from '../../AppRoute/AuthProvider';
import { GOOGLE_ACTION } from '../../shared/Google/constants';
import useDidMountEffect from '../../utils/customHook/useDidMoutEffect';

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    width: '100%',
  },
}));
function TblGoogleView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { currentUser } = useAuthDataContext();
  const { sourceId, url } = props;
  const dispatch = useDispatch();
  const loadingFile = useSelector((state) => state.Google.loadingFile);
  const [iframeSrc, setIframeSrc] = useState(url);

  const googleFile = useSelector((state) => state.Google.googleFile);
  const onAction = useSelector((state) => state.Google.onAction);

  const getGoogleFileSuccess = useSelector(
    (state) => state.Google.getGoogleFileSuccess
  );
  const getGoogleFileFailed = useSelector(
    (state) => state.Google.getGoogleFileFailed
  );
  const googleOauthUrlSuccess = useSelector(
    (state) => state.Google.googleOauthUrlSuccess
  );
  const getGoogleTokenSuccess = useSelector(
    (state) => state.Google.getGoogleTokenSuccess
  );

  const jsonp = (opts = {}) => {
    try {
      opts.url = `${opts.url}?jsonpCallback=${opts.callback}`;

      for (let key in opts.data) {
        if (opts.data.hasOwnProperty(key)) {
          opts.url += `&${key}=${opts.data[key]}`;
        }
      }

      const script = document.createElement('script');
      script.src = opts.url;

      script.onload = () => {
        document.body.removeChild(script);
      };

      document.body.appendChild(script);
    } catch (error) {
    }
  };

  window.getData = (data) => {
    window.email = data;
  };

  const checkfile = () => {
    try {
      jsonp({
        url: process.env.REACT_APP_GOOGLE_APP_SCRIPT_URL,
        callback: 'getData',
      });
      setTimeout(() => {
        //NOTE: check if have right user on browser
        if (
          !window.email ||
          (currentUser.connectors[0] &&
            window.email !== currentUser.connectors[0].email)
        ) {
          dispatch(
            googleActions.googleSetState({
              openOauthPopup: true,
              messageOauthPopup: t('google:oauth_google_message'),
            })
          );
          // }
        } else {
          dispatch(
            googleActions.getGoogleToken({
              messageFailed: t('google:oauth_google_message'),
            })
          );
        }
        dispatch(
          googleActions.googleSetState({
            loadingFile: false,
          })
        );
      }, 3000);
    } catch (error) {
    }
  };

  useEffect(() => {
    setIframeSrc('about:blank');
    dispatch(
      googleActions.getGoogleFile({
        fileId: sourceId,
        loadingFile: true,
      })
    );
  }, [dispatch, sourceId, url]);

  useDidMountEffect(() => {
    if (googleFile && sourceId === googleFile.id) {
      if (getGoogleFileSuccess) {
        setIframeSrc(url);
        dispatch(
          googleActions.googleSetState({
            // fileId: sourceId,
            loadingFile: false,
          })
        );
      }
      if (getGoogleFileFailed) {
        checkfile();
      }
    }
    return () => {};
  }, [dispatch, getGoogleFileFailed, getGoogleFileSuccess, googleFile]);

  useDidMountEffect(() => {
    if (
      (getGoogleTokenSuccess || googleOauthUrlSuccess) &&
      sourceId === googleFile?.id
    ) {
      switch (onAction) {
        case GOOGLE_ACTION.VIEW:
          setIframeSrc(url);
          break;
        default:
          break;
      }
    }
    return () => {};
  }, [getGoogleTokenSuccess, googleFile, onAction, googleOauthUrlSuccess]);

  return loadingFile ? (
    <Box
      className={classes.container}
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <CircularProgress color='inherit' />
    </Box>
  ) : (
    <iframe
      title='google_frame'
      src={`${iframeSrc }&embedded=true`}
      className={classes.container}
     />
  );
}

TblGoogleView.propTypes = {
  sourceId: PropTypes.string,
  url: PropTypes.string,
};

export default TblGoogleView;
