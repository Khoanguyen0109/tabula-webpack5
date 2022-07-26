/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Box, MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import TblButton from 'components/TblButton';
import TblConfirmDialog from 'components/TblConfirmDialog';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';
import SaveAsTemplateDialog from 'shared/AllCourses/components/SaveAsTemplateDialog';

import { COURSE_STATUS } from 'shared/MyCourses/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Layout1 } from 'layout';
import { ROUTE_MANAGE_COURSE_TEMPLATE } from 'modules/ManageCourseTemplate/constantsRoute';
import schoolYearActions from 'modules/SchoolYear/actions';
import subjectActions from 'modules/Subject/actions';
import { useSnackbar } from 'notistack';

import allCoursesActions from '../actions';
import CreateNewDraftCourseDialog from '../components/CreateNewDraftCourseDialog';
import { ROUTE_ALL_COURSES } from '../constantsRoute';

import AllCoursesList from './AllCoursesList';

const useStyles = makeStyles((theme) => ({
  filter: {
    width: theme.spacing(25),
  },
  search: {
    width: theme.spacing(25),
  },
}));
function AllCoursesContainer() {
  const classes = useStyles();
  const context = useContext(BreadcrumbContext);
  const authContext = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation('allCourses');
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [courseSelectedId, setCourseSelectedId] = useState();
  const [shoolYearSelected, setShoolYearSelected] = useState(0);
  const [statusSelected, setStatusSelected] = useState(0);
  const [visibleCreateCourseDialog, setVisibleCreatCourseDialog] =
    useState(false);
  const [isOpenTemplateDialog, setIsOpenTemplateDialog] = useState(false);
  const [courseSelected, setCourseSelected] = useState({});
  const [isViewDetail, setIsViewDetail] = useState(false);
  // const classes = useStyles();

  const schoolYearList = useSelector(
    (state) => state.SchoolYear.schoolYearList
  );
  const subjectsList = useSelector((state) => state.Subject.subjectList);
  const termsList = useSelector((state) => state.SchoolYear.termsList);
  const isCreatingCourse = useSelector(
    (state) => state.AllCourses.isCreatingCourse
  );
  const deletingDraftCourse = useSelector(
    (state) => state.AllCourses.deletingDraftCourse
  );
  const createDraftCourseSuccess = useSelector(
    (state) => state.AllCourses.createDraftCourseSuccess
  );
  const deleteDraftCourseSuccess = useSelector(
    (state) => state.AllCourses.deleteDraftCourseSuccess
  );
  const defaultUrlParams = useSelector(
    (state) => state.AllCourses.defaultUrlParams
  );
  const canFetching = useSelector((state) => state.AllCourses.canFetching);
  const templateDetail = useSelector(
    (state) => state.AllCourses.templateDetail
  );
  // const basicInfo = useSelector(state => state.AllCourses.basicInfo);

  const toggleCreateCourseDialog = () => {
    if (!visibleCreateCourseDialog) {
      resetTermsList();
    }
    setVisibleCreatCourseDialog(!visibleCreateCourseDialog);
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
  };

  const onChangeSchoolYear = (e) => {
    setShoolYearSelected(e.target.value);
  };
  const onChangeStatus = (e) => {
    setStatusSelected(e.target.value);
  };

  const getTermsBySchoolYear = (schoolYearId) => {
    dispatch(
      schoolYearActions.getTermsBySchoolYear({
        orgId: authContext?.currentUser?.organizationId,
        schoolYearId,
      })
    );
  };

  const createDraftCourse = (values = {}) => {
    const params = {
      courseName: values.courseName,
      subjectId: values?.subject?.id,
      schoolYearId: values.schoolYearId,
      termIds: values.termIds,
      image: values?.subject?.image,
    };
    dispatch(
      allCoursesActions.createDraftCourse({
        params,
        isCreatingCourse: true,
        orgId: authContext?.currentUser?.organizationId,
      })
    );
  };

  const resetTermsList = useCallback(() => {
    dispatch(schoolYearActions.schoolYearSetState({ termsList: [] }));
  }, [dispatch]);

  const setContext = useCallback(() => {
    context.setData({
      showBoxShadow: true,
      bodyContent: t('course_administration'),
    });
  }, [search]);

  const onOpenConfirm = (courseId) => {
    setOpenConfirm(true);
    setCourseSelectedId(courseId);
  };
  const onOpenSaveAsTemplateDialog = (record) => {
    setIsOpenTemplateDialog(true);
    setCourseSelected(record);
  };
  const toggleDialog = () => {
    setIsOpenTemplateDialog(false);
  };

  const handleSaveAsTemplate = (values) => {
    dispatch(
      allCoursesActions.saveAsTemplate({
        organizationId: authContext?.currentUser?.organizationId,
        canFetching: false,
        data: {
          templateName: courseSelected.courseName,
          courseId: courseSelected.id,
          gradeLevelId: values.graveLevel,
        },
      })
    );
    if (values.clickViewDetail) {
      return setIsViewDetail(true);
    }
    setIsViewDetail(false);
    toggleDialog();
  };

  const closeConfirm = () => {
    setOpenConfirm(false);
    setCourseSelectedId(null);
  };
  const deleteCourseDraft = () => {
    const { currentUser } = authContext;
    dispatch(
      allCoursesActions.deleteDraftCourse({
        orgId: currentUser.organizationId,
        courseId: courseSelectedId,
        deletingDraftCourse: true,
        deleteDraftCourseSuccess: null,
      })
    );
  };

  useEffect(() => {
    if (canFetching) {
      if (isViewDetail) {
        history.push(
          ROUTE_MANAGE_COURSE_TEMPLATE.COURSE_TEMPLATE_DETAIL(templateDetail.id)
        );
      }
      enqueueSnackbar(t('common:create_template_success'), {
        variant: 'success',
      });
    }
  }, [canFetching]);
  useEffect(() => {
    setContext();
    dispatch(
      subjectActions.getSubjectList({
        orgId: authContext?.currentUser?.organizationId,
      })
    );
    dispatch(
      schoolYearActions.getSchoolYearList({
        id: authContext?.currentUser?.organizationId,
        urlParams: { status: 1 },
      })
    );
  }, [setContext]);

  useEffect(() => {
    if (createDraftCourseSuccess) {
      toggleCreateCourseDialog();
      enqueueSnackbar(t('course_created'), { variant: 'success' });
      dispatch(
        allCoursesActions.resetAllCourseReducer({
          createDraftCourseSuccess: null,
          urlParams: defaultUrlParams,
        })
      );

      setTimeout(
        () =>
          history.push(
            ROUTE_ALL_COURSES.ALL_COURSES_DETAIL(createDraftCourseSuccess.id)
          ),
        1000
      );
    }
    if (deleteDraftCourseSuccess) {
      closeConfirm();
      enqueueSnackbar(t('common:deleted'), { variant: 'success' });
      dispatch(
        allCoursesActions.resetAllCourseReducer({
          deleteDraftCourseSuccess: null,
        })
      );
    }
  }, [createDraftCourseSuccess, deleteDraftCourseSuccess]);

  const status = [
    {
      label: t('common:draft'),
      value: COURSE_STATUS.DRAFT,
    },
    {
      label: t('common:published'),
      value: COURSE_STATUS.PUBLISHED,
    },
  ];

  const disableWhenNoSchoolYear = schoolYearList.length === 0;
  return (
    <Layout1>
      <CreateNewDraftCourseDialog
        termsList={termsList}
        subjectsList={subjectsList}
        schoolYearList={schoolYearList}
        t={t}
        isVisible={visibleCreateCourseDialog}
        isBusy={isCreatingCourse}
        getTermsBySchoolYear={getTermsBySchoolYear}
        onSubmit={createDraftCourse}
        toggleDialog={toggleCreateCourseDialog}
      />
      <Box display='flex' flexDirection='row' mt={1}>
        <TblInputs
          value={search}
          className={classes.search}
          inputSize='medium'
          placeholder={t('common:enter_name')}
          hasSearchIcon={true}
          hasClearIcon={true}
          onChange={(e) => {
            e.persist();
            onSearch(e);
          }}
        />
        <Box mr={2} />
        <TblSelect
          className={classes.filter}
          value={shoolYearSelected}
          onChange={onChangeSchoolYear}
        >
          <MenuItem key={0} value={0}>
            {t('common:all')} {t('schoolYear:school_years')}
          </MenuItem>
          {schoolYearList.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TblSelect>
        <Box mr={2} />
        <TblSelect
          className={classes.filter}
          value={statusSelected}
          onChange={onChangeStatus}
        >
          <MenuItem key={0} value={0}>
            {t('common:all')} {t('common:status')}
          </MenuItem>
          {status.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TblSelect>
      </Box>
      <Box mt={2} />
      <TblButton
        onClick={toggleCreateCourseDialog}
        color='primary'
        variant='contained'
        type='submit'
        disabled={disableWhenNoSchoolYear}
      >
        {t('common:new')}
      </TblButton>
      <Box mt={2} />

      <AllCoursesList
        t={t}
        search={search}
        schoolYearId={shoolYearSelected}
        status={statusSelected}
        history={history}
        schoolYearList={schoolYearList}
        toggleCreateCourseDialog={toggleCreateCourseDialog}
        onOpenConfirm={onOpenConfirm}
        onOpenSaveAsTemplateDialog={onOpenSaveAsTemplateDialog}
      />
      <TblConfirmDialog
        title={t('common:delete')}
        message={t('delete_draft_course_confirm')}
        progressing={deletingDraftCourse}
        okText={t('common:delete')}
        open={openConfirm}
        onCancel={closeConfirm}
        onConfirmed={deleteCourseDraft}
      />
      <SaveAsTemplateDialog
        isOpenDialog={isOpenTemplateDialog}
        toggleDialog={toggleDialog}
        t={t}
        gradeLevel={courseSelected?.subject?.subjectGradeLevel}
        onSubmit={handleSaveAsTemplate}
      />
    </Layout1>
  );
}

export default AllCoursesContainer;
