import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';

import TblButton from 'components/TblButton';

import PropTypes from 'prop-types';

function DialogActions(props) {
    const {onSkip , onPublish, isSubmit } = props;
    const { t } = useTranslation(['myCourses', 'common']);

    return (
        <>
        <Box />
        <Box display='flex'>
          <Box mr={2}>
            {' '}
            <TblButton
              variant='outlined'
              color='primary'
              onClick={onSkip}
              disabled={isSubmit}
            >
              {t('myCourses:skip_and_create_as_draft')}
            </TblButton>
          </Box>
          <Box>
            <TblButton
              variant='contained'
              color='primary'
              onClick={onPublish}
              isShowCircularProgress={isSubmit}
              disabled={isSubmit}
            >
              {t('common:publish')}
            </TblButton>
          </Box>
        </Box>
      </>
    );
}

DialogActions.propTypes = {
  isSubmit: PropTypes.bool,
  onPublish: PropTypes.func,
  onSkip: PropTypes.func
};

export default DialogActions;
