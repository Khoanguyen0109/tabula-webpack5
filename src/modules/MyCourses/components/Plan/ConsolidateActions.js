import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';

import TblButton from 'components/TblButton';

import PropTypes from 'prop-types';

function ConsolidateActions({ toggleClose, handleSaveAsDraft, handlePublish, isSubmit }) {
  const { t } = useTranslation(['myCourses', 'common']);
  const [isShowCircularProgressSaveBtn, setIsShowCircularProgressSaveBtn] = useState(false);
  const [isShowCircularProgressSaveAsDraftBtn, setIsShowCircularProgressSaveAsDraftBtn] = useState(false);

  const onClickSave = useCallback(() => {
    setIsShowCircularProgressSaveBtn(true);
    handlePublish();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlePublish]);

  const onClickSaveAsDraft = useCallback(() => {
    setIsShowCircularProgressSaveAsDraftBtn(true);
    handleSaveAsDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSaveAsDraft]);

  useEffect(() => {
    if (!isSubmit) {
      setIsShowCircularProgressSaveBtn(false);
      setIsShowCircularProgressSaveAsDraftBtn(false);
    }
  }, [isSubmit]);

  return (
    <Box display='flex' width='100%' justifyContent='space-between'>
    <TblButton
      variant='outlined'
      color='primary'
      onClick={toggleClose}
      disabled={isSubmit}
    >
      {t('common:cancel')}
    </TblButton>

    <Box display='flex'>
      <Box mr={2}>
        <TblButton
          variant='outlined'
          color='primary'
          onClick={onClickSaveAsDraft}
            isShowCircularProgress={isShowCircularProgressSaveAsDraftBtn && isSubmit}
          disabled={isSubmit}
        >
          {t('common:save_as_draft')}
        </TblButton>
      </Box>
      <Box>
        <TblButton
          variant='contained'
          color='primary'
          onClick={onClickSave}
          isShowCircularProgress={isShowCircularProgressSaveBtn && isSubmit}
          disabled={isSubmit}
        >
          {t('common:publish')}
        </TblButton>
      </Box>
    </Box>
  </Box>
  );
}

ConsolidateActions.propTypes = {
  toggleClose: PropTypes.func.isRequired,
  handleSaveAsDraft: PropTypes.func.isRequired,
  handlePublish: PropTypes.func.isRequired,
  isSubmit: PropTypes.bool
};

ConsolidateActions.defaultProps = {
  toggleClose: () => {},
  handleSaveAsDraft: () => {},
  handlePublish: () => { },
  isSubmit: false
};

export default ConsolidateActions;
