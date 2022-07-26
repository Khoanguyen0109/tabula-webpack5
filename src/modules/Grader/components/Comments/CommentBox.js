import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

function CommentBox() {
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const onSubmit = () => {};
  const onDiscard = () => {
    setMessage('');
  };
  return (
    <Box mt={2}>
      <TblInputs
        name='message'
        multiline
        value={message}
        rows={3}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        inputProps={{ maxLength: 1000 }}
        placeholder={t('common:enter_message')}
      />
      <Box display='flex' justifyContent='flex-end'>
        <Box mr={1}>
          <TblButton
            onClick={onDiscard}
          >
            {t('common:discard')}
          </TblButton>
        </Box>
        <Box>
          <TblButton variant='contained' color='primary' onClick={onSubmit}>
            {t('common:submit')}
          </TblButton>
        </Box>
      </Box>
    </Box>
  );
}

export default CommentBox;
