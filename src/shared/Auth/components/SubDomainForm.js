import React from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
// More detail https://github.com/jquense/yup

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

class SubDomainForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      identity: null,
      hasSubdomain: false,
      subdomain: '',
      subdomainValid: null,
      subdomainFormSubmitted: false,
      domain: '',
    };
  }

  render() {
    const { t, domain, subdomainStatus, isBusy } = this.props;
    const { subdomainFormSubmitted } = this.state;
    const DomainSchema = Yup.object().shape({
      subdomain: Yup.string().required(t('domain_require_message')),
    });
    return (
      <Formik
        initialValues={{
          subdomain: '',
        }}
        validationSchema={DomainSchema}
        onSubmit={(values) => {
          this.setState({ subdomainFormSubmitted: true });
          this.props.onSubmit(values);
        }}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ errors, touched }) => (
          <Form>
            <h4 className='headline'>{t('signin_your_school_domain')}</h4>
            {!isBusy && !subdomainStatus && subdomainFormSubmitted && (
              <Alert severity='error'>{t('invalid_domain')}</Alert>
            )}
            <FormGroup>
              <Field
                name='subdomain'
                required
                as={TblInputs}
                color='secondary'
                fullWidth={true}
                label={<span>School Domain</span>}
                endAdornment={
                  <span className='subdomain-domain-name'>.{domain}</span>
                }
                error={errors.subdomain && touched.subdomain}
                errorMessage={
                  errors.subdomain && touched.subdomain ? (
                    <div>{errors.subdomain}</div>
                  ) : (
                    false
                  )
                }
              />
            </FormGroup>
            <Box style={{ textAlign: 'center' }} className='btn-group' mt={3}>
              <TblButton
                color='primary'
                variant='contained'
                type='submit'
                disabled={isBusy}
              >
                {t('continue')}
              </TblButton>
              {isBusy && <CircularProgress size={24} />}
            </Box>
          </Form>
        )}
      </Formik>
    );
  }
}
SubDomainForm.propTypes = {
  t: PropTypes.func,
  domain: PropTypes.string,
  requestLogin: PropTypes.func,
  onSubmit: PropTypes.func,
  isBusy: PropTypes.bool,
  error: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  checkDomain: PropTypes.func,
  subdomainStatus: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default SubDomainForm;
