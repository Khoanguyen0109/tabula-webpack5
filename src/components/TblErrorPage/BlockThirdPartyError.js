import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import TabulaButton from 'components/TblButton';

import { ReactComponent as BlockThirdPartyError } from 'assets/images/block_third_party_error.svg';

function BlockThirdPartyErrorPage() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const history = useHistory();
  const { t } = useTranslation();
  const height = document.body.clientHeight || window.innerHeight;
  return (
    <Box
      display='flex'
      alignItems='center'
      alignContent='center'
      justifyContent='center'
      style={{ height, paddingTop: height * 0.1 }}
    >
      <BlockThirdPartyError />
      <Box ml={3}>
        <Typography mb={3} maxWidth={504} variant='headingLarge'>
          {t('error:third_party_blocked')}
        </Typography>
        <Typography fontWeight={600} mb={1.25} variant='bodyMedium'>
           {t('tour:allow_cross_site_guide')}
        </Typography>
        <Typography fontWeight={400} mb={1} variant='bodyMedium'>
          1. {t('tour:third_party_guide_step_1')}
        </Typography>
        <Typography fontWeight={400} mb={1} variant='bodyMedium'>
          2. {t('tour:third_party_guide_step_2')}
        </Typography>
        <Typography fontWeight={400} mb={1} variant='bodyMedium'>
          3. {t('tour:third_party_guide_step_3')}
        </Typography>
        <Typography fontWeight={400} variant='bodyMedium'>
          4. {t('tour:third_party_guide_step_4')}
        </Typography>
        <Box display='flex' justifyContent='flex-start' mt={4}>
          <TabulaButton
            style={{ backgroundColor: '#0567F0' }}
            color='secondary'
            variant='contained'
            onClick={() => window.location.replace(urlParams.get('rollback'))}
          >
            Try Again
          </TabulaButton>
          <TabulaButton
            onClick={() => {
              history.replace('/');
            }}
          >
            Back to Home
          </TabulaButton>
        </Box>
      </Box>
    </Box>
  );
}

export default BlockThirdPartyErrorPage;
