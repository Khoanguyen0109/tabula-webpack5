import React from 'react';

import Typography from '@mui/material/Typography';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';

import PropTypes from 'prop-types';

function ConfirmSuspend({t, onConfirmed, onCancel, open}) {
  return <TblDialog
          open={open}
          footer={<>
            <TblButton variant='outlined' color='primary' onClick={onCancel}>{t('Cancel')}</TblButton>
            <TblButton variant='containted' color='primary' onClick={onConfirmed}>{t('Ok')}</TblButton>
          </>}
          
        >
          <Typography>{t('suspend_confirm')}</Typography>
        </TblDialog>;
}

ConfirmSuspend.propTypes = {
  open: PropTypes.bool,
  t: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirmed: PropTypes.func
};
export default ConfirmSuspend;