import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Box } from '@mui/material';

import TblSplitButton from 'components/TblSplitButton';

import TblButton from '.';
function SampleButton() {
  return (
    <>
      <b> Primary</b>
      <Box display='flex' mb={2} alignItems='center'>
        <Box mr={2}>
          <TblButton variant='contained' color='primary'>
            Button
          </TblButton>
        </Box>
        <Box mr={2}>
          <TblButton variant='contained' color='primary' size='small'>
            Button
          </TblButton>
        </Box>
        <Box mr={2}>
          <TblButton variant='contained' color='primary' disabled={true}>
            Button
          </TblButton>
        </Box>
      </Box>
      <b>Outlined</b>

      <Box display='flex' mb={2} alignItems='center'>
        <Box mr={2}>
          <TblButton variant='outlined' color='primary'>
            Outline
          </TblButton>
        </Box>
        <Box mr={2}>
          <TblButton size='small' variant='outlined' color='primary'>
            Outline
          </TblButton>
        </Box>
        <Box mr={2}>
          <TblButton variant='outlined' color='primary' disabled={true}>
            Outline
          </TblButton>
        </Box>
      </Box>
      <b>Text</b>
      <Box display='flex' mb={2} alignItems='center'>
        <Box mr={2}>
          <TblButton variant='text' color='primary'>
            Text
          </TblButton>
        </Box>
        <Box mr={2}>
          <TblButton variant='text' color='primary' size='small'>
            Text
          </TblButton>
        </Box>
        <Box mr={2}>
          <TblButton variant='text' color='primary' disabled={true}>
            Text
          </TblButton>
        </Box>
      </Box>
      <b> Warning</b>
      <Box display='flex' mb={2} alignItems='center'>
        <Box mr={2}>
          <TblButton variant='contained' color='warning'>
            Button
          </TblButton>
        </Box>
        <Box mr={2}>
          <TblButton variant='contained' color='warning' size='small'>
            Button
          </TblButton>
        </Box>
        <Box mr={2}>
          <TblButton variant='contained' color='warning' disabled={true}>
            Button
          </TblButton>
        </Box>
      </Box>
      <b> Danger</b>
      <Box display='flex' mb={2} alignItems='center'>
        <Box mr={2}>
          <TblButton variant='contained' color='error'>
            Button
          </TblButton>
        </Box>
        <Box mr={2}>
          <TblButton variant='contained' color='error' size='small'>
            Button
          </TblButton>
        </Box>

        <TblButton variant='contained' color='error' disabled={true}>
          Button
        </TblButton>
      </Box>
      <Box>Button with Icon</Box>
      <Box display='flex' mb={2} alignItems='center'>
        <Box mr={2}>
          <TblButton
            variant='outlined'
            color='primary'
            startIcon={<DeleteIcon />}
          >
            Delete
          </TblButton>
        </Box>

        <TblButton variant='contained' endIcon={<SendIcon />}>
          Send
        </TblButton>
      </Box>
      <b>Split button</b>
      <Box display='flex' mb={2} alignItems='center'>
        <Box mr={2}>
          <TblSplitButton primaryLabel={'Button text'} />
        </Box>
        <Box mr={2}>
          <TblSplitButton disabled={true} primaryLabel={'Button text'} />
        </Box>
      </Box>
    </>
  );
}
SampleButton.title = 'Sample Button';
export default SampleButton;
