/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import get from 'lodash/get';

import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

export const expandStatus = styled(({ color, ...other }) => <Chip {...other} />)(({ theme, color, ...other }) => {
  const { background, minWidth } = other;
  return {
    background: background,
    minWidth: minWidth || 80,
    borderRadius: 8,
    color: color,
    padding: theme.spacing(1),
    textTransform: 'capitalize',
    fontSize: theme.fontSize.small,
    lineHeight: theme.spacing(2.5)
  };
});

export default styled(({color, ...other}) => <Chip {...other}/>)(({theme, color}) => ({
    background: get(theme.mainColors.status, color, ''),
    minWidth: 80,
    height: 24,
    borderRadius: 8,
    color: theme.openColors.white,
    textTransform: 'capitalize'
  }));
