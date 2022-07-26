import React, { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { Box, Skeleton, Typography } from '@mui/material';

import TblActivityItem from 'components/TblActivityItem';
import { BreadcrumbContext } from 'components/TblBreadcrumb';
import TblCustomScrollbar from 'components/TblCustomScrollbar';
import EmptyContentForStudent from 'shared/MyCourses/components/EmptyContentForStudent';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';
import useGetSchoolYear from 'utils/customHook/useGetSchoolYear';
import { isGuardian } from 'utils/roles';

import { useAuthDataContext } from 'AppRoute/AuthProvider';
import { Layout2 } from 'layout';
import { isEmpty } from 'lodash';
import myCoursesAction from 'modules/MyCourses/actions';
import actions from 'modules/MyCourses/actions';

import TermTabs from './TermTabs';

const GradeReport = () => {
  const { t } = useTranslation('myCourses');
  const dispatch = useDispatch();

  const context = useContext(BreadcrumbContext);
  const authContext = useAuthDataContext();
  const {
    currentUser: { organizationId },
  } = authContext;
  const [schoolYearSelected] = useGetSchoolYear();

  const myCoursesList = useSelector((state) => state.MyCourses.myCoursesList);
  const isBusy = useSelector((state) => state.MyCourses.isBusy);

  const basicInfo = useSelector((state) => state.MyCourses?.basicInfo);
  const [courseSelected, setCourseSelected] = useState();

  useEffect(() => {
    context.setData({
      bodyContent: t('myCourses:grade_report'),
    });
    const currentStudentId = authContext?.currentStudentId;
    const isGuardianRole = isGuardian(authContext.currentUser);
    const urlParams = {
      orderBy: 'courseName',
      sort: 'asc',
      schoolYearId: schoolYearSelected,
    };
    if (isGuardianRole) {
      urlParams.studentId = currentStudentId;
    }
    dispatch(
      myCoursesAction.getMyCoursesList({
        orgId: organizationId,
        urlParams: urlParams,
        isBusy: true,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDidMountEffect(() => {
    if (myCoursesList.length > 0) {
      setCourseSelected(myCoursesList[0]);
    }
  }, [myCoursesList]);

  useDidMountEffect(() => {
    if (courseSelected) {
      dispatch(
        actions.getBasicInfo({
          orgId: organizationId,
          courseId: courseSelected.id,
          basicInfo: null,
        })
      );
    }
  }, [courseSelected]);
  const handleClickItem = (course) => {
    setCourseSelected(course);
  };
  return (
    <Layout2>
      <div>
        <Box p={1} display='flex' justifyContent='space-between'>
          <Typography variant='titleSmall'>{t('common:courses')}</Typography>
          <Typography variant='bodyLarge'>({myCoursesList.length})</Typography>
        </Box>
        <Box mt={1.5}>
          <TblCustomScrollbar maxHeightScroll={window.innerHeight - 200}>
            {myCoursesList.map((course, index) => {
              const itemType = 'myCourses';
              return (
                <TblActivityItem
                  key={index}
                  activity={{
                    id: course.id,
                    name: course.courseName,
                    itemType: itemType,
                  }}
                  activeId={courseSelected}
                  isActiveItem={courseSelected?.id === course.id}
                  handleClickItem={handleClickItem}
                />
              );
            })}
          </TblCustomScrollbar>
        </Box>
      </div>
      {isBusy ? (
        <div>
          <Skeleton height={100} />
          <Skeleton height={150} />
          <Skeleton />
        </div>
      ) : myCoursesList?.length === 0 ? (
        <Box>
          <EmptyContentForStudent subTitle={t('empty_course_list')} />
        </Box>
      ) : courseSelected && !isEmpty(basicInfo) ? (
        <Box sx={{ overflowX: 'hidden' }}>
          <Box>
            <Typography variant='headingSmall'>
              {basicInfo.courseName}
            </Typography>
            <Box display='flex' alignItems='center'>
              <LocalLibraryIcon fontSize='xSmall' sx={{ marginRight: '8px' }} />
              <Typography component='span' variant='bodyMedium'>
                {basicInfo?.teacher?.name}
              </Typography>
            </Box>
          </Box>
          <Box mt={3}>
            <TermTabs courseSelected={courseSelected} />
          </Box>
        </Box>
      ) : (
        <Box>
          <Skeleton height={100} />
          <Skeleton height={150} />
          <Skeleton />
        </Box>
      )}
    </Layout2>
  );
};
export default GradeReport;

GradeReport.defaultProps = {};

GradeReport.propTypes = {};
