import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import PropTypes from 'prop-types';

import Layout from './Layout';

class InvalidLink extends PureComponent {
  render() {
    const { t } = this.props;

    return (
      <Layout t={t}>
        <Typography component='p' variant='bodyMedium' color='error'>{t('error:invalid_link')}</Typography>
        <Box mt={1} alignContent='center'>
          <Typography variant='bodyMedium'>{t('common:please_contact_admin')}</Typography>
        </Box>
      </Layout>
    );
  }
}

InvalidLink.propTypes = {
  t: PropTypes.func
};

export default withTranslation(['auth', 'error', 'common'])(InvalidLink);