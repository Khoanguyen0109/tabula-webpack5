import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import googleActions from 'shared/Google/actions';

import {
  GOOGLE_ACTION,
  GOOGLE_DOWNLOAD_MINE_TYPE,
  GOOGLE_FILES_SUPPORTED,
  isGoogleFileSupported,
} from '../../shared/Google/constants';

import { downloadFile2, objectToParams } from '..';

function useDownLoadGoogleFile(currentFile) {
  const { t } = useTranslation('google');
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const getGoogleTokenSuccess = useSelector(
    (state) => state.Google.getGoogleTokenSuccess
  );
  const googleOauthUrlSuccess = useSelector(
    (state) => state.Google.googleOauthUrlSuccess
  );

  const onAction = useSelector((state) => state.Google.onAction);

  const downloadGoogleFile = (file) => {
    setFile(file);
    return dispatch(
      googleActions.getGoogleToken({
        messageOauthPopup: t('oauth_google_message'),
        onAction: GOOGLE_ACTION.DOWNLOAD,
      })
    );
  };

  const downLoad = () => {
    const fileId = currentFile.sourceId;
    if (file && file.sourceId === currentFile.sourceId) {
      if (isGoogleFileSupported(currentFile.mimetype)) {
        const key = Object.keys(GOOGLE_FILES_SUPPORTED).find(
          (key) => GOOGLE_FILES_SUPPORTED[key] === currentFile.mimetype
        );
        const mineType = GOOGLE_DOWNLOAD_MINE_TYPE[key];
        const urlParams = {
          fields: '*',
          mimeType: mineType,
          alt: 'media',
        };
        downloadFile2(
          `${
            process.env.REACT_APP_GOOGLE_API
          }/files/${fileId}/export?${objectToParams(urlParams)} `,
          currentFile.originalName
        );
      } else {
        const urlParams = {
          fields: '*',
          alt: 'media',
        };
        downloadFile2(
          `${process.env.REACT_APP_GOOGLE_API}/files/${fileId}?${objectToParams(
            urlParams
          )} `,
          currentFile.originalName
        );
      }
      setFile(null);
      dispatch(
        googleActions.googleSetState({
          getGoogleTokenSuccess: null,
          googleOauthUrlSuccess: null,
        })
      );
    }
  };
  useEffect(() => {
    if (
      currentFile &&
      (getGoogleTokenSuccess || googleOauthUrlSuccess) &&
      onAction === GOOGLE_ACTION.DOWNLOAD
    ) {
      downLoad();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, getGoogleTokenSuccess, googleOauthUrlSuccess, onAction]);
  return downloadGoogleFile;
}
export default useDownLoadGoogleFile;
