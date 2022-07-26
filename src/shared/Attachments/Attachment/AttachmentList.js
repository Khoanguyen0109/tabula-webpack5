import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import PreviewFile from 'components/PreviewFile';

import commonActions from 'shared/Common/actions';

import PropTypes from 'prop-types';

import AttachmentFile from './AttachmentFile';

const useStyles = makeStyles((theme) => ({
  root: {},
  scrollBar: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    //NOTE: maxheight: base on Item google file
  },
  emptyContent: {
    color: theme.newColors.gray[700],
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));
const commonSelector = (state) => state.Common;
function AttachmentList(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const { files, hasPermission, canDownload } = props;
  const [isVisiblePreviewFile, setIsVisiblePreviewFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { url, fileInformation } = useSelector(commonSelector);
  const togglePreviewFile = () => {
    setSelectedFile(null);
    setIsVisiblePreviewFile(!isVisiblePreviewFile);
    dispatch(
      commonActions.commonSetState({
        openPreview: false,
      })
    );
  };
  const onPreviewFiles = (item) => {
    setIsVisiblePreviewFile(true);
    setSelectedFile(item);
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
  const onDownload = (e, item) => {
    e.stopPropagation();
    const payload = {
      filename: item.filename,
      originalname: item.originalName,
      mimetype: item.mimetype,
    };
    dispatch(
      commonActions.download({
        param: payload,
      })
    );
  };
  const onRemove = (e, item) => {
    e.stopPropagation();
    props.onRemove(item);
  };
  return (
    // <PerfectScrollbar className={classes.scrollBar}>
    <Box>
      {files.length <= 0 ? (
        <Typography className={classes.emptyContent} variant='bodyMedium'>
          {t('no_attachments')}
        </Typography>
      ) : (
        files.map((item) => (
            <AttachmentFile
              item={item}
              onPreviewFiles={onPreviewFiles}
              hasPermission={hasPermission}
              onRemove={props.onRemove && onRemove}
              key={item.id}
              name={item.originalName}
              onDownload={canDownload && onDownload}
            />
          ))
      )}
      {isVisiblePreviewFile && (
        <PreviewFile
          currentFile={selectedFile}
          fileType={selectedFile?.mimetype}
          url={url || ''}
          isFullScreen
          fileName={selectedFile?.originalName || ''}
          onClose={togglePreviewFile}
          fileInformation={fileInformation}
        />
      )}
    </Box>
    // </PerfectScrollbar>
  );
}

AttachmentList.propTypes = {
  canDownload: PropTypes.bool,
  disableUseTemplate: PropTypes.func,
  files: PropTypes.array,
  hasPermission: PropTypes.bool,
  itemOnView: PropTypes.number,
  onChangeChooseTemplate: PropTypes.func,
  onRemove: PropTypes.func,
  onUseTemplate: PropTypes.func,
  useTemplateLoading: PropTypes.bool,
};

AttachmentList.defaultProps = {
  files: [],
  itemOnView: 4,
};

export default AttachmentList;
