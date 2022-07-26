import React from 'react';
import { useTranslation } from 'react-i18next';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function AttachmentLabel() {
  const theme = useTheme();
  const { t } = useTranslation('common');
  return (
    <Box display='flex' alignItems='center' mb={1}>
      <MenuBookIcon fontSize='small' />
      <Typography ml={1} variant='labelLarge' color={theme.newColors.gray[600]}>
        {t('attachment_library')}{' '}
      </Typography>
    </Box>
  );
}

export default AttachmentLabel;
