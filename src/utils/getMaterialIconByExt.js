import React from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import HeadsetIcon from '@mui/icons-material/Headset';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

import { MEDIA_TYPES } from '../shared/Media/constants';

import { getExt } from './index';

export const getMaterialIconByExt = (filename , file) => {
  if(file.mediaType === MEDIA_TYPES.GOOGLE_DRIVE_FILE){
    return <img style={{width: '100%'}} src={file.iconLink} alt='doc-icon' />;
  }
  const ext = getExt(filename);
  switch (ext) {
    case 'jpg':
    case 'png':
    case 'bmp':
    case 'jpeg':
    case 'ico':
    case 'sgv':
      return <ImageOutlinedIcon fontSize='inherit' />;
    case 'mp4':
    case 'avi':
    case 'flv':
      return <div className='icon-icn_file_video' />;
    case 'mp3':
    case 'ogg':
      return <HeadsetIcon fontSize='inherit' />;
    case 'pdf':
      return <div className='icon-icn_file_pdf' />;
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
      return <div className='icon-icn_file_document' />;
    default:
      return <ErrorIcon fontSize='inherit' />;
  }
};
