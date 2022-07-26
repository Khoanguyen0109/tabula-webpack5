import React from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import TblButton from 'components/TblButton';
import TblUploadIcon from 'components/TblUploadIcon';

import { ReactComponent as UploadIcon } from 'assets/images/icn_upload.svg';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';

import ListUploading from './ListUploading';
import styles from './uploadStyled';

const headers = {
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
};
const UPLOAD_URL = `${process.env.REACT_APP_API_URL}/upload`;

function InnerDropZone({ classes, t, drag, ...props }) {
  const { getRootProps, getInputProps } = useDropzone({
    noDragEventsBubbling: true,
    noDrop: true,
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
      className={clsx(classes.box, { [classes.drag]: drag })}
    >
      {' '}
      {/* Dropzone area */}
      <div>
        <input {...getInputProps()} />
        <TblUploadIcon />
        <Typography variant='labelLarge'>{t('Drag & Drop to Upload')}</Typography>
        <span>
          <p>Or</p>
        </span>
        <TblButton color='primary' variant='contained'>
          {t('choose_file')}
        </TblButton>
        <span>
          <ErrorOutlineIcon fontSize='inherit' />{' '}
          <p> {t('Maximum upload file size is 100MB.')}</p>
        </span>
      </div>
    </Box>
  );
}
InnerDropZone.propTypes = {
  classes: PropTypes.object,
  drag: PropTypes.bool,
  t: PropTypes.func,
};
class Upload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      drag: false,
      uploading: {},
    };
    this.worker = new Worker(new URL('workers/upload.worker.js', import.meta.url));
    this.worker.onmessage = (e) => {
      const payload = e.data;
      const { uploading } = this.state;
      if (uploading && uploading[payload.uid]) {
        const file = uploading[payload.uid];
        delete payload.file;
        if (payload.event === 'progress') {
          file.percent = payload.percent;
        } else if (payload.event === 'success') {
          if (this.props.fetchMedia) {
            this.props.fetchMedia();
          }
        } else if (payload.event === 'error') {
          // Need handle error code
        }
        uploading[payload.uid] = file;
        this.setState({ uploading: { ...uploading } });
      }
    };
  }

  handleUpload = (acceptedFiles) => {
    const { uploading } = this.state;
    for (let i = 0; i < acceptedFiles.length; i++) {
      if (acceptedFiles[i].size / (1024 * 1024) >= 100) {
        continue;
      }
      acceptedFiles[i].uid = nanoid();
      acceptedFiles[i].percent = 0;
      setTimeout(() => {
        this.worker.postMessage({
          file: acceptedFiles[i],
          filename: 'file',
          uid: acceptedFiles[i].uid,
          headers,
          action: UPLOAD_URL,
        });
      }, 0);
      uploading[acceptedFiles[i].uid] = acceptedFiles[i];
    }
    this.setState({ drag: false });
  };

  removeUploadedItem = (key) => () => {
    const { uploading } = this.state;
    delete uploading[key];
    this.setState({ uploading: { ...uploading } });
  };

  render() {
    const { accept, t, classes } = this.props;
    const { drag, uploading } = this.state;
    return (
      <Dropzone
        accept={accept}
        onDrop={this.handleUpload}
        onDragLeave={() => this.setState({ drag: false })}
        onDragEnter={() => this.setState({ drag: true })}
      >
        {({ getRootProps }) => (
          <Box
            display='flex'
            {...getRootProps()}
            className={clsx(classes.root, { [classes.drag]: drag })}
            alignContent='center'
            flexDirection='column'
            alignItems='top'
          >
            {!drag ? (
              <>
                <InnerDropZone
                  {...this.props}
                  drag={drag}
                  onDrop={this.handleUpload}
                />
                <ListUploading
                  list={uploading}
                  onRemove={this.removeUploadedItem}
                />
              </>
            ) : (
              <Box>
                <UploadIcon className={clsx(classes.svg, { drag })} />
                <Typography variant='labelLarge'>{t('Drop File to Upload')}</Typography>
              </Box>
            )}
          </Box>
        )}
      </Dropzone>
    );
  }
}
Upload.propTypes = {
  accept: PropTypes.string,
  classes: PropTypes.object,
  t: PropTypes.func,
  fetchMedia: PropTypes.func,
};

export default withStyles(styles)(Upload);
