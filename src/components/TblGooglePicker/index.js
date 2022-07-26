import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Add from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import TblButton from 'components/TblButton';

import googleActions from 'shared/Google/actions';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import { GOOGLE_ACTION } from '../../shared/Google/constants';
import {
  formatGoogleFile /* getGoogleToken */,
} from '../../shared/Google/utils';
import { LOCAL_STORAGE, MAX_GOOGLE_UPLOAD_FILES } from '../../utils/constants';

const useStyles = makeStyles((theme) => ({
  // addBtn: {
  //   padding: 0,
  //   marginLeft: theme.spacing(1),
  //   marginRight: theme.spacing(1),
  //   border: '1.5px dashed',
  //   borderColor: theme.newColors.gray[400],
  //   height: theme.spacing(5),
  //   width: theme.spacing(5),
  //   borderRadius: theme.borderRadius.default,
  //   '&:hover': {
  //     borderRadius: theme.borderRadius.default,
  //   },
  // },
  button: {
    width: theme.spacing(10.5),
  },

  addIcon: {
    color: theme.newColors.gray[400],
  },

  disabled: {
    pointerEvents: 'none',
    backgroundColor: theme.newColors.gray[200],
  },
}));

function TblGooglePicker(props) {
  const { hasPermission, onChange, maxItemCanBeSelected, children, disabled } =
    props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [authGoogle, setAuthGoogle] = useState(false);
  const { t } = useTranslation();
  const getGoogleOauthUrlSuccess = useSelector(
    (state) => state.Google.getGoogleOauthUrlSuccess
  );
  const getGoogleOauthUrlFailed = useSelector(
    (state) => state.Google.getGoogleOauthUrlFailed
  );
  const getGoogleTokenSuccess = useSelector(
    (state) => state.Google.getGoogleTokenSuccess
  );

  const onAction = useSelector((state) => state.Google.onAction);

  const googleOauthUrlSuccess = useSelector(
    (state) => state.Google.googleOauthUrlSuccess
  );

  const createPicker = () => {
    const google = window.google;
    // const uploadView = new google.picker.DocsUploadView();
    const view = new google.picker.DocsView().setOwnedByMe(true);
    var picker = new google.picker.PickerBuilder()
      // .addViewGroup(
      //   new google.picker.ViewGroup(google.picker.ViewId.DOCS)
      //     .addView(google.picker.ViewId.DOCUMENTS)
      //     .addView(google.picker.ViewId.PRESENTATIONS)
      // )
      // .addView(uploadView)
      // .addView(google.picker.ViewId.DOCUMENTS)
      // .addView(google.picker.ViewId.PRESENTATIONS)
      // .addView(google.picker.ViewId.SPREADSHEETS)
      .addView(view)
      .setMaxItems(maxItemCanBeSelected <= 0 ? -1 : maxItemCanBeSelected)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setOAuthToken(localStorage.getItem(LOCAL_STORAGE.GOOGLE_ACCESS_TOKEN)) //access token fetched from server
      .setDeveloperKey(process.env.REACT_APP_GOOGLE_DRIVE_API_KEY)
      .setCallback((e) => {
        dispatch(
          googleActions.googleSetState({
            getGoogleTokenSuccess: null,
            googleOauthUrlSuccess: null,
          })
        );
        setAuthGoogle(false);
        if (e.action === 'picked') {
          const docs = e.docs.map((doc) => formatGoogleFile(doc));
          onChange(docs);
        }
      })
      .build();
    picker.setVisible(true);
  };
  const openGooglePicker = () => {
    const domain = window.location.hostname.split('.');
    return dispatch(
      googleActions.getGoogleToken({
        urlParams: {
          redirectUrl: `${window.location.origin}/google-oauth?subdomain=${domain[0]}`,
        },
        messageOauthPopup: t('google:oauth_google_message'),
        onAction: GOOGLE_ACTION.PICKER,
      })
    );
  };

  useEffect(() => {
    //Listen from refresh the access token
    if (
      (getGoogleTokenSuccess || googleOauthUrlSuccess) &&
      onAction === GOOGLE_ACTION.PICKER
    ) {
      setAuthGoogle(true);
    }
    return () => {
      dispatch(
        googleActions.googleSetState({
          googleOauthUrlSuccess: null,
          getGoogleOauthUrlSuccess: null,
          getGoogleOauthUrlFailed: null,
          getGoogleTokenSuccess: null,
        })
      );
    };
  }, [
    googleOauthUrlSuccess,
    getGoogleOauthUrlSuccess,
    getGoogleOauthUrlFailed,
    getGoogleTokenSuccess,
    dispatch,
    onAction,
  ]);
  useEffect(() => {
    if (authGoogle && window.google) {
      createPicker();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authGoogle]);

  return (
    <>
      {children ? (
        <span onClick={() => !disabled && openGooglePicker()}>{children}</span>
      ) : (
        <>
          {!disabled && (
            <Box display={'flex'} alignItems='center'>
              <TblButton
                variant='outlined'
                className={clsx(classes.button)}
                disabled={
                  maxItemCanBeSelected <= 0 || !hasPermission || disabled
                }
                color='primary'
                onClick={() => !disabled && openGooglePicker()}
                startIcon={<Add />}
              >
                {t('common:add')}
              </TblButton>
              <Typography ml={2} variant='bodyMedium'>
                {t('common:additional_information', {
                  max: MAX_GOOGLE_UPLOAD_FILES,
                })}
              </Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
}

TblGooglePicker.propTypes = {
  children: PropTypes.any,
  disabled: PropTypes.bool,
  hasPermission: PropTypes.bool,
  isEmptyList: PropTypes.bool,
  maxItemCanBeSelected: PropTypes.number,
  onChange: PropTypes.func,
};

export default TblGooglePicker;
TblGooglePicker.defaultProps = {
  isEmptyList: true,
  hasPermission: true,
  disabled: false,
};
