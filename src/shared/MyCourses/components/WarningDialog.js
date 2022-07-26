import React from 'react';
import { useTranslation } from 'react-i18next';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Typography } from '@mui/material';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';

import PropTypes from 'prop-types';
function WarningDialog(props) {
  const { open, onClose } = props;
  const { t } = useTranslation('myCourses');
  return (
    <TblDialog
      hasCloseIcon
      maxWidth='xs'
      open={open}
      title={
        <>
          <Box display='flex'>
            <WarningAmberIcon sx={{ color: '#F08C00' }} />
            <Typography ml={1} variant='titleSmall'>
              {t('schedule_a_course_activity')}
            </Typography>
          </Box>
        </>
      }
      onClose={onClose}
      fullWidth
      footer={
        <Box display='flex' flexDirection='row-reverse' width='100%'>
          <TblButton variant='contained' color='primary' onClick={onClose}>
            {t('common:ok')}
          </TblButton>
        </Box>
      }
    >
      {t('require_publish_when_plan_activity')}
    </TblDialog>
  );
}

WarningDialog.propTypes = {
  onClose: PropTypes.bool,
  open: PropTypes.func,
};

export default WarningDialog;
