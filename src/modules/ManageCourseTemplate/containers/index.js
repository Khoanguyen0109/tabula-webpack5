/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import debounce from 'lodash/debounce';

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import CreateTemplateDialog from 'modules/ManageCourseTemplate/components/CreateTemplateDialog';

import allCoursesActions from 'shared/AllCourses/actions';
import { COURSE_STATUS } from 'shared/MyCourses/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Layout1 } from 'layout';
import manageCourseTemplateActions from 'modules/ManageCourseTemplate/actions';
import CourseTemplateList from 'modules/ManageCourseTemplate/containers/CourseTemplateList';
import ManageCourseTemplateHeader from 'modules/ManageCourseTemplate/containers/ManageCourseTemplateHeader';
import { useSnackbar } from 'notistack';

import { ROUTE_MANAGE_COURSE_TEMPLATE } from '../constantsRoute';

function ManageCourseTemplateContainer() {
  const context = useContext(BreadcrumbContext);
  const authContext = useContext(AuthDataContext);
  const myCoursesList = useSelector(
    (state) => state.MyCourses?.allCoursesList || []
  );
  const templateDetail = useSelector(
    (state) => state.ManageCourseTemplate.templateDetail
  );
  const totalCourseTemplate = useSelector(
    (state) => state.ManageCourseTemplate?.totalCourseTemplate || 0
  );
  const enqueueMessage = useSelector(
    (state) => state.ManageCourseTemplate?.enqueueMessage
  );
  const { enqueueSnackbar } = useSnackbar();

  const [params, setParams] = useState({
    sort: {},
    page: 1,
    limit: 50,
    search: '',
    subjectIds: [],
  });
  const { currentUser } = authContext;
  const dispatch = useDispatch();
  const { t } = useTranslation(
    'manageCourseTemplate',
    'schoolLibrary',
    'common'
  );
  const isBusy = useSelector((state) => state.ManageCourseTemplate.isBusy);
  const canFetching = useSelector(
    (state) => state.ManageCourseTemplate.canFetching
  );
  const history = useHistory();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isViewDetail, setIsViewDetail] = useState(false);
  const [isOpenDialogPublish, setIsOpenDialogPublish] = useState(false);
  const [templateSelected, setTemplateSelected] = useState(null);
  const [isPublish, setIsPublish] = useState(false);
  const [isPublishToDistrict, setIsPublishToDistrict] = useState(false);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const toggleDialog = () => {
    setIsOpenDialog(!isOpenDialog);
  };
  const toggleDialogPublish = () => {
    setIsOpenDialogPublish(false);
    setIsPublishToDistrict(false);
    setIsPublish(false);
    setTemplateSelected(null);
    setIsOpenDialogDelete(false);
  };
  const onSubmit = (values) => {
    dispatch(
      manageCourseTemplateActions.createCourseTemplate({
        organizationId: currentUser.organizationId,
        isBusy: true,
        canFetching: false,
        data: {
          templateName: values.templateName,
          courseId: values.course,
          gradeLevelId: values.graveLevel,
        },
      })
    );
    if (values.clickViewDetail) {
      return setIsViewDetail(true);
    }
    setIsViewDetail(false);
    setIsOpenDialog(!isOpenDialog);
  };
  const onChangePage = (e, page, limit) => {
    const newParams = { ...params };
    newParams.page = page + 1;
    if (limit) {
      newParams.limit = limit;
      newParams.page = 1;
    }
    setParams(newParams);
  };
  const onSearch = debounce((e) => {
    const newParams = { ...params, page: 1 };
    newParams.search = e.target.value;
    setParams(newParams);
  }, 500);
  const onFilter = debounce((newParams) => {
    setParams({ ...params, ...newParams, page: 1 });
  }, 100);

  const onSort = (newParams) => {
    setParams({ ...params, ...newParams });
  };
  const getMyCoursesList = useCallback(() => {
    dispatch(
      allCoursesActions.getAllCoursesList({
        id: currentUser.organizationId,
        urlParams: {
          status: COURSE_STATUS.PUBLISHED,
          sort: 'desc',
          page: 1,
          limit: 1000,
          search: '',
        },
      })
    );
  }, [dispatch, currentUser.organizationId]);

  useEffect(() => {
    context.setData({
      bodyContent: t('common:manage_course_template'),
    });
    getMyCoursesList();
    dispatch(
      manageCourseTemplateActions.getSchoolSetting({
        organizationId: currentUser.organizationId,
      })
    );
  }, []);
  const getCourseTemplateList = useCallback(() => {
    dispatch(
      manageCourseTemplateActions.getCourseTemplateList({
        organizationId: currentUser.organizationId,
        urlParams: params,
        isBusy: true,
      })
    );
  });
  useEffect(() => {
    getCourseTemplateList();
  }, [params]);
  useEffect(() => {
    if (canFetching) {
      getCourseTemplateList();
      if (isViewDetail) {
        history.push(
          ROUTE_MANAGE_COURSE_TEMPLATE.COURSE_TEMPLATE_DETAIL(templateDetail.id)
        );
      }
    }
  }, [canFetching]);

  useEffect(() => {
    if (enqueueMessage) {
      enqueueSnackbar(enqueueMessage.message, enqueueMessage.option);
      dispatch(
        manageCourseTemplateActions.manageCourseTemplateSetState({
          enqueueMessage: null,
        })
      );
    }
  }, [enqueueMessage]);

  const handlePublishToSchool = () => {
    toggleDialogPublish();
    if (templateSelected && isPublishToDistrict) {
      return dispatch(
        manageCourseTemplateActions.publishToDistrictLibrary({
          organizationId: currentUser.organizationId,
          templateId: templateSelected.id,
          isBusy: true,
          canFetching: false,
        })
      );
    }
    if (templateSelected && isPublish) {
      return dispatch(
        manageCourseTemplateActions.publishToSchoolLibrary({
          organizationId: currentUser.organizationId,
          templateId: templateSelected.id,
          isBusy: true,
          canFetching: false,
        })
      );
    }
    if (templateSelected && !isPublish) {
      return dispatch(
        manageCourseTemplateActions.unPublishToSchoolLibrary({
          organizationId: currentUser.organizationId,
          templateId: templateSelected.id,
          isBusy: true,
          canFetching: false,
        })
      );
    }
  };

  const handleDeleteCourseTemplate = () => {
    toggleDialogPublish();
    return dispatch(
      manageCourseTemplateActions.deleteCourseTemplate({
        organizationId: currentUser.organizationId,
        templateId: templateSelected.id,
        isBusy: true,
        canFetching: false,
      })
    );
  };

  const onOpenDialogPublish = (e, template, isClickPublishToDistrict) => {
    if (isClickPublishToDistrict && !e.target.checked) {
      return;
    }
    if (!isClickPublishToDistrict) {
      setIsPublish(e.target.checked);
    } else {
      setIsPublishToDistrict(isClickPublishToDistrict);
    }

    setIsOpenDialogPublish(true);
    setTemplateSelected(template);
  };

  const onOpenDialogDelete = (e, template) => {
    setIsOpenDialogDelete(true);
    setTemplateSelected(template);
  };

  return (
    <Layout1>
      <Grid pt={0.5} container spacing={6}>
        <Grid item xs={12}>
          <ManageCourseTemplateHeader
            t={t}
            onSearch={onSearch}
            onFilter={onFilter}
          />
        </Grid>
        <Grid item xs={12}>
          <Box mt={-4} mb={3}>
            <TblButton
              color='primary'
              variant='contained'
              onClick={() => setIsOpenDialog(true)}
            >
              {t('create_template')}
            </TblButton>
          </Box>
          <CourseTemplateList
            search={params.search}
            total={totalCourseTemplate}
            t={t}
            params={params}
            history={history}
            onChangePage={onChangePage}
            onOpenDialogPublish={onOpenDialogPublish}
            onOpenDialogDelete={onOpenDialogDelete}
            onSort={onSort}
          />
        </Grid>
      </Grid>
      <CreateTemplateDialog
        t={t}
        isOpenDialog={isOpenDialog}
        toggleDialog={toggleDialog}
        onSubmit={onSubmit}
        myCoursesList={myCoursesList}
        isBusy={isBusy}
      />
      <TblDialog
        open={isOpenDialogPublish}
        loading={isBusy}
        maxWidth='xs'
        title={
          isPublish
            ? t('publish_to_school_library')
            : isPublishToDistrict
            ? t('publish_to_district')
            : t('un_publish_school_library')
        }
        fullWidth={true}
        footer={
          <Box
            mt={1}
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row-reverse',
            }}
          >
            <Box>
              <TblButton
                disabled={isBusy}
                isShowCircularProgress={isBusy}
                size='medium'
                variant='contained'
                color='primary'
                onClick={handlePublishToSchool}
              >
                {isPublish || isPublishToDistrict
                  ? t('publish')
                  : t('unpublish')}
              </TblButton>
            </Box>
            <Box mr={1}>
              <TblButton
                variant='outlined'
                size='medium'
                color='primary'
                onClick={toggleDialogPublish}
              >
                {t('common:cancel')}
              </TblButton>
            </Box>
          </Box>
        }
      >
        <Box mt={2}>
          {isPublish
            ? t('on_publish_to_school_message')
            : isPublishToDistrict
            ? t('on_publish_to_district_message')
            : t('un_publish_school_library_message')}
        </Box>
      </TblDialog>

      <TblDialog
        open={isOpenDialogDelete}
        loading={isBusy}
        maxWidth='xs'
        title={t('manageCourseTemplate:delete_course_template')}
        fullWidth={true}
        footer={
          <Box
            mt={1}
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row-reverse',
            }}
          >
            <Box>
              <TblButton
                disabled={isBusy}
                isShowCircularProgress={isBusy}
                size='medium'
                variant='contained'
                color='primary'
                onClick={handleDeleteCourseTemplate}
              >
                {t('common:delete')}
              </TblButton>
            </Box>
            <Box mr={1}>
              <TblButton
                variant='outlined'
                size='medium'
                color='primary'
                onClick={toggleDialogPublish}
              >
                {t('common:cancel')}
              </TblButton>
            </Box>
          </Box>
        }
      >
        <Box mt={2}>{t('delete_course_template_message')}</Box>
      </TblDialog>
    </Layout1>
  );
}

export default ManageCourseTemplateContainer;
