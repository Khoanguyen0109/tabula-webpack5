import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

import { IMPORT_ERROR_CODE } from '../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    backgroundColor: theme.newColors.red[50],
    color: theme.newColors.red[800],
    padding: theme.spacing(2),
  },
}));

const ErrorUpload = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('importFile');
  const { errorCode } = props;
  const renderCodeMsg = () => {
    switch (errorCode) {
      case IMPORT_ERROR_CODE.NOT_ACCEPTED_FILE:
        return t('only_accept_xlsx');
      case IMPORT_ERROR_CODE.OVER_SIZE_FILE:
        return t('max_size_import');
      default:
        break;
    }
  };
  return (
    <Box className={classes.root}>
      <Box display='flex'>
        <ErrorOutlineIcon fontSize='small' />
        <Box mr={2} />
        <Typography variant='labelLarge' className='word-wrap'>
          {renderCodeMsg()}
        </Typography>
      </Box>
    </Box>
  );
};

ErrorUpload.propTypes = {
  errorCode: PropTypes.number
};

export default ErrorUpload;
