import React from 'react';

import { Skeleton, Typography } from '@mui/material';

import PropTypes from 'prop-types';

function BreadcrumbTitle({ title }) {
  return title ? (
    <Typography variant='headingSmall' component='div' alignItems='center' className='word-wrap'>
      {title}
    </Typography>
  ) : (
    <Skeleton height={50} width={240} />
    );
}

BreadcrumbTitle.propTypes = {
  title: PropTypes.string
};

export default BreadcrumbTitle;
