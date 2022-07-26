import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Add from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import withReducer from 'components/TblWithReducer';

import { MAX_UPLOAD } from 'utils/constants';

import Media from 'shared/Media/containers';
import reducer from 'shared/Media/reducers';

import { unionBy } from 'lodash';
import PropTypes from 'prop-types';

import AttachmentLabel from './AttachmentLabel';
import AttachmentList from './AttachmentList';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(1),
  },
  button: {
    width: theme.spacing(10.5),
  },
  icon: {
    fontSize: theme.fontSizeIcon.normal,
  },
}));

const MediaWithReducer = withReducer('Media', reducer)(Media);

const Attachment = (props) => {
  const { files, drawer1Ref, updateData, onClickDeleteFile, hasPermission } =
    props;
  const classes = useStyles();
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const disabled = files.length >= MAX_UPLOAD;
  const toggleMedia = (value) => {
    if (files?.length >= 5) {
      return null;
    }
    if (drawer1Ref) {
      drawer1Ref.current.classList.toggle('overlayed');
    }
    setOpen(value);
  };

  const validateMedia = (list) => {
    const totalMedia = list && list.concat(files || []);
    if (totalMedia && totalMedia.length > MAX_UPLOAD) {
      return t('additional_information', { max: MAX_UPLOAD });
    }
  };

  const handleMediaSelect = (media) => {
    let data = [];
    data = unionBy(media, files, 'id'); // fix bug 2963
    updateData && updateData(data);
  };

  const deleteFile = (item) => {
    if (onClickDeleteFile) {
      onClickDeleteFile(item);
    } else {
      updateData && updateData(files.filter((f) => f.id !== item.id));
    }
  };
  const onCloseMedia = () => {
    if (drawer1Ref) {
      drawer1Ref.current.classList.toggle('overlayed');
    }
    if (props.onClose) {
      props.onClose();
    } else {
      setOpen(false);
    }
  };

  return (
    <Box className={classes.root}>
      <AttachmentLabel />
      <Box mb={3} />
      <Box display={'flex'} alignItems='center'>
        <TblButton
          variant='outlined'
          color='primary'
          className={classes.button}
          disabled={disabled}
          onClick={() => toggleMedia(true)}
          startIcon={<Add />}
        >
          {t('common:add')}
        </TblButton>
        <Typography ml={2} variant='bodyMedium'>
          {t('additional_information', { max: MAX_UPLOAD })}
        </Typography>
      </Box>
      {files.length > 0 && (
        <>
          <Box mb={2} />
          <AttachmentList
            files={files}
            onRemove={deleteFile}
            hasPermission={hasPermission}
          />
        </>
      )}
      <MediaWithReducer
        visible={open}
        multiple={true}
        onClose={onCloseMedia}
        mediaType='media'
        onSelect={handleMediaSelect}
        validateFunc={validateMedia}
        max={MAX_UPLOAD}
      />
    </Box>
  );
};

Attachment.propTypes = {
  canDownload: PropTypes.bool,
  drawer1Ref: PropTypes.shape({
    current: PropTypes.shape({
      classList: PropTypes.shape({
        toggle: PropTypes.func,
      }),
    }),
  }),
  files: PropTypes.array,
  hasPermission: PropTypes.bool,
  onClickDeleteFile: PropTypes.func,
  onClose: PropTypes.func,
  updateData: PropTypes.func,
};
Attachment.defaultProps = {
  files: [],
  hasPermission: true,
};
export default Attachment;
