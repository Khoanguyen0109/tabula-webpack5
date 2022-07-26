/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, Typography } from '@mui/material';

import { BreadcrumbContext } from 'components/TblBreadcrumb';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Layout1 } from 'layout';
import { debounce } from 'lodash';
import SchoolTemplateHeader from 'modules/SchoolLibrary/containers/SchoolTemplateHeader';
import SchoolTemplateList from 'modules/SchoolLibrary/containers/SchoolTemplateList';

import SchoolLibraryActions from '../actions';

function MyCoursesContainer() {
  const context = useContext(BreadcrumbContext);
  const authContext = useContext(AuthDataContext);
  const { currentUser } = authContext;
  const dispatch = useDispatch();
  const { t } = useTranslation(['schoolLibrary', 'common']);

  const schoolTemplateList = useSelector(
    (state) => state?.SchoolLibrary?.schoolTemplateList
  );
  const totalCourseTemplate = useSelector(
    (state) => state?.SchoolLibrary?.totalCourseTemplate
  );
  const isBusy = useSelector((state) => state?.SchoolLibrary?.isBusy);

  const [initialData, setInitialData] = useState([]);
  const [params, setParams] = useState({
    schoolLibrary: true,
    sort: {
      fieldSort: 'publishedAt',
      sortType: 'desc',
    },
    page: 1,
    limit: 20,
    search: '',
    subjectIds: [],
    gradeLevelIds: [],
  });

  const onFilter = debounce((filter) => {
    setParams((prev) => ({
      ...prev,
      ...filter,
    }));
  }, 300);

  useEffect(() => {
    setInitialData(schoolTemplateList);
  }, [schoolTemplateList]);

  useEffect(() => {
    dispatch(
      SchoolLibraryActions.getCourseTemplateListSchoolLibrary({
        organizationId: currentUser.organizationId,
        urlParams: params,
        isBusy: true,
      })
    );
  }, [params]);

  useEffect(() => {
    context.setData({
      bodyContent: t('common:curriculum_school_library'),
    });
  }, []);

  const onScroll = ({ scrollTop, scrollHeight, clientHeight }) => {
    if (
      scrollTop > 60 &&
      scrollTop + clientHeight === scrollHeight &&
      initialData.length !== totalCourseTemplate
    ) {
      onFilter({
        limit: params.limit + 15,
      });
    }
  };

  return (
    <Layout1 onScrollBottom={onScroll}>
      <Grid pt={2} container spacing={6}>
        <Grid item xs={12}>
          <SchoolTemplateHeader t={t} onFilter={onFilter} />
        </Grid>

        <Grid item xs={12}>
          <Box mb={3} >
            <Typography variant='labelLarge'>
              {t('total_template', { total: totalCourseTemplate })}
            </Typography>
          </Box>
          <SchoolTemplateList
            t={t}
            isBusy={isBusy}
            schoolTemplateList={initialData}
          />
        </Grid>
      </Grid>
    </Layout1>
  );
}

export default MyCoursesContainer;
