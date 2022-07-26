import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { ReactComponent as GoogleIcon } from 'assets/images/icn_google.svg';

function TblGoogleLabel() {
  const theme = useTheme();
  const { t } = useTranslation('google');
  return (
    <Box display='flex' alignItems='center'>
      <Box mt={0.5}>
        <GoogleIcon />
      </Box>
      <Typography ml={1} variant='labelLarge' color={theme.newColors.gray[600]}>
        {t('google_document')}{' '}
      </Typography>
    </Box>
  );
}

export default TblGoogleLabel;
