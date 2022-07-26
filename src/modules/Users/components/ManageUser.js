import React from 'react';

import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import Grid from '@mui/material/Grid';

// import Chip from '@mui/material/Chip';
import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';

import {
  DOMAIN_OWNER,
  GUARDIAN,
  OWNER,
  STUDENT,
  STUDENT_ASSIST_MANAGER,
} from 'utils/roles';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import TblAutoComplete from '../../../components/TblAutocomplete';

const newUser = {
  roles: [],
};

class ManageUser extends React.PureComponent {
  // static whyDidYouRender = true;
  formikFormRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      selectedRole: [],
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

  componentDidUpdate() {
    const { t } = this.props;
    if (!isNil(this.props.error) && this.formikFormRef?.current) {
      const { subcode } = this.props.error || {};
      if (subcode === 409) {
        this.formikFormRef.current.setFieldError(
          'email',
          t('common:existed_email_message')
        );
      } else if (subcode === 3) {
        this.formikFormRef.current.setFieldError(
          'roles',
          t('common:associated_with_published_course_message')
        );
      }
    }
  }

  getSelectedRole = () => {
    const { user } = this.state;
    if (!user.id || !user.roles) {
      return [];
    }
    const { roles } = this.props;
    return roles.filter((r) => user.roles.find((ur) => ur.id === r.id));
  };

  render() {
    const { t, roles, open, isSubmitting } = this.props;
    const { user } = this.state;
    if (!open) {
      return null;
    }
    let title = t('invite_new_user');
    if (user && user.id) {
      title = t('edit_user');
    }
    const validationSchema = Yup.object().shape({
      email: Yup.string()
        .lowercase()
        .trim()
        .email(t('common:email_valid_message'))
        .required(t('common:required_message')),
      firstName: Yup.string().trim().required(t('common:required_message')),
      lastName: Yup.string().trim().required(t('common:required_message')),
      roles: Yup.array()
        .of(Yup.string())
        .required(t('common:required_message')),
    });
    const selectedRoles = this.getSelectedRole();
    const rolesWithoutOwnerStudentGuardian = roles.filter((role) => (
        role.roleName !== OWNER &&
        role.roleName !== STUDENT &&
        role.roleName !== GUARDIAN &&
        role.roleName !== DOMAIN_OWNER &&
        role.roleName !== STUDENT_ASSIST_MANAGER
      ));

    return (
      <Formik
        initialValues={{ ...user, roles: selectedRoles }}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={false}
        onSubmit={(values) => {
          if (this.props.onSubmit) {
            this.props.onSubmit(values);
          }
        }}
        innerRef={this.formikFormRef}
      >
        {({
          errors,
          touched,
          handleSubmit,
          resetForm,
          submitCount,
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
                    isShowCircularProgress={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {user && user.id ? t('common:save') : t('common:invite')}
                  </TblButton>
              </>
            }
          >
            <Form className='loginForm'>
              <Grid container>
                <Grid item lg={12} md={12} xs={12}>
                  <Field
                    name='firstName'
                    required
                    as={TblInputs}
                    inputProps={{ maxLength: 40 }}
                    placeholder={t('common:first_name')}
                    error={
                      errors.firstName && (touched.firstName || submitCount)
                    }
                    errorMessage={
                      errors.firstName && (touched.firstName || submitCount) ? (
                        <div>{errors.firstName}</div>
                      ) : (
                        false
                      )
                    }
                    label={<span>{t('common:first_name')}</span>}
                  />
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                  <Field
                    name='lastName'
                    required
                    as={TblInputs}
                    inputProps={{ maxLength: 40 }}
                    placeholder={t('common:last_name')}
                    error={errors.lastName && (touched.lastName || submitCount)}
                    errorMessage={
                      errors.lastName && (touched.lastName || submitCount) ? (
                        <div>{errors.lastName}</div>
                      ) : (
                        false
                      )
                    }
                    label={<span>{t('common:last_name')}</span>}
                  />
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                  <Field
                    name='email'
                    required
                    as={TblInputs}
                    placeholder={t('common:email')}
                    error={errors.email && (touched.email || submitCount)}
                    errorMessage={
                      errors.email && (touched.email || submitCount) ? (
                        <div>{errors.email}</div>
                      ) : (
                        false
                      )
                    }
                    label={<span>{t('common:email')}</span>}
                  />
                </Grid>
            
                <Grid item lg={12} md={12} xs={12}>
                  <Field
                    name='roles'
                    required
                    as={TblAutoComplete}
                    multiple
                    placeholder={t('roles')}
                    error={errors.roles && (touched.roles || submitCount)}
                    errorMessage={
                      errors.roles && (touched.roles || submitCount) ? (
                        <div>{errors.roles}</div>
                      ) : (
                        false
                      )
                    }
                    onChange={(evt, values) => {
                      setFieldValue('roles', values);
                    }}
                    label={<span>{t('roles')}</span>}
                    keyDisplay='roleName'
                    keyValue='roleName'
                    options={rolesWithoutOwnerStudentGuardian}
                   />
                </Grid>
              </Grid>
            </Form>
          </TblDialog>
        )}
      </Formik>
    );
  }
}
ManageUser.propTypes = {
  getUserRolesList: PropTypes.func,
  onCancel: PropTypes.func,
  t: PropTypes.func,
  roles: PropTypes.array,
  user: PropTypes.object,
  error: PropTypes.object,
  open: PropTypes.bool,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};
ManageUser.defaultProps = {
  roles: [],
};
export default ManageUser;
