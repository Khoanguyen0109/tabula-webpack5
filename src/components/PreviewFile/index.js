import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

import { isSafari } from 'utils/checkBrowser';
import { getMaterialIconByExt } from 'utils/getMaterialIconByExt';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { splitNameAndExtension } from 'utils';

import { isGoogleFileSupported } from '../../shared/Google/constants';
import { MEDIA_TYPES } from '../../shared/Media/constants';
import TblGoogleView from '../TblGoogleView';

import { FILE_TYPE } from './constants';
import useStyles from './styled';

function PreviewFile(props) {
  const {
    fileType,
    url,
    isFullScreen,
    fileName,
    currentFile,
    fileInformation,
  } = props;
  const { t } = useTranslation('common');
  const isFetchingFile = useSelector((state) => state.Common.isFetchingFile);
  const checkImage = /^image/;
  const classes = useStyles({ isFullScreen, fileType });
  const onClose = () => {
    const { onClose } = props;
    if (onClose) {
      onClose();
    }
  };

  const onPrevious = () => {
    if (props.onPrevious) {
      props.onPrevious(currentFile);
    }
  };

  const onNext = () => {
    if (props.onNext) {
      props.onNext(currentFile);
    }
  };

  const renderHeader = () => {
    const { isShowFilename } = props;
    if (isFullScreen || isShowFilename) {
      return (
        <div className={classes.previewHeader}>
          <div className='file-name text-ellipsis'>
            <div className='icon'>
              {getMaterialIconByExt(
                splitNameAndExtension(fileName),
                currentFile
              )}
            </div>
            <div className='data text-ellipsis'>
              {splitNameAndExtension(fileName, 'name')}
            </div>
            <div>{splitNameAndExtension(fileName, 'extension')}</div>
          </div>
          {isFullScreen && (
            <div className='icon-close' onClick={onClose}>
              <CloseOutlinedIcon fontSize='inherit' />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderControlButton = () => {
    const { disabledControlButton } = props;
    if (disabledControlButton || isFullScreen) return null;
    return (
      <>
        <div className={`${classes.controlIcon} left`} onClick={onPrevious}>
          <ArrowBackOutlinedIcon fontSize='inherit' />
        </div>
        <div className={`${classes.controlIcon} right`} onClick={onNext}>
          <ArrowForwardOutlinedIcon fontSize='inherit' />
        </div>
      </>
    );
  };

  const renderContent = (fileType) => {
    switch (true) {
      case isGoogleFileSupported(fileType) &&
        currentFile?.mediaType === MEDIA_TYPES.GOOGLE_DRIVE_FILE:
        return (
          <div className={classes.googleView}>
            <TblGoogleView
              url={currentFile.url}
              sourceId={currentFile.sourceId}
            />
          </div>
        );
      case !isGoogleFileSupported(fileType) &&
        currentFile?.mediaType === MEDIA_TYPES.GOOGLE_DRIVE_FILE:
        return (
          <div className={classes.centerHorizontalVertical}>
            <Box fontSize={18}>
              {t('no_preview')}
              {'. '}
              <span>
                <a
                  href={currentFile.url}
                  // eslint-disable-next-line react/jsx-no-target-blank
                  target='_blank'
                  rel='opener'
                >
                  {t('view_in_new_tab')}
                </a>{' '}
              </span>
            </Box>
          </div>
        );
      case fileType === FILE_TYPE.PDF:
        return (
          <div className={classes.centerHorizontalVertical}>
            <iFrame
              src={`${process.env.REACT_APP_API_URL}/view/${fileName}?key=${fileInformation?.filename}`} // to view pdf file with the right name
              className={classes.pdfArea}
            />
          </div>
        );
      case fileType === FILE_TYPE.AUDIO_MP3:
      case fileType === FILE_TYPE.AUDIO_MPEG:
      case fileType === FILE_TYPE.AUDIO_OGG:
        return (
          <div className={classes.centerHorizontalVertical}>
            <audio controls key={url}>
              <source src={url} type='audio/mpeg' />
              {t('no_support_audio_tag')}
            </audio>
          </div>
        );
      case fileType === FILE_TYPE.VIDEO_MP4:
      case fileType === FILE_TYPE.VIDEO_WEBM:
      case fileType === FILE_TYPE.VIDEO_OGG:
        return (
          <div className={classes.centerHorizontalVertical}>
            <video controls key={url}>
              <source src={url} type={fileType} />
              {t('no_support_video_tag')}
            </video>
          </div>
        );
      case checkImage.test(fileType) &&
        (isSafari() || !fileInformation?.mimetype.includes('tif')):
        return (
          <div className='image-area'>
            <img src={url} alt='' />
          </div>
        );
      default:
        return (
          <div className={classes.centerHorizontalVertical}>
            <Box fontSize={18}>{t('no_preview')}</Box>
          </div>
        );
    }
  };

  const renderNoAttachment = () => (
    <div className={classes.centerHorizontalVertical}>
      <Box fontSize={18}>{t('no_attachments')}</Box>
    </div>
  );
  const renderFetching = () => (
    <div className={classes.centerHorizontalVertical}>
      <Box fontSize={20}>
        <CircularProgress color='secondary' />
      </Box>
    </div>
  );

  const renderPreviewFile = () => (
    <>
      {renderHeader()}
      {renderControlButton()}
      {renderContent(fileType)}
    </>
  );

  return (
    <div className={clsx(classes.root, { [classes.fullScreen]: isFullScreen })}>
      {isFetchingFile
        ? renderFetching()
        : url !== ''
        ? renderPreviewFile()
        : renderNoAttachment()}
    </div>
  );
}

PreviewFile.propTypes = {
  disabledControlButton: PropTypes.bool,
  isShowFilename: PropTypes.bool,
  fileType: PropTypes.string,
  url: PropTypes.string,
  content: PropTypes.string,
  t: PropTypes.func,
  isFullScreen: PropTypes.bool,
  fileName: PropTypes.string,
  onClose: PropTypes.func,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  currentFile: PropTypes.object,
  fileInformation: PropTypes.object,
};

export default PreviewFile;
