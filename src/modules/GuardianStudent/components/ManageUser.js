import React from 'react';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isNull from 'lodash/isNull';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// import { makeStyles } from '@mui/material/styles';
import { withStyles } from '@mui/styles';

import TblAutocomplete from 'components/TblAutocomplete';
import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const newUser = {};
const styles = () => ({
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

class ManageUser extends React.PureComponent {
  // static whyDidYouRender = true;
  constructor(props) {
    super(props);
    this.state = {
      user: props.user ? props.user : newUser,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.isSubmitting) {
      return null;
    }
    if (!isEmpty(props.user)) {
      return {
        user: props.user,
      };
    }
    return {
      ...state,
      user: newUser,
    };
  }

  componentDidMount() {
    if (this.props.getGuardianList && this.props.userType === 'students') {
      this.props.getGuardianList();
    }
  }

  componentDidUpdate(prevProps) {
    const { error, t } = this.props;
    if (!isEqual(prevProps.error, error) && error?.subcode === 409) {
      if (this.formikRef) {
        this.formikRef.setFieldError(
          'email',
          t('common:existed_email_message')
        );
      }
    }
  }

  filterGuardian = () => {
    //   if (this.props.getGuardianList && this.props.userType === 'students') {
    //   this.props.getGuardianList();
    // }
  };

  getGuardianListWithoutSelectedItem = (id = -1) => {
    const { guardians } = this.props;
    const newList = guardians.filter((guardian) => guardian.id !== id);
    return newList;
  };

  getInitialValues = (userType = 'students') => {
    const { user } = this.state;
    let initialValues = { ...user };
    if (userType === 'students') {
      Object.assign(initialValues, {
        guardian1: user?.guardians?.[0] ?? null,
        guardian2: user?.guardians?.[1] ?? null,
      });
    }
    return { ...initialValues };
  };

  render() {
    const { t, open, isSubmitting, userType } = this.props;
    const { user } = this.state;
    if (!open) {
      return null;
    }
    let title = t(
      userType === 'students' ? 'invite_new_student' : 'invite_new_guardian'
    );
    if (user && user.id) {
      title = t(userType === 'students' ? 'edit_student' : 'edit_guardian');
    }
    const validationSchema = Yup.object().shape({
      email: Yup.string()
        .lowercase()
        .trim()
        .email(t('common:email_valid_message'))
        .required(t('common:required_message')),
      firstName: Yup.string().trim().required(t('common:required_message')),
      lastName: Yup.string().trim().required(t('common:required_message')),
    });
    // const selectedRoles = this.getSelectedRole();
    return (
      <Formik
        innerRef={(node) => (this.formikRef = node)}
        initialValues={this.getInitialValues(userType)}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={false}
        onSubmit={(values) => {
          if (this.props.onSubmit) {
            if (userType === 'students') {
              const guardians = [values.guardian1, values.guardian2]
                .filter((item) => !isNull(item))
                .map((item) => item.id);
              const newValues = { ...values };
              delete newValues.guardian1;
              delete newValues.guardian2;
              this.props.onSubmit(Object.assign(newValues, { guardians }));
            } else {
              this.props.onSubmit(values);
            }
          }
        }}
      >
        {({
          errors,
          touched,
          handleSubmit,
          resetForm,
          submitCount,
          values,
          setFieldValue,
        }) => (
          <TblDialog
            title={title}
            open={open}
            footer={
              <>
                <TblButton
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                    if (this.props.onCancel) {
                      this.props.onCancel();
                    }
                    resetForm();
                  }}
                >
                  {t('common:cancel')}
                </TblButton>
                <TblButton
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  isShowCircularProgress={isSubmitting}
                >
                  {user && user.id ? t('common:save') : t('common:invite')}
                </TblButton>
              </>
            }
          >
            <Form>
              <Grid container>
                <Grid item lg={12} md={12} xs={12}>
                  <Field
                    name='firstName'
                    required
                    as={TblInputs}
                    inputProps={{ maxLength: 40 }}
                    placeholder={t('common:first_name')}
                    error={
                      !!(errors.firstName && (touched.firstName || submitCount))
                    }
                    errorMessage={
                      !!(errors.firstName && (touched.firstName || submitCount))
                        ? errors.firstName
                        : false
                    }
                    label={t('common:first_name')}
                  />
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                  <Field
                    name='lastName'
                    required
                    as={TblInputs}
                    inputProps={{ maxLength: 80 }}
                    placeholder={t('common:last_name')}
                    error={
                      !!(errors.lastName && (touched.lastName || submitCount))
                    }
                    errorMessage={
                      !!(errors.lastName && (touched.lastName || submitCount))
                        ? errors.lastName
                        : false
                    }
                    label={t('common:last_name')}
                  />
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                  <Field
                    name='email'
                    required
                    as={TblInputs}
                    placeholder={t('common:email')}
                    inputProps={{ maxLength: 254 }}
                    error={!!(errors.email && (touched.email || submitCount))}
                    errorMessage={
                      !!(errors.email && (touched.email || submitCount))
                        ? errors.email
                        : false
                    }
                    label={t('common:email')}
                    noneMarginBottom={userType !== 'students'}
                  />
                </Grid>
                {userType === 'students' && (
                  <>
                    <Grid item lg={12} md={12} xs={12}>
                      <Field
                        keyValue='name'
                        name='guardian1'
                        as={TblAutocomplete}
                        placeholder={`${t('guardian')} 1`}
                        value={values.guardian1}
                        label={`${t('guardian')} 1`}
                        options={this.getGuardianListWithoutSelectedItem(
                          values?.guardian2?.id
                        )}
                        onChange={(e, value) => {
                          setFieldValue('guardian1', value);
                        }}
                      />
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                      <Box mt={2}>
                        <Field
                          keyValue='name'
                          name='guardian2'
                          as={TblAutocomplete}
                          placeholder={`${t('guardian')} 2`}
                          label={`${t('guardian')} 2`}
                          options={this.getGuardianListWithoutSelectedItem(
                            values?.guardian1?.id
                          )}
                          onChange={(e, value) =>
                            setFieldValue('guardian2', value)
                          }
                        />
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Form>
          </TblDialog>
        )}
      </Formik>
    );
  }
}
ManageUser.propTypes = {
  classes: PropTypes.object,
  getUserRolesList: PropTypes.func,
  onCancel: PropTypes.func,
  t: PropTypes.func,
  roles: PropTypes.array,
  user: PropTypes.object,
  open: PropTypes.bool,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  userType: PropTypes.string,
  getGuardianList: PropTypes.func,
  guardians: PropTypes.array,
  error: PropTypes.object,
};
ManageUser.defaultProps = {
  userType: 'students',
};
export default withStyles(styles)(ManageUser);
