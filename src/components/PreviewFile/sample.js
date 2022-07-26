import React, { useState } from 'react';

import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';

import PreviewFile from './index';

const useStyles = makeStyles((theme) => ({
  pgViewerWrapper: {
    overflow: 'auto',
    height: 'calc(100vh - 130px)',
    color: theme.openColors.white,
  }
}));

function PreviewFileSample() {
  const classes = useStyles();
  const [isVisibleFullScreenImage, setIsVisibleFullScreenImage] = useState(false);
  const [isVisibleFullScreenVideo, setIsVisibleFullScreenVideo] = useState(false);

  const toggleFullScreenImage = () => {
    setIsVisibleFullScreenImage(!isVisibleFullScreenImage);
  };

  const toggleFullScreenVideo = () => {
    setIsVisibleFullScreenVideo(!isVisibleFullScreenVideo);
  };

  return (
    <>
      <TblButton size='large' variant='contained' color='primary' onClick={toggleFullScreenImage}>Open full screen image</TblButton>
      <Box mt={1}>
        <TblButton size='large' variant='contained' color='primary' onClick={toggleFullScreenVideo}>Open full screen video</TblButton>
      </Box>
      <Box mt={1}>
        <div className={classes.pgViewerWrapper}>
          {isVisibleFullScreenImage &&
            <PreviewFile
              fileType='image/jpg'
              url='https://images.unsplash.com/photo-1542281286-9e0a16bb7366?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
              isFullScreen
              fileName='test_file.jpg'
              onClose={toggleFullScreenImage}
            />
          }
          {isVisibleFullScreenVideo &&
            <PreviewFile
              fileType='video/mp4'
              url='http://techslides.com/demos/sample-videos/small.mp4'
              isFullScreen
              fileName='test_file.mp4'
              onClose={toggleFullScreenVideo}
            />
          }
          <PreviewFile
            fileType='image/jpg'
            url='https://images.unsplash.com/photo-1542281286-9e0a16bb7366?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            fileName='test_file.jpg'
            isShowFilename
            onClose={toggleFullScreenImage}
          />
        </div>
        <Box mt={2}>
          <div className={classes.pgViewerWrapper}>
            <PreviewFile
              fileType='image/jpg'
              url=''
              fileName='test_file.jpg'
              isShowFilename
              onClose={toggleFullScreenImage}
            />
          </div>
        </Box>
      </Box>
    </>
  );
}

export default PreviewFileSample;