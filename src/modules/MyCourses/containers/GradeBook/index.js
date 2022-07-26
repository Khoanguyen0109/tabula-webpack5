import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, MenuItem } from '@mui/material';

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import { useAuthDataContext } from 'AppRoute/AuthProvider';
import { debounce, isEqual } from 'lodash';
import { ROLE_CAN_GRADER } from 'modules/Grader/constants';
import { checkPermission } from 'utils';

import { SEARCH_DEBOUNCE } from '../../../../utils/constants';
import useDidMountEffect from '../../../../utils/customHook/useDidMoutEffect';
import myCourseActions from '../../actions';
import { getIndexOfTermAndGradingPeriod } from '../../utils';

import GradeGrid from './GradeGrid/GradeGrid';
import ReleasePopup from './ReleasePopup/ReleasePopup';
import useStyles from './styled';
// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }
function GradeBook() {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const viewBySelection = [
  //   {
  //     id: 0,
  //     label: t('myCourses:view_by_course_activity'),
  //   },
  // ];
  const params = useParams();
  const { courseId } = params;
  const permission = useSelector((state) => state.AllCourses.permission);
  const canRelease = checkPermission(permission, ROLE_CAN_GRADER);
  
  // const [value, setValue] = useState(0);
  const [defaultFilter, setDefaultFilter] = useState(true);
  const [termSelected, setTermSelected] = useState();
  const [gradingPeriodsList, setGradingPeriodsList] = useState([]);
  const [gradingPeriodSelected, setGradingPeriodSelected] = useState();
  const [showGradingPeriodFilter, setShowGradingPeriodFilter] = useState(true);
  const [sectionSelected, setSectionSelected] = useState();
  // const [viewBy, setViewBy] = useState(viewBySelection[0].id);
  const [searchValue, setSearchValue] = useState('');
  const [sortModel, setSortModel] = React.useState([
    {
      field: 'lastName',
      sort: 'asc',
    },
  ]);
  const { currentUser } = useAuthDataContext();
  const {
    organizationId,
    organization: { timezone },
  } = currentUser;

  const termsListByCourse = useSelector(
    (state) => state.AllCourses?.termsListByCourse
  );
  const isFetchingTermsList = useSelector(
    (state) => state.AllCourses?.isFetchingTermsList
  );
  const sectionsAndMeetingTimes = useSelector(
    (state) => state.AllCourses.sectionsAndMeetingTimes
  );
  const { sections } = sectionsAndMeetingTimes;
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  // const tabLabels = [
  //   { label: t('myCourses:overview'), value: 0 },
  //   // { label: t('myCourses:statistic'), value: 2 },
  // ];
  const [currentTerm, setCurrentTerm] = useState({});
  const [openRelease, setOpenRelease] = useState(false);

  const getTermsByCourse = useCallback(() => {
    dispatch(
      myCourseActions.getTermsListByCourse({
        orgId: organizationId,
        courseId,
        urlParams: { attribute: 'term', timezone },
        isFetchingTermsList: true,
      })
    );
  }, [courseId, organizationId, timezone, dispatch]);

  const getSectionsAndMeetingTimes = useCallback(() => {
    dispatch(
      myCourseActions.getSectionsAndMeetingTimes({
        orgId: organizationId,
        courseId,
      })
    );
  }, [courseId, dispatch, organizationId]);

  const onSearch = (e) => {
    setSearchValue(e.target.value);
    debounce(() => getGradeBook(e.target.value), SEARCH_DEBOUNCE)();
  };
  const getGradeBook = (nextValue) => {
    const urlParams = {
      sectionId: sectionSelected,
      gradingPeriodId: gradingPeriodSelected,
      sortBy:
        sortModel[0]?.field && sortModel[0]?.field !== 'studentName'
          ? sortModel[0]?.field
          : 'lastName',
      studentName: nextValue,
    };
    if (gradingPeriodSelected === 'All') {
      delete urlParams.gradingPeriodId;
    }
    dispatch(
      myCourseActions.mcGetGradeBook({
        courseId: courseId,
        termId: termSelected,
        urlParams: urlParams,
        gradeBookColumn: [],
        gradeBookRow: [],
        isFetchingGradeBook: true,
      })
    );
  };
  useEffect(() => {
    getTermsByCourse();
    getSectionsAndMeetingTimes();
  }, [getSectionsAndMeetingTimes, getTermsByCourse]);

  useDidMountEffect(() => {
    if (!isFetchingTermsList && termsListByCourse.length > 0) {
      const { indexTerm } =
        getIndexOfTermAndGradingPeriod(termsListByCourse) || {};
      setTermSelected(termsListByCourse[indexTerm].id);
    }
  }, [isFetchingTermsList, termsListByCourse]);

  useDidMountEffect(() => {
    if (sections && sections.length > 0) {
      setSectionSelected(sections[0]?.id);
    }
  }, [sections]);

  const onShowGradingPeriodFilter = (term) => {
    const gradePeriodsList = term.gradingPeriods || [];

    if (
      (term.termName === 'Full School Year' && gradePeriodsList.length === 1) ||
      (gradePeriodsList.length === 1 &&
        isEqual(term.firstDay, gradePeriodsList[0].firstDay) &&
        isEqual(term.lastDay, gradePeriodsList[0].lastDay))
    ) {
      setShowGradingPeriodFilter(false);
    }
  };
  useDidMountEffect(() => {
    if (termSelected && termsListByCourse) {
      if (defaultFilter) {
        const { indexTerm, indexGdp } =
          getIndexOfTermAndGradingPeriod(termsListByCourse) || {};
        setGradingPeriodsList(termsListByCourse[indexTerm].gradingPeriods);
        setGradingPeriodSelected(
          termsListByCourse[indexTerm]?.gradingPeriods[indexGdp].id
        );
        onShowGradingPeriodFilter(termsListByCourse[indexTerm]);
      } else {
        const indexTerm = termsListByCourse.findIndex(
          (term) => term.id === termSelected
        );
        onShowGradingPeriodFilter(termsListByCourse[indexTerm]);
        setGradingPeriodsList(termsListByCourse[indexTerm].gradingPeriods);
        setGradingPeriodSelected(
          termsListByCourse[indexTerm]?.gradingPeriods[0].id
        );
      }
    }
  }, [termSelected, termsListByCourse]);

  useDidMountEffect(() => {
    if (termSelected && gradingPeriodSelected && sectionSelected) {
      getGradeBook(searchValue);
    }
  }, [termSelected, gradingPeriodSelected, sectionSelected]);

  useEffect(() => {
    if (termSelected && termsListByCourse) {
      termsListByCourse.forEach((term) => {
        if (term.id === termSelected) {
          setCurrentTerm(term);
        }
      });
    }
  }, [termSelected, termsListByCourse]);

  return (
    <div className={classes.root}>
      {/* <Box className={classes.tabs}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              display: 'none',
            },
          }}
        >
          {tabLabels.map((tab) => (
            <Tab
              classes={{
                root: classes.tabButton,
                selected: classes.tabSelected,
              }}
              label={tab.label}
              {...a11yProps(tab.value)}
            />
          ))}
        </Tabs>
      </Box> */}
      {/* <TabPanel value={value} index={0}> */}
        <Box className={classes.filters}>
          <Box className={classes.rightFilter}>
            <TblInputs
              className={classes.searchBox}
              value={searchValue}
              inputSize='medium'
              placeholder={t('myCourses:enter_student_name')}
              onChange={(e) => {
                // e.persist();
                onSearch(e);
              }}
              hasSearchIcon={true}
              hasClearIcon={true}
            />
            <Box className={classes.filter}>
              <TblSelect
                value={termSelected}
                onChange={(e) => {
                  setTermSelected(e.target.value);
                  setDefaultFilter(false);
                }}
              >
                {termsListByCourse.map((term) => (
                  <MenuItem key={term.id} value={term.id}>
                    {term.termName}
                  </MenuItem>
                ))}
              </TblSelect>
            </Box>

            {showGradingPeriodFilter && (
              <Box className={classes.filter}>
                <TblSelect
                  className={classes.filter}
                  value={gradingPeriodSelected}
                  onChange={(e) => {
                    setGradingPeriodSelected(e.target.value);
                    setDefaultFilter(false);
                  }}
                >
                  <MenuItem key={'all'} value={'All'}>
                    {t('myCourses:all_grading_periods')}
                  </MenuItem>
                  {gradingPeriodsList.map((gradingPeriod) => (
                    <MenuItem key={gradingPeriod.id} value={gradingPeriod.id}>
                      {gradingPeriod.gradingPeriodName}
                    </MenuItem>
                  ))}
                </TblSelect>
              </Box>
            )}

            <Box className={classes.filter}>
              <TblSelect
                value={sectionSelected}
                onChange={(e) => {
                  setSectionSelected(e.target.value);
                }}
              >
                {(sections ?? []).map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.sectionName}
                  </MenuItem>
                ))}
              </TblSelect>
            </Box>
          </Box>
          <Box className={classes.lefFilter}>
            {/* <TblSelect
              value={viewBy}
              onChange={(e) => setViewBy(e.target.value)}
            >
              {viewBySelection.map((viewBy) => (
                <MenuItem key={viewBy.id} value={viewBy.id}>
                  {viewBy.label}
                </MenuItem>
              ))}
            </TblSelect> */}
          </Box>
        </Box>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={3}
        >
          <Box className={classes.indicator}>
            <InfoOutlinedIcon
              sx={{
                marginRight: 1.25,
              }}
            />
            <div> {t('myCourses:unable_to_edit_grade_indicator')} </div>
          </Box>
          {canRelease && (
            <TblButton
              color='primary'
              variant='contained'
              // disabled={!termSelected || !sectionSelected}
              onClick={() => setOpenRelease(!openRelease)}
            >
              {t('myCourses:release_grades')}
            </TblButton>
          )}
        </Box>
        <GradeGrid
          searchValue={searchValue}
          termSelected={termSelected}
          gradingPeriodSelected={gradingPeriodSelected}
          sectionSelected={sectionSelected}
          sortModel={sortModel}
          setSortModel={setSortModel}
          currentTerm={currentTerm}
        />
        <ReleasePopup
          termSelected={termSelected}
          gradingPeriodSelected={gradingPeriodSelected}
          sectionSelected={sectionSelected}
          open={openRelease}
          onClose={() => setOpenRelease(!openRelease)}
          currentTerm={currentTerm}
        />
      {/* </TabPanel> */}
    </div>
  );
}

export default GradeBook;
