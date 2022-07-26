import React from 'react';

// material-ui
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';

import PropTypes from 'prop-types';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  removeBtn: {
    color: `${theme.newColors.gray[500] }!important`,
  },
}));

const FileItem = (props) => {
  const classes = useStyles();
  const { file, onRemove } = props;
  const fileSize = (file.size / (1024)).toFixed(1);
  return (
    <Box className={classes.root}>
      <Box display='block'>
        <Typography variant='bodyMedium'>{file.name}</Typography>
        <Box mb={0.5} />
        <Typography variant='bodyMedium'>{fileSize}KB </Typography>
      </Box>
      <TblIconButton
        className={classes.removeBtn}
        onClick={(e) => onRemove(e, file)}
      >
        <CancelIcon />
      </TblIconButton>
    </Box>
  );
};

FileItem.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    size: PropTypes.number
  }),
  onRemove: PropTypes.func
};

export default FileItem;
