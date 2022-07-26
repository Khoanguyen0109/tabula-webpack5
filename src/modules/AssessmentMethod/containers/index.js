import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import last from 'lodash/last';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import TblButton from 'components/TblButton';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Layout1 } from 'layout';
import { useSnackbar } from 'notistack';

import assessmentMethodActions from '../actions';
import ManageAssessmentMethodDialog from '../components/ManageAssessmentMethodDialog';

import AssessmentMethodList from './AssessmentMethodList';

function AssessmentMethodContainer() {
  const context = useContext(BreadcrumbContext);
  const { t } = useTranslation('assessmentMethod', 'common');
  const authContext = useContext(AuthDataContext);
  const { enqueueSnackbar } = useSnackbar();
  // NOTE: connect redux
  const dispatch = useDispatch();
  const isCreateAssessmentMethodSuccess = useSelector(
    (state) => state.AssessmentMethod?.isCreateAssessmentMethodSuccess
  );
  const isEditAssessmentMethodSuccess = useSelector(
    (state) => state.AssessmentMethod?.isEditAssessmentMethodSuccess
  );
  const setDefaultAssessmentMethodSuccess = useSelector(
    (state) => state.AssessmentMethod?.setDefaultAssessmentMethodSuccess
  );
  const isDeleteAssessmentMethodSuccess = useSelector(
    (state) => state.AssessmentMethod?.isDeleteAssessmentMethodSuccess
  );
  const isBusy = useSelector((state) => state.AssessmentMethod?.isBusy);
  const error = useSelector((state) => state.AssessmentMethod?.error);

  const [open, setOpen] = useState(false);
  const [assessmentMethodSelected, setAssessmentMethod] = useState(null);

  // eslint-disable-next-line no-unused-vars

  const onCreateAssessmentMethod = (params) => {
    if (Number(last(params.ranges).rangeFrom) === 0) {
      dispatch(
        assessmentMethodActions.createAssessmentMethod({
          orgId: authContext?.currentUser?.organizationId,
          params,
          isBusy: true,
          error: null,
        })
      );
    }
  };
  const onEditAssessmentMethod = (params) => {
    if (Number(last(params.ranges).rangeFrom) === 0) {
      dispatch(
        assessmentMethodActions.editAssessmentMethod({
          orgId: authContext?.currentUser?.organizationId,
          gradeScaleId: assessmentMethodSelected.id,
          params,
          isBusy: true,
          error: null,
        })
      );
    }
  };
  const onDeleteAssessmentMethod = (methodId) => {
    dispatch(
      assessmentMethodActions.deleteAssessmentMethod({
        orgId: authContext?.currentUser?.organizationId,
        methodId,
        error: null,
      })
    );
  };

  const handleOpenDialog = (row) => {
    setOpen(true);
    setAssessmentMethod(row);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setAssessmentMethod(null);
  };

  useEffect(() => {
    context.setData({
      showBoxShadow: false,
      bodyContent: t('assessment_method', { count: 2 }),
    });
  }, []);

  useEffect(() => {
    let message = null;
    if (isEditAssessmentMethodSuccess || setDefaultAssessmentMethodSuccess) {
      message = t('common:change_saved');
    }

    if (isCreateAssessmentMethodSuccess) {
      message = t('assessment_method_created');
    }
    if (isDeleteAssessmentMethodSuccess) {
      message = t('common:deleted');
    }

    if (!!message) {
      handleCloseDialog();
      enqueueSnackbar(message, { variant: 'success' });
      dispatch(
        assessmentMethodActions.resetAssessmentMethodActions({
          isCreateAssessmentMethodSuccess: false,
          isEditAssessmentMethodSuccess: false,
          isDeleteAssessmentMethodSuccess: false,
          setDefaultAssessmentMethodSuccess: false,
        })
      );
    }
  }, [
    isCreateAssessmentMethodSuccess,
    isEditAssessmentMethodSuccess,
    isDeleteAssessmentMethodSuccess,
    setDefaultAssessmentMethodSuccess,
  ]);

  return (
    <Layout1>
      <ManageAssessmentMethodDialog
        onCreateAssessmentMethod={onCreateAssessmentMethod}
        onEditAssessmentMethod={onEditAssessmentMethod}
        t={t}
        open={open}
        isSubmitting={isBusy}
        onCancel={handleCloseDialog}
        assessmentMethod={assessmentMethodSelected}
        error={error}
      />
      <TblButton
        color='primary'
        variant='contained'
        onClick={() => handleOpenDialog()}
      >
        {t('common:new')}
      </TblButton>
      <AssessmentMethodList
        editAssessmentMethod={handleOpenDialog}
        deleteAssessmentMethod={onDeleteAssessmentMethod}
      />
    </Layout1>
  );
}

export default AssessmentMethodContainer;
