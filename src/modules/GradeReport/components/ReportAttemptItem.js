import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import PreviewFile from 'components/PreviewFile';
import TblButton from 'components/TblButton';

import { formatDateTime } from 'utils/time';

import commonActions from 'shared/Common/actions';

import PropTypes from 'prop-types';
import { getNumberWithOrdinal } from 'utils';

import AttemptFile from './AttemptFile';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',

    gap: theme.spacing(2),
  },
  navigation: {
    position: 'relative',
    // marginLeft: theme.spacing(0.5),
    height: theme.spacing(5.5),
    width: '7px',
    borderLeft: `1px solid ${ theme.newColors.gray[400]}`,
    '&::before': {
      position: 'absolute',
      display: 'block',
      top: '17px',
      right: '3px',
      content: '""',
      width: '7px',
      height: '7px',
      border: '1px solid',
      borderColor: (props) => (props.selected ? '#1A7AE6' : '#868E96'),
      borderRadius: '50%',
    },
  },
  grade: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    border: '1px solid',
    minWidth: theme.spacing(4.1),
    borderColor: theme.newColors.gray[300],
    borderRadius: theme.borderRadius.default,
    height: theme.spacing(4),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),

    textAlign: 'center',
  },
  fileBtn: {
    color: 'white',
    fontSize: '12px',
    backgroundColor: theme.newColors.primary[500],
    padding: theme.spacing(0, 0.5),
    marginLeft: theme.spacing(1),
    minWidth: theme.spacing(4.2),
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.newColors.primary[50],
    },
  },
  dot: {
    height: theme.spacing(0.5),
    width: theme.spacing(0.5),
    borderRadius: '50%',
    backgroundColor: theme.newColors.gray[500],
    marginRight: theme.spacing(0.5),
  },
}));

const ReportAttemptItem = (props) => {
  const dispatch = useDispatch();
  const { attempt, attemptIndex, } = props;
  const files = attempt?.submittedFiles ?? [];
  const { publicFinalGrade, retake, makeup } = attempt;
  const attemptedAt = attempt?.attemptedAt ?? attempt.createdAt;

  const fileLength = attempt.submittedFiles?.length;
  const { t } = useTranslation('myCourses');
  const [showFile, setShowFile] = useState(false);
  const [fileSelected, setFileSelected] = useState('');

  const [isVisiblePreviewFile, setIsVisiblePreviewFile] = useState(false);

  const classes = useStyles({ fileLength });
  const commonSelector = (state) => state.Common;

  const { url, fileInformation } = useSelector(commonSelector);

  const previewFiles = (item) => {
    setIsVisiblePreviewFile(true);
    setFileSelected(item);
    const payload = {
      filename: item.filename,
      originalname: item.originalName,
      mimetype: item.mimetype,
    };
    dispatch(
      commonActions.getLinkToView({
        param: payload,
        isFetchingFile: true,
      })
    );
  };
  const togglePreviewFile = () => {
    setFileSelected(null);
    setIsVisiblePreviewFile(!isVisiblePreviewFile);
    dispatch(
      commonActions.commonSetState({
        openPreview: false,
      })
    );
  };
  return (
    <div>
      <div className={classes.root}>
        <div className={classes.navigation} />
        <Box className={classes.grade}>
          <Typography sx={{ margin: 'auto' }} variant='labelLarge'>
            {publicFinalGrade ?? '--'}
          </Typography>
        </Box>
        <Box sx={{ lineHeight: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='labelLarge'>
              {getNumberWithOrdinal(attemptIndex)}
            </Typography>
            {files.length > 0 && (
              <TblButton
                className={classes.fileBtn}
                onClick={() => setShowFile(!showFile)}
              >
                {files.length} {t('media:file', { count: files.length })}
              </TblButton>
            )}
            {retake && (
              <Box display='flex' alignItems='center' ml={1}>
                <div className={classes.dot} />
                <Typography variant='bodySmall'>{t('retake')}</Typography>
              </Box>
            )}
            {makeup && (
              <Box display='flex' alignItems='center' ml={1}>
                <div className={classes.dot} />
                <Typography variant='bodySmall'>{t('make_up')}</Typography>
              </Box>
            )}
          </Box>

          <Typography
            variant='bodySmall'
            className={classes.time}
            noWrap={true}
          >
            {formatDateTime(attemptedAt)}
          </Typography>
        </Box>
      </div>

      {showFile && (
        <>
          {files.map((file, index) => (
              <AttemptFile
                previewFiles={previewFiles}
                file={file}
                isLast={index === files.length - 1}
              />
            ))}
          {isVisiblePreviewFile && (
            <PreviewFile
              currentFile={fileSelected}
              fileType={fileSelected?.mimetype}
              url={url || ''}
              isFullScreen
              fileName={fileSelected?.originalName || ''}
              onClose={togglePreviewFile}
              fileInformation={fileInformation}
            />
          )}
        </>
      )}
    </div>
  );
};

ReportAttemptItem.propTypes = {
  attempt: PropTypes.shape({
    attemptedAt: PropTypes.string,
    createdAt: PropTypes.string,
    makeup: PropTypes.bool,
    publicFinalGrade: PropTypes.string,
    retake: PropTypes.bool,
    submittedFiles: PropTypes.array
  }),
  attemptIndex: PropTypes.number
};

export default ReportAttemptItem;
