import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';

import BreakTimeImage from 'assets/images/break-time.jpg';
import PropTypes from 'prop-types';

function BreakTime(props) {
  const { t, open, onResume } = props;
  return (
    <TblDialog
      open={open}
      maxWidth={false}
    >
      <Box display='flex' flexDirection='column' alignItems='center'>
        <img src={BreakTimeImage} alt='' width={580} />
        <Typography variant='headingSmall' color='primary'>
          <Box>{t('break_time')}</Box>
        </Typography>
        <Box width={271} mt={2}>
          <TblButton
            variant='contained'
            color='primary'
            fullWidth
            onClick={onResume}
          >
            {t('resume')}
          </TblButton>
        </Box>
      </Box>
    </TblDialog>
  );
}

BreakTime.propTypes = {
  t: PropTypes.func,
  open: PropTypes.bool,
  onResume: PropTypes.func
};  

export default React.memo(BreakTime);