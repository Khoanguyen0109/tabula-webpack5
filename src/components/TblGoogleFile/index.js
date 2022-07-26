/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';

import googleActions from 'shared/Google/actions';

import PropTypes from 'prop-types';

import {
  GOOGLE_ACTION,
  GOOGLE_FILE_TYPE_SUPPORT_VIEW,
} from '../../shared/Google/constants';

import TblGoogleFileUIImprove from './TblGoogleFileUIImprove';

function TblGoogleFile(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    file,
    onUseTemplate,
  } = props;
  const { id, sourceId, icon, url } = file;
  const [open, setOpen] = useState(false);
  const googleFile = useSelector((state) => state.Google.googleFile);
  const onAction = useSelector((state) => state.Google.onAction);
  const googleOauthUrlSuccess = useSelector(
    (state) => state.Google.googleOauthUrlSuccess
  );
  const getGoogleTokenSuccess = useSelector(
    (state) => state.Google.getGoogleTokenSuccess
  );

  const openFile = () => {
    if (!GOOGLE_FILE_TYPE_SUPPORT_VIEW.includes(icon)) {
      return window.open(url);
    }
    dispatch(
      googleActions.getGoogleFile({
        fileId: sourceId,
        loadingFile: true,
      })
    );
    return setOpen(true);
  };

  const onUseFileAsTemplate = (id, sourceId) => {
    dispatch(
      googleActions.getGoogleToken({
        messageOauthPopup: t('google:oauth_google_message'),
        onAction: GOOGLE_ACTION.USE_AS_TEMPLATE,
        googleFile: {
          id: sourceId,
        },
      })
    );
  };

  const onClose = () => {
    setOpen(false);
    dispatch(
      googleActions.googleSetState({
        getGoogleFileSuccess: null,
        getGoogleFileFailed: null,
        googleOauthUrlSuccess: null,
        onAction: null,
        openOauthPopup: false,
        messageOauthPopup: '',
      })
    );
  };

  useDidMountEffect(() => {
    if (
      (getGoogleTokenSuccess || googleOauthUrlSuccess) &&
      sourceId === googleFile?.id
    ) {
      switch (onAction) {
        case GOOGLE_ACTION.USE_AS_TEMPLATE:
          onUseTemplate(id);
          break;
        default:
          break;
      }
    }
    return () => {};
  }, [getGoogleTokenSuccess, googleFile, onAction, googleOauthUrlSuccess]);

  return (
    <TblGoogleFileUIImprove
      openFile={openFile}
      open={open}
      onClose={onClose}
      // iframeSrc={iframeSrc}
      onUseFileAsTemplate={onUseFileAsTemplate}
      {...file}
      {...props}
    />
  );
}

TblGoogleFile.propTypes = {
  file: PropTypes.shape({
    icon: PropTypes.any,
    id: PropTypes.any,
    isTemplate: PropTypes.any,
    mineType: PropTypes.any,
    name: PropTypes.any,
    sourceId: PropTypes.any,
    url: PropTypes.any,
  }),
  hasPermission: PropTypes.bool,
  onChangeChooseTemplate: PropTypes.func,
  onOpenFullScreen: PropTypes.bool,
  onRemove: PropTypes.func,
  onUseTemplate: PropTypes.func,
};
TblGoogleFile.defaultProps = {
  hasPermission: true,
  onOpenFullScreen: true,
};

function TblGoogleFilePropsAreEqual(preFile, nextFile) {
  return (
    preFile.sourceId === nextFile.sourceId &&
    preFile.isTemplate === nextFile.isTemplate &&
    preFile.useTemplateLoading === nextFile.useTemplateLoading
  );
}
const TblGoogleFileMemo = React.memo(TblGoogleFile, TblGoogleFilePropsAreEqual);
export {TblGoogleFileMemo};
export default TblGoogleFile;
// export default TblGoogleFileMemo;
