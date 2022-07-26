/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { BreadcrumbContext } from 'components/TblBreadcrumb';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Layout1 } from 'layout';
import { useSnackbar } from 'notistack';

// import TblButton from 'components/TblButton';
import subjectActions from '../actions';
import { CreateEditSubjectWrapper } from '../components/CreateEditSubject';
import SubjectList from '../containers/SubjectList';

function Subject() {
  const { t } = useTranslation('subject', 'common');
  const { enqueueSnackbar } = useSnackbar();

  // NOTE: get contexts
  const context = useContext(BreadcrumbContext);
  const authContext = useContext(AuthDataContext);

  //NOTE: Connect redux
  const dispatch = useDispatch();
  const isLoadingCreateEditSubject = useSelector(
    (state) => state.Subject.isLoadingCreateEditSubject
  );
  const createNewSubjectFailed = useSelector(
    (state) => state.Subject.createNewSubjectFailed
  );
  const isCreateNewSubjectSuccess = useSelector(
    (state) => state.Subject.isCreateNewSubjectSuccess
  );
  const isEditSubjectSuccess = useSelector(
    (state) => state.Subject.isEditSubjectSuccess
  );
  const editSubjectFailed = useSelector(
    (state) => state.Subject.editSubjectFailed
  );

  const [
    isVisibleCreateEditSubjectDialog,
    setIsVisibleCreateEditSubjectDialog,
  ] = useState(false);
  const [subjectInfo, setSubjectInfo] = useState({});

  const { organizationId } = authContext.currentUser;

  const createNewSubject = useCallback(
    (values) => {
      dispatch(
        subjectActions.createNewSubject({
          orgId: organizationId,
          subject: { ...values },
          isLoadingCreateEditSubject: true,
        })
      );
    },
    [dispatch, organizationId]
  );

  const editSubject = useCallback(
    (values) => {
      dispatch(
        subjectActions.editSubject({
          orgId: organizationId,
          subjectId: subjectInfo?.id,
          subject: { ...values },
          isLoadingCreateEditSubject: true,
        })
      );
    },
    [dispatch, organizationId, subjectInfo]
  );

  // NOTE: handle react lifecycle
  useEffect(() => {
    context.setData({
      showBoxShadow: false,
      bodyContent: t('subjects'),
    });
  }, []);

  useEffect(() => {
    if (isCreateNewSubjectSuccess || isEditSubjectSuccess) {
      // setIsVisibleCreateEditSubjectDialog(false);
      let payload = {
        orgId: organizationId,
        isLoadingGetSubjectList: true,
      };
      let message = '';
      if (isCreateNewSubjectSuccess) {
        Object.assign(payload, {
          isCreateNewSubjectSuccess: false,
          createNewSubjectFailed: {},
        });
        message = t('subject_created');
      }
      if (isEditSubjectSuccess) {
        Object.assign(payload, {
          isEditSubjectSuccess: false,
          editSubjectFailed: {},
        });
        message = t('common:change_saved');
      }
      enqueueSnackbar(message, { variant: 'success' });
      dispatch(subjectActions.getSubjectList(payload));
    }
  }, [isCreateNewSubjectSuccess, isEditSubjectSuccess]);

  const toggleCreateEditDialog = () => {
    setIsVisibleCreateEditSubjectDialog(!isVisibleCreateEditSubjectDialog);
  };

  // const onOpenNewDialog = () => {
  //   setSubjectInfo({});
  //   setIsVisibleCreateEditSubjectDialog(true);
  // };

  const onOpenEditDialog = (value) => {
    setSubjectInfo(value);
    setIsVisibleCreateEditSubjectDialog(true);
  };

  return (
    <Layout1>
      {isVisibleCreateEditSubjectDialog && (
        <CreateEditSubjectWrapper
          t={t}
          isVisibleDialog={isVisibleCreateEditSubjectDialog}
          toggleDialog={toggleCreateEditDialog}
          subjectInfo={subjectInfo}
          createNewSubject={createNewSubject}
          isBusy={isLoadingCreateEditSubject}
          createNewSubjectFailed={createNewSubjectFailed}
          isCreateNewSubjectSuccess={isCreateNewSubjectSuccess}
          isEditSubjectSuccess={isEditSubjectSuccess}
          editSubjectFailed={editSubjectFailed}
          editSubject={editSubject}
        />
      )}
      {/* <TblButton color='primary' variant='contained' type='submit' onClick={onOpenNewDialog}>{t('common:new')}</TblButton> */}
      <SubjectList t={t} onOpenEditDialog={onOpenEditDialog} />
    </Layout1>
  );
}

export default Subject;
