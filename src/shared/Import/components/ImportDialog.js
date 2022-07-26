import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import withReducer from 'components/TblWithReducer';

import ImportActions from 'shared/Import/actions';

import { useAuthDataContext } from 'AppRoute/AuthProvider';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import ImportWorker from 'workers/import.worker';

import reducers from '../reducers';
import { IMPORT_STATE, IMPORT_STATUS } from '../utils';

import Imported from './Imported';
import Importing from './Importing';
import UploadFile from './UploadFile';

const headers = {
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
};

const INTERVAL_TIME_GET_LOG=5000;

const ImportDialog = (props) => {
  const { t } = useTranslation('importFile');
  const { open, onClose, importTemplate, importUrl, getImportQueue, accept } =
    props;
  const dispatch = useDispatch();
  const { currentUser } = useAuthDataContext();
  const { organizationId } = currentUser;
  const [importState, setImportState] = useState(IMPORT_STATE.UPLOAD_FILE);
  const [file, setFile] = useState();
  const uploadWorker = new ImportWorker();
  const importStatus = useSelector((state) => state.Import.importStatus);
  const importLogs = useSelector((state) => state.Import.importLogs);

  const importKey = useSelector((state) => state.Import.importKey);
  const onChangeFile = (file) => {
    setFile(file);
  };
  const onCloseImportDialog = () => {
    onClose();
    if (importState === IMPORT_STATE.IMPORT_SUCCESS) {
      setImportState(IMPORT_STATE.UPLOAD_FILE);
      setFile(null);
      dispatch(
        ImportActions.importSetState({
          importStatus: IMPORT_STATUS.START_IMPORT,
          importLogs: [],
          importKey: null,
        })
      );
    }
  };

  const handleUpload = () => {
    file.uid = nanoid();
    file.percent = 0;
    setTimeout(() => {
      uploadWorker.postMessage({
        file: file,
        filename: 'file',
        uid: file.uid,
        headers,
        action: importUrl,
      });
    }, 0);
  };

  const renderTitle = () => {
    switch (importState) {
      case IMPORT_STATE.UPLOAD_FILE:
        return t('import_from_file');
      // case IMPORT_STATE.UPLOADING:
      //   return `${t('media:uploading')}...`;
      case IMPORT_STATE.IMPORTING:
        return 'Importing...';
      case IMPORT_STATE.IMPORT_SUCCESS:
        return null;
      default:
        break;
    }
  };

  const renderContent = () => {
    switch (importState) {
      case IMPORT_STATE.UPLOAD_FILE:
        return (
          <UploadFile
            accept={accept}
            file={file}
            onChangeFile={onChangeFile}
            importTemplate={importTemplate}
          />
        );
      // case IMPORT_STATE.UPLOADING: {
      //   return <Uploading item={file} />;
      // }
      case IMPORT_STATE.IMPORTING:
        return <Importing />;
      case IMPORT_STATE.IMPORT_SUCCESS:
        return <Imported />;
      default:
        break;
    }
  };
  const renderFooter = () => {
    switch (importState) {
      case IMPORT_STATE.UPLOAD_FILE:
        return (
          <>
            <Box />
            <Box display='flex'>
              <TblButton variant='outlined' color='primary' onClick={onClose}>
                {t('common:cancel')}
              </TblButton>
              <Box mr={1} />
              <TblButton
                variant='contained'
                color='primary'
                onClick={handleUpload}
                disabled={!file}
              >
                {t('upload_and_import')}
              </TblButton>
            </Box>
          </>
        );
      // case IMPORT_STATE.UPLOADING:
      case IMPORT_STATE.IMPORTING: {
        return (
          <>
            <Box />
            <TblButton variant='outlined' color='primary' onClick={onClose}>
              {t('common:minimize')}
            </TblButton>
          </>
        );
      }
      case IMPORT_STATE.IMPORT_SUCCESS:
        return null;
      default:
        break;
    }
  };
  uploadWorker.onmessage = (e) => {
    const payload = e.data;
    if (file && file.uid) {
      delete payload.file;
      if (payload.event === 'progress') {
        setImportState(IMPORT_STATE.IMPORTING);
        dispatch(
          ImportActions.importSetState({
            importStatus: IMPORT_STATUS.PROCESSING,
          })
        );
      } else if (payload.event === 'success') {
        dispatch(
          ImportActions.importSetState({
            importStatus: IMPORT_STATUS.PROCESSING,
            importKey: payload.key,
          })
        );
      } else if (payload.event === 'error') {
        // Need handle error code
        dispatch(
          ImportActions.importSetState({
            importStatus: IMPORT_STATUS.DONE,
          })
        );
      }
      setFile(file);
    }
  };
  useEffect(() => {
    getImportQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (importStatus === IMPORT_STATUS.PROCESSING) {
        getImportQueue();
        setImportState(IMPORT_STATE.IMPORTING);
      }
    }, INTERVAL_TIME_GET_LOG);
    if (
      (importStatus === IMPORT_STATUS.DONE ||
        importStatus === IMPORT_STATUS.FAILED) &&
      importState === IMPORT_STATE.IMPORTING &&
      importKey
    ) {
      clearInterval(interval);
        dispatch(
          ImportActions.getImportQueueStudentAndGuardianProgress({
            orgId: organizationId,
            importKey: importKey,
          })
        );
      if (importLogs.length > 0) {
        setImportState(IMPORT_STATE.IMPORT_SUCCESS);

      }
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importStatus, importKey, importLogs]);

  return (
    <TblDialog
      open={open}
      hasCloseIcon
      maxWidth={'md'}
      onClose={onCloseImportDialog}
      showScrollBar={false}
      title={
        <Box textAlign='center' pl={2}>
          {renderTitle()}
        </Box>
      }
      footer={renderFooter()}
    >
      <Box>{renderContent()}</Box>
    </TblDialog>
  );
};

ImportDialog.propTypes = {
  accept: PropTypes.string,
  getImportQueue: PropTypes.func,
  imporTemplate: PropTypes.string,
  importTemplate: PropTypes.any,
  importUrl: PropTypes.string,
  onClose: PropTypes.func,
  onImport: PropTypes.func,
  open: PropTypes.bool,
};
ImportDialog.defaultProps = {
  accept: '',
};

const ImportDialogWithReducer = withReducer('Import', reducers)(ImportDialog);

export default ImportDialogWithReducer;
