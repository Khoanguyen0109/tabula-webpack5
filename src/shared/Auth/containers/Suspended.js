import React from 'react';
import { withTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';

import PropTypes from 'prop-types';

import Layout from '../components/Layout';

function Suspended({t}) {
  const logoText = t('common:tabula_learning');
  const slogan = t('your_learning_guide');
  const privacyText = t('privacy_policy');
  const termsOfUseText = t('terms_of_use');
  return (<Layout t={t} logoText={logoText} slogan={slogan} privacyText={privacyText} termsOfUseText={termsOfUseText}>
          <div className='suspended-wrapper'>
              <Alert severity='error'>{t('this_domain_suspended')}</Alert>
              <p>{t('please_contact_admin')}</p>
          </div>
  </Layout>);
}

Suspended.propTypes = {
  t: PropTypes.func
};

export default withTranslation('common')(Suspended);