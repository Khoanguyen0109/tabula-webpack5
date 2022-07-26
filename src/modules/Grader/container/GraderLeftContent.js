import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import PreviewFile from 'components/PreviewFile';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';
import useEventListener from 'utils/customHook/useEventListener';
import { checkKeyPressNotInTextArea } from 'utils/customHook/useEventListener';

import CommonActions from 'shared/Common/actions';

import { MEDIA_TYPES } from '../../../shared/Media/constants';
import useDownLoadGoogleFile from '../../../utils/customHook/useDownLoadGoogleFile';
import PreviewFileToolBar from '../components/LeftContent/PreviewFileToolBar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // height: '100%',
    height: theme.spacing(104),
    // maxHeight: theme.spacing(104),
    overflow: 'hidden',
    border: '1px solid #E9ECEF',
    borderRadius: theme.borderRadius.default,
  },
  previewFileContainer: {
    width: '100%',
    height: `calc(100% - ${theme.spacing(7)})`,
  },
}));
const commonSelector = (state) => state.Common;

function GraderLeftContent() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { url, fileInformation } = useSelector(commonSelector);
  const attemptSelected =
    useSelector((state) => state.Grader.attemptSelected) || {};
  const [selectedAttachment, setSelectedAttachment] = useState();
  const downloadGoogleFile = useDownLoadGoogleFile(selectedAttachment);
  const indexOfFileSelected =
    attemptSelected?.studentSubmittedFiles?.findIndex(
      (f) => f?.id === selectedAttachment?.id
    ) + 1 || 0;
  const [fullScreen, setFullScreen] = useState(false);

  const onFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  const handleKey = (e) => {
    const { key } = e;
    if (!checkKeyPressNotInTextArea(e)) {
      return;
    }
    const KEY_LEFT = ['65', 'a'];
    const KEY_RIGHT = ['68', 'd'];
    if (KEY_LEFT.includes(String(key))) {
      onPreviousPreViewFile();
    }
    if (KEY_RIGHT.includes(String(key))) {
      onNextPreViewFile();
    }
  };
  useEventListener('keydown', handleKey);
  useEffect(() => {
    if (
      attemptSelected?.studentSubmittedFiles?.length > 0 &&
      attemptSelected.studentSubmittedFiles[0].id
    ) {
      return setSelectedAttachment(attemptSelected.studentSubmittedFiles[0]);
    }
    setSelectedAttachment(null);
    dispatch(
      CommonActions.getLinkToViewFailed({
        url: null,
        fileInformation: null,
        isFetchingFile: false,
      })
    );
  }, [attemptSelected.studentSubmittedFiles, dispatch]);
  useDidMountEffect(() => {
    if (selectedAttachment) {
      const payload = {
        filename: selectedAttachment.filename,
        originalname: selectedAttachment.originalName,
        mimetype: selectedAttachment.mimetype,
      };
      dispatch(
        CommonActions.getLinkToView({ param: payload, isFetchingFile: true })
      );
    }
  }, [selectedAttachment]);

  const onNextPreViewFile = () => {
    const index = attemptSelected?.studentSubmittedFiles?.findIndex(
      (f) => f?.id === selectedAttachment?.id
    );
    if (attemptSelected?.studentSubmittedFiles[index + 1]) {
      setSelectedAttachment(attemptSelected?.studentSubmittedFiles[index + 1]);
    }
  };
  const onPreviousPreViewFile = () => {
    const index = attemptSelected?.studentSubmittedFiles?.findIndex(
      (f) => f?.id === selectedAttachment?.id
    );
    if (attemptSelected?.studentSubmittedFiles[index - 1]) {
      setSelectedAttachment(attemptSelected?.studentSubmittedFiles[index - 1]);
    }
  };

  const downloadFile = () => {
    if (selectedAttachment.mediaType !== MEDIA_TYPES.GOOGLE_DRIVE_FILE) {
      const payload = {
        filename: selectedAttachment.filename,
        originalname: selectedAttachment.originalName,
        mimetype: selectedAttachment.mimetype,
      };
      dispatch(CommonActions.download({ param: payload }));
    } else {
      downloadGoogleFile(selectedAttachment);
    }
  };

  return (
    <Box className={classes.root}>
      <PreviewFileToolBar
        downloadFile={downloadFile}
        onFullScreen={onFullScreen}
        file={selectedAttachment}
        onNext={onNextPreViewFile}
        onPrevious={onPreviousPreViewFile}
        indexOfFileSelected={indexOfFileSelected}
      />
      <Box className={classes.previewFileContainer}>
        <PreviewFile
          currentFile={selectedAttachment}
          fileType={fileInformation?.mimetype ?? null}
          url={url}
          isFullScreen={fullScreen}
          onClose={onFullScreen}
          fileName={fileInformation?.originalname ?? null}
          onNext={onNextPreViewFile}
          onPrevious={onPreviousPreViewFile}
          fileInformation={fileInformation}
        />
      </Box>
    </Box>
  );
}

export default GraderLeftContent;
