import React, { useState } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { Box, Divider, Link, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblUploadIcon from 'components/TblUploadIcon';

import clsx from 'clsx';
import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import { downloadFile } from 'utils';

import {
  IMPORT_ERROR_CODE,
  IMPORT_FILE_TYPE,
  MAX_SIZE_FILE_IMPORT,
} from '../utils';

import ErrorUpload from './ErrorUpload';
import FileItem from './FileItem';

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(56),
  },
  dargWrapper: {
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    textAlign: 'center',
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(1.5),
    backgroundColor: theme.newColors.gray[50],
  },

  subText: {
    color: theme.newColors.gray[500],
  },
  link: {
    color: theme.newColors.primary[500],
  },
}));

function InnerDropZone(props) {
  const classes = useStyles();
  const { onDownLoadFile, disabled } = props;
  const { t } = useTranslation();
  const { getRootProps, getInputProps } = useDropzone({
    noDragEventsBubbling: true,
    noDrop: true,
    multiple: false,
    ...props,
  });
  return (
    <Box
      {...getRootProps()}
      display='flex'
      justifyContent='center'
      alignContent='center'
      alignItems='top'
      variant='outlined'
      className={clsx(classes.dargWrapper)}
    >
      {' '}
      {/* Dropzone area */}
      <div>
        <input {...getInputProps()} />
        <Typography variant='bodyMedium'>
          {t('importFile:template_guide')}
        </Typography>
        <Link
          component='button'
          variant='bodyMedium'
          className={classes.link}
          onClick={ (e) => onDownLoadFile(e) }
        >
          {t('importFile:download_template')}
        </Link>
        <Box my={3} px={10}>
          <Divider width='100%' />
        </Box>
        <TblUploadIcon disabled={disabled} />
        <Typography variant='labelLarge'>{t('Drag & Drop to Upload')}</Typography>
        <Box mb={3} mt={2}>
          <Typography variant='bodyMedium'>Or</Typography>
        </Box>
        <TblButton disabled={disabled} color='primary' variant='contained'>
          {t('common:choose_a_file')}
        </TblButton>
        <Box mt={1.5}>
          <Typography variant='titleMedium' className={classes.subText}>
            {t('common:accept_file_type', { fileType: 'xlsx only' })}
          </Typography>
        </Box>
        <Box>
          <Typography variant='titleMedium' className={classes.subText}>
            {t('common:maximum_upload_file', { size: '10MB' })}
          </Typography>
        </Box>
      </div>
    </Box>
  );
}
InnerDropZone.propTypes = {
  classes: PropTypes.object,
  drag: PropTypes.bool,
  t: PropTypes.func,
  onDownLoadFile: PropTypes.func,
  disabled: PropTypes.bool
};

function UploadFile(props) {
  const classes = useStyles();
  const { accept, file, onChangeFile , importTemplate } = props;
  const [drag, setDrag] = useState(false);
  const [errorCode, setErrorCode] = useState();
  const onValidateUpload = (files) => {
    const file = files[0];
    if (file.type !== IMPORT_FILE_TYPE) {
      return setErrorCode(IMPORT_ERROR_CODE.NOT_ACCEPTED_FILE);
    }
    if (file.size / (1024 * 1024) >= MAX_SIZE_FILE_IMPORT) {
      return setErrorCode(IMPORT_ERROR_CODE.OVER_SIZE_FILE);
    }
    setErrorCode(null);
    onChangeFile(file);
  };

  const onDownLoadFile = (e) => {
    e.stopPropagation();
    downloadFile(importTemplate);
  };

  const onRemoveFile = () => {
    onChangeFile(null);
  };
  return (
    <Box className={classes.root}>
      <Dropzone
        // disabled={!!file}
        accept={accept}
        onDrop={onValidateUpload}
        onDragLeave={() => setDrag(false)}
        onDragEnter={() => setDrag(true)}
      >
        {({ getRootProps }) => (
          <Box
            display='flex'
            {...getRootProps()}
            className={clsx(classes.root, { [classes.drag]: drag })}
            alignContent='center'
            flexDirection='column'
            alignItems='top'
            mb={2}
          >
            <InnerDropZone
              {...props}
              disabled={!!file}
              drag={drag}
              onDrop={onValidateUpload}
              onDownLoadFile={onDownLoadFile}
            />
          </Box>
        )}
      </Dropzone>
      {!isNil(errorCode) && <ErrorUpload errorCode={errorCode} />}
      {!isNil(file) && <FileItem file={file} onRemove={onRemoveFile} />}
    </Box>
  );
}

UploadFile.propTypes = {
  accept: PropTypes.bool,
  file: PropTypes.shape({
    size: PropTypes.number,
    type: PropTypes.string
  }),
  importTemplate: PropTypes.string,
  onChangeFile: PropTypes.func
};

export default UploadFile;
