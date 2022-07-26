import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { areEqual } from 'react-window';

import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import union from 'lodash/union';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import EmptyContent from 'components/EmptyContent';
import TblContextMenu from 'components/TblContextMenu';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';
import WarningDialog from 'shared/MyCourses/components/WarningDialog';

import { COURSE_ITEM_TYPE } from 'utils/constants';
import { TEACHER } from 'utils/roles';

import ManageLesson from 'shared/Lesson/containers/ManageLesson';
import { COURSE_STATUS } from 'shared/MyCourses/constants';
import CreateAssignmentDrawer from 'shared/MyCourses/containers/CreateAssignmentDrawer';
import CreateEditQuiz from 'shared/MyCourses/containers/CreateEditQuiz';

import loadable from '@loadable/component';
import emptyImage from 'assets/images/empty-illus.svg';
import { Layout2 } from 'layout';
import { QUIZ_TYPE /*MASTER_ITEM_STATUS*/ } from 'modules/MyCourses/constants';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { checkPermission, setUrlParam } from 'utils';

import myCourseActions from '../actions';
import AvailableListDnd from '../components/Plan/AvailableListDnd';
import MoveActivity from '../components/Plan/MoveActivity';
import { generateData, getColumnKeys } from '../components/Plan/utils';
import { END_POINT } from '../constants';
import {
  getCourseDayId,
  getIndexOfTermAndGradingPeriod,
  getKeyType,
  isAnnouncedQuizItemInPlan,
  isAvailableItemInPlan,
} from '../utils';

import ConfirmRelink from './Plan/ConfirmRelink';
import CourseDayList from './Plan/CourseDayList';
import EditShadowLesson from './Plan/EditShadowLesson';
import EditShadowQuiz from './Plan/EditShadowQuiz';
import MasterAssignmentDuetimeDialog from './Plan/MasterAssignmentDuetimeDialog';
import MasterQuizAnnouncedTimeDialog from './Plan/MasterQuizAnnouncedTimeDialog';
import ShadowAssignmentDialog from './Plan/ShadowAssignmentDialog';
import UpdateMakeUpDeadline from './Plan/UpdateMakeUpDeadline';

const ConsolidateLesson = loadable(() => import('./Plan/Consolidate/Lesson'));
const ConsolidateAssignment = loadable(() =>
  import('./Plan/Consolidate/Assignment')
);
const ConsolidateAnnouncedQuiz = loadable(() =>
  import('./Plan/Consolidate/AnnouncedQuiz')
);
const ConsolidatePopQuiz = loadable(() => import('./Plan/Consolidate/PopQuiz'));
const DialogInformation = loadable(() =>
  import('shared/MyCourses/components/DialogInformation')
);

const ROLES_UPDATE = [TEACHER];

const useStyles = makeStyles((theme) => ({
  root: {},
  courseDayList: {
    height: 'calc(100vh - 260px)', //NOTE: change fontsize to 16px
  },

  containerLeft: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  containerRight: {
    // height: '100%',
    height: 'calc(100vh - 300px)',

    width: '100%',
    // paddingBottom: theme.spacing(5),
    '& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before, & .MuiInput-underline:after':
      {
        border: 'none',
      },
    '& .MuiSelect-select': {
      color: theme.palette.primary.main,
      fontSize: theme.fontSize.normal,
      fontWeight: theme.fontWeight.semi,
      paddingTop: theme.spacing(0),
      paddingBottom: theme.spacing(0),
    },
    '& .MuiSelect-select:focus': {
      background: 'none',
    },
    '& .MuiSelect-icon': {
      color: theme.palette.primary.main,
      fontSize: theme.fontSizeIcon.normal,
      top: 0,
    },
    '& .hideIconSelect': {
      '& .MuiSelect-icon': {
        display: 'none',
      },
    },
  },
  contextMenuItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.fontSize.normal,
    '& span': {
      marginRight: theme.spacing(1),
      fontSize: theme.fontSizeIcon.medium,
    },
  },
  infoContent: {
    fontSize: theme.fontSize.small,
  },
  wrapSkeletonPlanningData: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
  },
  skeletonPlanningData: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '280px',
    height: '100%',
    marginRight: '16px',
    '& .MuiSkeleton-root:first-child': {
      marginBottom: '5px',
    },
  },
  selectMemo: {
    '& .MuiSelect-select': {
      paddingLeft: 0,
    },
  },
}));

const getKeyName = (type) => {
  switch (Number(type)) {
    case COURSE_ITEM_TYPE.ASSIGNMENT:
      return 'assignmentId';
    case COURSE_ITEM_TYPE.QUIZ:
      return 'quizId';
    default:
      return 'lessonId';
  }
};
const getKeyNamebyText = (type) => {
  switch (type) {
    case 'masterAssignment':
      return 'assignmentId';
    case 'masterAnnouncedQuiz':
    case 'masterPopQuiz':
      return 'quizId';
    default:
      return 'lessonId';
  }
};
const headers = {
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
};
const SelectMemorization = React.memo((props) => {
  const classes = useStyles();
  const {
    list,
    id,
    label,
    handleChange,
    useTabulaSelect,
    keyName,
    showSubContent,
    disabled,
    showEmptyList,
  } = props;
  if ((isEmpty(list) || isNil(id)) && !showEmptyList) {
    return null;
  }
  let value = id;
  const selectedItem = list?.find((i) => i.id === Number(value));
  if (!!!selectedItem && !isEmpty(list)) {
    value = list[0].id;
    handleChange(value);
  }
  const renderOptions = () =>
    list?.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item[keyName]}
      </MenuItem>
    ));
  return (
    <div>
      {useTabulaSelect ? (
        <TblSelect
          label={label}
          value={Number(value)}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          placeholder={'Select'}
        >
          {renderOptions()}
        </TblSelect>
      ) : (
        <TblSelect
          small
          className={classes.selectMemo}
          IconComponent={ExpandMoreIcon}
          value={Number(value)}
          onChange={(e) => {
            const { value } = e.target;
            handleChange(value);
          }}
          disabled={disabled}
        >
          {renderOptions()}
        </TblSelect>
      )}
      {showSubContent && (
        <Box display='flex'>
          {!isEmpty(selectedItem) ? (
            <Typography component='span' color='primary' variant='bodySmall'>
              {moment(selectedItem?.firstDay).format('MMM DD, YYYY')} -{' '}
              {moment(selectedItem?.lastDay).format('MMM DD, YYYY')}
            </Typography>
          ) : (
            <></>
          )}
        </Box>
      )}
    </div>
  );
}, areEqual);
SelectMemorization.propTypes = {
  list: PropTypes.array,
  id: PropTypes.number,
  label: PropTypes.string,
  handleChange: PropTypes.func,
  useTabulaSelect: PropTypes.bool,
  keyName: PropTypes.string,
  showSubContent: PropTypes.bool,
  disabled: PropTypes.bool,
  showEmptyList: PropTypes.bool,
};

const Plan = React.memo(function (props) {
  const { t } = useTranslation(['plan', 'common']);
  // NOTE: Connect reducer
  const dispatch = useDispatch();
  const basicInfo = useSelector((state) => state.MyCourses?.basicInfo);
  const unitList = useSelector((state) => state.AllCourses?.unitList);
  const termsListByCourse = useSelector(
    (state) => state.AllCourses?.termsListByCourse
  );
  const isFetchingTermsList = useSelector(
    (state) => state.AllCourses?.isFetchingTermsList
  );
  const courseItemByUnit = useSelector(
    (state) => state.AllCourses.courseItemByUnit
  );
  const courseDaysByGradingPeriod = useSelector(
    (state) => state.AllCourses.courseDaysByGradingPeriod
  );
  const planningData = useSelector((state) => state.AllCourses.planningData);
  const courseDayList = useSelector((state) => state.AllCourses.courseDayList);
  const courseDays = useSelector((state) => state.AllCourses.courseDays);
  const isFetchingPlanningData = useSelector(
    (state) => state.AllCourses.isFetchingPlanningData
  );
  const shadowLessonDetail = useSelector(
    (state) => state.AllCourses.shadowLessonDetail
  );
  const mcChangeShadowItemsStatusAtMasterLevelSuccess = useSelector(
    (state) => state.AllCourses.mcChangeShadowItemsStatusAtMasterLevelSuccess
  );
  const courseDayId = useSelector((state) => state.AllCourses.courseDayId);
  const isInPlanningPage = useSelector(
    (state) => state.AllCourses.isInPlanningPage
  );
  const error = useSelector((state) => state.AllCourses.error);
  const shadowItemValidations = useSelector(
    (state) => state.AllCourses.shadowItemValidations
  );
  // const queueUpdate = useSelector(state => state.AllCourses.queueUpdate);
  const classes = useStyles();

  // NOTE: init states and props
  const {
    orgId,
    timezone,
    courseId,
    location,
    history,
    permission,
    authContext,
  } = props;
  const isCourseDraft = basicInfo?.status === COURSE_STATUS.DRAFT;
  const urlSearchParams = new URLSearchParams(location.search);
  const hasPermission = checkPermission(
    permission || authContext.currentUser,
    ROLES_UPDATE
  );

  const [unitId, setUnitId] = useState();
  const [termId, setTermId] = useState();
  const [pendingAction, setPending] = useState();
  const [gradingPeriodId, setGradingPeriodId] = useState();
  const [courseItemMap, setCourseItemMap] = useState({});
  const [isVisibleShadowLesson, setIsVisibleShadowLesson] = useState(false);
  const [shadowLessonInfo, setShadowLessonInfo] = useState({});
  const [isVisibleShadowAssignment, setIsVisibleShadowAssignment] =
    useState(false);
  const [
    isVisibleMasterAssignmentDuetimeDialog,
    setIsVisibleMasterAssignmentDuetimeDialog,
  ] = useState(false);
  const [shadowAssignmentInfo, setShadowAssignmentInfo] = useState({});
  const [isVisibleMasterLesson, setIsVisibleMasterLesson] =
    React.useState(false);
  const [masterLessonInfo, setMasterLessonInfo] = React.useState({});
  const [isVisibleMasterAssignment, setIsVisibleMasterAssignment] =
    useState(false);
  const [masterAssignmentInfo, setMasterAssignmentInfo] = useState({});
  const [contextMenu, setContextMenu] = useState({});
  const [isVisibleMasterQuiz, setIsVisibleMasterQuiz] = React.useState(false);
  const [masterQuizInfo, setMasterQuizInfo] = useState({});
  const [isVisibleShadowQuiz, setIsVisibleShadowQuiz] = useState(false);
  const [shadowQuizInfo, setShadowQuizInfo] = useState({});
  const [
    isVisibleMasterQuizAnnouncedTime,
    setIsVisibleMasterQuizAnnouncedTime,
  ] = useState(false);
  const [searchParam, setSearchParam] = useState('');
  const [openWarn, setOpenWarn] = useState(false);
  // const [isVisiblePublishShadowItemDialog, setIsVisiblePublishShadowItemDialog] = useState(false);
  // const [dataItem, setDataItem] = useState({});
  // const [courseItemType, setCourseItemType] = useState(-1);
  let queueUpdate = {};

  const { enqueueSnackbar } = useSnackbar();
  const worker = new Worker(new URL('../../../workers/course.worker.js', import.meta.url));
  let setStateTimeout;
  // let updateCourse = {};
  worker.onmessage = (e) => {
    const updateData = e.data.updateData;
    const event = e.data.event;
    const courseDayIds = e.data.courseDayIds;
    let timeout = e.data.timeout ?? 1500;
    if (updateData && !isEmpty(updateData)) {
      // Show noti when have error
      if (event === 'error') {
        const errors = e.data.errors;
        if (errors?.message) {
          enqueueSnackbar(errors.message, { variant: 'error' });
        }
        // Show update data immediate
        timeout = 0;
      }
      if (updateData.destinationId) {
        queueUpdate[updateData.destinationId] = true;
      }
      if (updateData.sourceId) {
        queueUpdate[updateData.sourceId] = true;
      }
      if (courseDayIds) {
        courseDayIds.forEach((id) => (queueUpdate[id] = true));
      }
      clearActionDispatch();
      setStateTimeout = setTimeout(() => {
        dispatch(
          myCourseActions.myCoursesSetState({ queueUpdate: { ...queueUpdate } })
        );
        // NOTE: Use window location to get unitId (instead of updateData.unitId) because state of unitId not yet update in this function
        // FIXED: TL-2931 - https://communicate.atlassian.net/browse/TL-2931
        const windowUrlSearchParams = new URLSearchParams(
          window.location.search
        );
        const windowUnitId = windowUrlSearchParams?.get('unitId');
        if (windowUnitId) {
          // dispatch(myCourseActions.mcGetCourseItemByUnit({
          //   orgId,
          //   courseId,
          //   unitId: windowUnitId
          // }));
          const searchValue = localStorage.getItem('searchCourseActivityName');
          getCourseItemByUnit(searchValue);
        }
        queueUpdate = {};
      }, timeout);
      // dispatch(myCourseActions.myCoursesSetState({ updateData }));
    }
  };

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (
      evt.keyCode === 27 &&
      !isVisibleMasterLesson &&
      !isVisibleMasterQuiz &&
      !isVisibleMasterAssignment &&
      !isVisibleShadowLesson &&
      !isVisibleShadowAssignment &&
      !isVisibleShadowQuiz &&
      !isVisibleMasterAssignmentDuetimeDialog &&
      !isVisibleMasterQuizAnnouncedTime /*&& !isVisiblePublishShadowItemDialog*/
    ) {
      authContext.setData({ highlightId: '' }, 'user');
    }
  };

  const clearActionDispatch = () => {
    if (setStateTimeout) {
      clearTimeout(setStateTimeout);
    }
  };

  const getAllCourseDays = useCallback(() => {
    dispatch(myCourseActions.getAllCourseDays({ orgId, courseId }));
  }, [courseId, dispatch, orgId]);

  const openConsolidate = (activityType, sourceId, courseDayId, activityId) => {
    const courseActivityId = Number(activityId);
    const type = Number(activityType.split('-')[0]);
    const quizType = Number(activityType.split('-')[1]);
    const stateView =
      type === COURSE_ITEM_TYPE.LESSON
        ? 'Lesson'
        : type === COURSE_ITEM_TYPE.ASSIGNMENT
        ? 'Assignment'
        : quizType === QUIZ_TYPE.ANNOUNCED
        ? 'AnnouncedQuiz'
        : 'PopQuiz';
    // console.log(courseDayList, activityType, stateView);
    if (['Assignment', 'AnnouncedQuiz'].includes(stateView)) {
      getAllCourseDays();
    }
    dispatch(
      myCourseActions.myCoursesSetState({
        [`consolidate${stateView}State`]: {
          visible: true,
          sourceId,
          courseDayId,
          unitId,
          courseActivityId,
        },
      })
    );
  };
  const onDragEnd = (result) => {
    setContextMenu({});
    dispatch(myCourseActions.myCoursesSetState({ isDragging: false }));
    // disableScroll.off();
    if (
      !result.destination ||
      result.destination.droppableId === result.source.droppableId
    ) {
      // planningData[planningCached.sourceId] = cloneDeep(planningCached.sourceStore);
      // dispatch(myCourseActions.myCoursesSetState({ planningData: {...planningData}, planningCached: {} }));
      return;
    }

    // console.log(result);
    clearActionDispatch();
    const destinationData = result.destination.droppableId?.split('_');
    const destinationKey = destinationData[0].split('-')[0];
    const sourceData = result.source.droppableId?.split('_');
    const data = result.draggableId.split('_');
    const key = data[0].split('-')[0];
    const courseDayId = destinationData[0].split('-')[1];
    const sourceId = sourceData[0].split('-')[1];
    const type = Number(data[1].split('-')[0]);

    const destinationStore = planningData[courseDayId];
    const sourceStore = planningData[sourceId];
    let dropItem;
    let columnKey;
    let columnKeys;
    let i;
    let indexSource = 0;

    if (key === 'availableList' && destinationKey === 'masterItem') {
      if (isCourseDraft) {
        setOpenWarn(true);
        return;
      }
      openConsolidate(data[1], result.draggableId, courseDayId, data[2]);
      return;
    }
    // NOTE: Prevent drag form availableList to shadowItem
    if (
      (key === 'availableList' && destinationKey === 'shadowItem') ||
      courseDayId === sourceId
    ) {
      return;
    }
    if (key === 'availableList') {
      columnKeys = courseItemMap.columnKeys;
      for (i = 0; i < columnKeys.length; i++) {
        dropItem = courseItemMap.quoteMap[sourceData[0]][columnKeys[i]].find(
          (item) => item.id === result.draggableId
        );
        // console.log(sourceStore[key]['quoteMap'][sourceData[0]][columnKeys[i]], result.draggableId);
        if (dropItem && dropItem.id) {
          break;
        }
      }
      columnKey = columnKeys[i];
      const updateDropItem = cloneDeep(dropItem);
      updateDropItem.data.planned = true;
      const indexSource = courseItemMap.quoteMap[sourceData[0]][
        columnKeys[i]
      ].findIndex((item) => item.id === result.draggableId);
      courseItemMap.quoteMap[sourceData[0]][columnKey][indexSource] =
        updateDropItem;
      setCourseItemMap(courseItemMap);
    }
    // console.log(destinationKey, key, sourceStore);
    if (
      sourceStore &&
      (destinationKey === key || destinationKey === 'availableList')
    ) {
      // console.log(sourceStore[key]['quoteMap'][sourceData[0]], sourceData[0]);
      // console.log(sourceStore[key], sourceData);
      let sourceTarget = cloneDeep(sourceStore[key]);
      if (key === 'shadowItem') {
        indexSource = sourceTarget.findIndex(
          (d) => d.quoteMap && d.quoteMap[sourceData[0]]
        );
        sourceTarget = sourceTarget[indexSource];
      }
      columnKeys = sourceTarget['columnKeys'];
      // console.log(sourceTarget);
      for (i = 0; i < columnKeys.length; i++) {
        dropItem = sourceTarget['quoteMap'][sourceData[0]][columnKeys[i]].find(
          (item) => item.id === result.draggableId
        );
        // console.log(sourceStore[key]['quoteMap'][sourceData[0]][columnKeys[i]], result.draggableId);
        if (dropItem && dropItem.id) {
          break;
        }
      }
      columnKey = columnKeys[i];
      // console.log(sourceTarget, columnKeys, i);
      sourceTarget['quoteMap'][sourceData[0]][columnKey] = sourceTarget[
        'quoteMap'
      ][sourceData[0]][columnKey].filter(
        (item) => item.id !== result.draggableId
      );
      if (!sourceTarget['quoteMap'][sourceData[0]][columnKey].length) {
        sourceTarget['columnKeys'] = sourceTarget['columnKeys'].filter(
          (key) => key !== columnKey
        );
      }
      if (!sourceTarget['columnKeys'].length) {
        sourceTarget['columnKeys'].push('noItems');
        sourceTarget['quoteMap'][sourceData[0]]['noItems'] = [];
      }
      if (
        sourceTarget['quoteMap'][sourceData[0]][columnKey] &&
        !sourceTarget['quoteMap'][sourceData[0]][columnKey].length
      ) {
        delete sourceTarget['quoteMap'][sourceData[0]][columnKey];
      }
      // console.log(sourceStore[key]['quoteMap'][sourceData[0]][columnKey].length);
      if (key === 'shadowItem') {
        sourceStore[key][indexSource] = sourceTarget;
      } else {
        sourceStore[key] = sourceTarget;
      }
      planningData[sourceId] = cloneDeep(sourceStore);
      if (destinationKey === 'availableList') {
        dispatch(myCourseActions.myCoursesSetState({ planningData }));
      }
      // dispatch(myCourseActions.myCoursesSetState({ planningData }));
    }
    // console.log(dropItem);
    let index = 0;
    if (destinationStore && dropItem) {
      let destinationTarget = cloneDeep(destinationStore[destinationKey]);
      // console.log(destinationTarget, destinationData, columnKey);
      dropItem.id = `${destinationData[0]}_${type}_${dropItem.data.id}`;
      if (destinationKey === 'shadowItem') {
        index = destinationTarget.findIndex(
          (d) => d.quoteMap && d.quoteMap[destinationData[0]]
        );
        destinationTarget = destinationTarget[index];
        // dropItem.id += `_${type}_${dropItem.data.id}`;
        dropItem.data.linked = false;
      }
      destinationTarget['columnKeys'] = union(destinationTarget['columnKeys'], [
        columnKey,
      ]);
      if (!destinationTarget['quoteMap'][destinationData[0]][columnKey]) {
        destinationTarget['quoteMap'][destinationData[0]][columnKey] = [];
      }
      // console.log(destinationTarget['columnKeys']);
      if (destinationTarget['columnKeys'].indexOf('noItems') !== -1) {
        destinationTarget['columnKeys'].splice(
          destinationTarget['columnKeys'].indexOf('noItems'),
          1
        );
        delete destinationTarget['quoteMap'][destinationData[0]]['noItems'];
      }
      // console.log(dropItem, columnKeys);
      dropItem.data.unitId = Number(unitId);
      destinationTarget['quoteMap'][destinationData[0]][columnKey].push(
        cloneDeep(dropItem)
      );

      if (destinationKey === 'shadowItem') {
        destinationStore[destinationKey][index] = destinationTarget;
      } else {
        destinationStore[destinationKey] = destinationTarget;
      }
      planningData[courseDayId] = cloneDeep(destinationStore);
    }
    dispatch(myCourseActions.myCoursesSetState({ planningData }));
    // console.log(destinationKey, key);
    if (
      destinationKey === 'masterItem' &&
      (key === 'masterItem' || key === 'availableList')
    ) {
      const id = data[2];
      const unitSelected = key === 'availableList' ? unitId : '';
      const payload = {
        [`${getKeyName(type)}`]: id,
      };
      updateMasterItem(courseDayId, sourceId, unitSelected, payload);
      // destinationStore.masterItem
    } else if (destinationKey === 'shadowItem' && key === 'shadowItem') {
      const sectionScheduleId = destinationData[0].split('-')[2];
      const shadowId = data[2];
      if (Number(type) === COURSE_ITEM_TYPE.LESSON) {
        updateShadowLesson(courseDayId, sourceId, shadowId, {
          sectionScheduleId,
        });
        if (courseDayId === shadowLessonDetail?.masterLesson?.courseDayId) {
          const confirmData = {
            type: 'lessons',
            orgId,
            id: shadowId,
            courseId,
            name: shadowLessonDetail?.masterLesson?.lessonName,
          };
          dispatch(
            myCourseActions.myCoursesSetState({
              isShowConfirmRelinkModal: true,
              confirmData,
            })
          );
        }
      } else if (Number(type) === COURSE_ITEM_TYPE.QUIZ) {
        updateShadowQuizzes(courseDayId, sourceId, shadowId, {
          executeDateId: sectionScheduleId,
        });
      } else {
        updateShadowAssignments(courseDayId, sourceId, shadowId, {
          assignDateId: sectionScheduleId,
        });
      }
    } else if (destinationKey === 'availableList' && key === 'masterItem') {
      const id = data[2];
      const payload = {
        [`${getKeyName(type)}`]: id,
      };
      unPlanned(sourceId, payload, 0);
    }
  };

  const onDragStart = (result) => {
    const data = result.draggableId.split('_');
    const dataKey = data[0].split('-')[0];
    const type = data[1];
    const id = data[2];
    if (dataKey === 'shadowItem') {
      switch (Number(type)) {
        case COURSE_ITEM_TYPE.LESSON:
          dispatch(
            myCourseActions.mcGetShadowLessonDetail({
              orgId,
              courseId,
              shadowId: id,
              errorShadow: {},
            })
          );
          break;
        case COURSE_ITEM_TYPE.ASSIGNMENT:
          break;
        case COURSE_ITEM_TYPE.QUIZ:
          break;
        default:
          break;
      }
    }

    clearActionDispatch();
    // disableScroll.on();
    // dispatch(myCourseActions.myCoursesSetState({isDragging: true}));
  };
  const menuMoveTo = (props) => (
    <MoveActivity
      t={t}
      {...props}
      courseDayList={courseDayList}
      getCourseDay={getCourseDay}
      courseDays={courseDays}
      getAllCourseDays={getAllCourseDays}
      onMove={handleMoveAction}
    />
  );
  const getCourseDay = (sectionId) => {
    dispatch(
      myCourseActions.mcGetCourseDayList({
        orgId,
        courseId,
        sectionId,
        urlParams: { timezone },
      })
    );
  };
  useEffect(() => {
    if (courseDayList && pendingAction) {
      const { func, payload } = pendingAction;
      const currentTermSchedule = courseDayList.find(
        (term) => Number(term.termId) === Number(payload?.termId)
      );
      if (currentTermSchedule) {
        // console.log(payload, currentTermSchedule);
        const sectionSchedule = currentTermSchedule.dates.find(
          (schedule) => schedule.courseDayId === payload.courseDayId
        );
        if (sectionSchedule) {
          const sectionScheduleId = sectionSchedule.id;
          func(
            payload.courseDayId,
            payload.sourceId,
            payload.valueId,
            { [payload.key]: sectionScheduleId },
            0
          );
          setPending(null);
        }
      }
    }
  }, [courseDayList, pendingAction, termId]);
  // const move
  const handleMoveAction = (
    courseDayId,
    sourceId,
    valueId,
    type,
    sectionId,
    termId,
    dragId
  ) => {
    // console.log(courseDayId, sourceId, valueId, type, sectionId, termId, dragId);
    const { planned } = contextMenu;
    setContextMenu({});
    onCloseContextMenu();
    if (isAvailableItemInPlan(dragId) && !planned) {
      const activityType = getKeyType(type);
      const quizType = isAnnouncedQuizItemInPlan(type)
        ? QUIZ_TYPE.ANNOUNCED
        : QUIZ_TYPE.POP;
      openConsolidate(
        `${activityType}${
          activityType === COURSE_ITEM_TYPE.QUIZ ? `-${quizType}` : ''
        }`,
        dragId,
        courseDayId,
        valueId
      );
      return;
    }
    let sectionScheduleId;
    if (sectionId) {
      if (planningData[courseDayId]) {
        const courseDay = planningData[courseDayId].courseDayData;
        for (let i = 0; i < courseDay?.sectionSchedules.length; i++) {
          if (courseDay.sectionSchedules[i].sectionId === sectionId) {
            sectionScheduleId = courseDay.sectionSchedules[i].id;
          }
        }
      } else {
        getCourseDay(sectionId);
      }
    }
    switch (type) {
      case 'masterLesson':
      case 'masterAssignment':
      case 'masterAnnouncedQuiz':
      case 'masterPopQuiz':
        const payload = {
          [`${getKeyNamebyText(type)}`]: valueId,
        };
        updateMasterItem(courseDayId, sourceId, unitId, payload, 0);
        break;
      case 'shadowLesson':
        if (sectionScheduleId) {
          updateShadowLesson(
            courseDayId,
            sourceId,
            valueId,
            { sectionScheduleId },
            0
          );
        } else {
          setPending({
            func: updateShadowLesson,
            payload: {
              courseDayId,
              sourceId,
              valueId,
              termId,
              key: 'sectionScheduleId',
            },
          });
        }
        break;
      case 'shadowAnnouncedQuiz':
      case 'shadowPopQuiz':
        if (sectionScheduleId) {
          updateShadowQuizzes(
            courseDayId,
            sourceId,
            valueId,
            { executeDateId: sectionScheduleId },
            0
          );
        } else {
          setPending({
            func: updateShadowQuizzes,
            payload: {
              courseDayId,
              sourceId,
              valueId,
              termId,
              key: 'executeDateId',
            },
          });
        }
        break;
      case 'shadowAssignment':
        if (sectionScheduleId) {
          updateShadowAssignments(
            courseDayId,
            sourceId,
            valueId,
            { assignDateId: sectionScheduleId },
            0
          );
        } else {
          setPending({
            func: updateShadowAssignments,
            payload: {
              courseDayId,
              sourceId,
              valueId,
              termId,
              key: 'assignDateId',
            },
          });
        }
        break;
      default:
        break;
    }
  };

  const unPlanned = useCallback(
    (sourceId, payload, timeout) => {
      const planning = {
        headers,
        method: END_POINT.mc_unplaned_master.method,
        action: END_POINT.mc_unplaned_master.url(orgId, courseId),
        payload,
        updateData: {
          sourceId,
          unitId,
        },
        timeout,
      };
      worker.postMessage({ planning });
    },
    [courseId, orgId, unitId, worker]
  );

  const unPlannedMenuHandle = useCallback(
    ({ master, dragId, type, timeout }) => {
      let sourceId = dragId.split('_')[0];
      sourceId = sourceId.split('-')[1];
      const payload = {
        [`${getKeyNamebyText(type)}`]: master.id,
      };
      unPlanned(sourceId, payload, timeout);
    },
    [unPlanned]
  );

  const renderContextMenuOptions = (array = []) => {
    if (array.length > 0) {
      return array.map((item) => ({
        content: <Box className={classes.contextMenuItem}>{item.text}</Box>,
        onClick: item.onClickFunc,
        value: item.value,
      }));
    }
    return [];
  };

  const generateContextMenu = () => {
    const { type, lesson, assignment, quiz, dragId } = contextMenu;
    let masterId = '';
    const typeId = dragId?.split('_')[1];
    let planned = false;
    let content = [];
    const moveMenuItem = {
      func: menuMoveTo,
      customProps: {
        type,
        dragId,
      },
    };
    // console.table([lesson, assignment, quiz, dragId]);
    switch (type) {
      //NOTE: comment because of lost of story
      case 'masterLesson':
        masterId = lesson.id;
        planned = !!lesson?.planned;
        let tempContentLesson = [
          {
            text: t('common:view_details'),
            onClickFunc: onEditMasterLesson,
            value: {
              master: lesson?.unitId
                ? lesson
                : Object.assign(lesson, { unitId: Number(unitId) }),
              dragId,
            },
          },
        ];
        //NOTE: Improvement TL-3331
        // if (isMasterItemInPlan(dragId) && hasPermission && lesson?.status === MASTER_ITEM_STATUS.DRAFT) {
        //   tempContentLesson.push(
        //     { text: t('publish_all_shadow_items'), onClickFunc: onPublishShadowItem, value: { dataItem: lesson, dragId, courseItemType: COURSE_ITEM_TYPE.LESSON } },
        //   );
        // }
        content = renderContextMenuOptions(tempContentLesson);
        if (hasPermission) {
          content.push({ ...moveMenuItem, value: lesson });
          if (
            (lesson.planned && dragId.indexOf('availableList') !== -1) ||
            lesson.planned === undefined
          ) {
            content.push({
              content: (
                <Box className={classes.contextMenuItem}>
                  {t('common:unplanned')}
                </Box>
              ),
              onClick: unPlannedMenuHandle,
              value: { master: lesson, type, dragId, timeout: 0 },
            });
          }
        }
        break;
      case 'shadowLesson':
        masterId = lesson.masterLessonId;
        content = renderContextMenuOptions([
          {
            text: t('common:view_details'),
            onClickFunc: onEditShadowLesson,
            value: lesson,
          },
        ]);
        if (hasPermission) {
          content.push({ ...moveMenuItem, value: lesson });
        }
        break;
      //NOTE: comment because of lost of story
      case 'masterAssignment':
        masterId = assignment.id;
        planned = !!assignment?.planned;
        let tempContentAssignment = [
          {
            text: t('common:view_details'),
            onClickFunc: onEditMasterAssignment,
            value: { master: assignment, dragId },
          },
        ];
        //NOTE: Improvement TL-3331
        // if (isMasterItemInPlan(dragId) && hasPermission && assignment?.status === MASTER_ITEM_STATUS.DRAFT) {
        //   tempContentAssignment.push(
        //     { text: t('publish_all_shadow_items'), onClickFunc: onPublishShadowItem, value: { dataItem: assignment, dragId, courseItemType: COURSE_ITEM_TYPE.ASSIGNMENT } },
        //   );
        // }
        content = renderContextMenuOptions(tempContentAssignment);
        if (hasPermission) {
          content.push({ ...moveMenuItem, value: assignment });
          //NOTE: Improvement TL-3331 hide remove from course day if teacher is unable
          if (
            (assignment.removable &&
              assignment.planned &&
              dragId.indexOf('availableList') !== -1) ||
            (assignment.planned === undefined && assignment.removable)
          ) {
            content.push({
              content: (
                <Box className={classes.contextMenuItem}>
                  {t('common:unplanned')}
                </Box>
              ),
              onClick: unPlannedMenuHandle,
              value: { master: assignment, type, dragId, timeout: 0 },
            });
          }
        }
        break;
      case 'shadowAssignment':
        masterId = assignment.masterAssignmentId;
        content = renderContextMenuOptions([
          {
            text: t('common:view_details'),
            onClickFunc: onEditShadowAssignment,
            value: assignment,
          },
        ]);
        if (hasPermission) {
          content.push({ ...moveMenuItem, value: assignment });
        }
        break;
      //NOTE: comment because of lost of story
      case 'masterAnnouncedQuiz':
      case 'masterPopQuiz':
        masterId = quiz.id;
        planned = !!quiz?.planned;
        let tempContentQuiz = [
          {
            text: t('common:view_details'),
            onClickFunc: onEditMasterQuiz,
            value: { master: quiz, dragId },
          },
        ];
        //NOTE: Improvement TL-3331
        // if (isMasterItemInPlan(dragId) && hasPermission && quiz?.status === MASTER_ITEM_STATUS.DRAFT) {
        //   tempContentQuiz.push(
        //     { text: t('publish_all_shadow_items'), onClickFunc: onPublishShadowItem, value: { dataItem: quiz, dragId, courseItemType: COURSE_ITEM_TYPE.QUIZ } },
        //   );
        // }
        content = renderContextMenuOptions(tempContentQuiz);
        if (hasPermission) {
          content.push({ ...moveMenuItem, value: quiz });
          //NOTE: Improvement TL-3331 hide remove from course day if teacher is unable
          if (
            (quiz.removable &&
              quiz.planned &&
              dragId.indexOf('availableList') !== -1) ||
            (quiz.planned === undefined && quiz.removable)
          ) {
            content.push({
              content: (
                <Box className={classes.contextMenuItem}>
                  {t('common:unplanned')}
                </Box>
              ),
              onClick: unPlannedMenuHandle,
              value: { master: quiz, type, dragId, timeout: 0 },
            });
          }
        }
        break;
      case 'shadowAnnouncedQuiz':
      case 'shadowPopQuiz':
        masterId = quiz.masterQuizId;
        content = renderContextMenuOptions([
          {
            text: t('common:view_details'),
            onClickFunc: onEditShadowQuiz,
            value: quiz,
          },
        ]);
        if (hasPermission) {
          content.push({ ...moveMenuItem, value: quiz });
        }
        break;
      default:
        break;
    }
    if (!isAvailableItemInPlan(dragId) || planned) {
      const id = `${masterId}_${typeId}`;
      const highlighted = authContext.highlightId === id;
      content.push({
        content: (
          <Box className={classes.contextMenuItem}>
            {highlighted ? t('common:removeHighlight') : t('common:highlight')}
          </Box>
        ),
        onClick: () =>
          authContext.setData({ highlightId: !highlighted ? id : '' }, 'user'),
      });
    }
    return content;
  };

  const handleIconsMore = (event, item, type, hasShowSetTimeModal, dragId) => {
    // console.log(item, type, dragId);
    if (hasShowSetTimeModal) {
      switch (type) {
        case 'masterAssignment':
          onEditMasterAssignmentDuetime(item);
          break;
        case 'masterAnnouncedQuiz':
        case 'masterPopQuiz':
          onEditMasterQuizAnnouncedTime(item);
          break;
        default:
          onEditMasterAssignmentDuetime(item);
      }
      return;
    }
    switch (type) {
      case 'masterLesson':
      case 'shadowLesson':
        setContextMenu({
          event: {
            currentTarget: event?.currentTarget,
            times: new Date().getTime(),
          },
          type,
          lesson: item,
          dragId,
          planned: item?.planned,
        });
        break;
      case 'masterAnnouncedQuiz':
      case 'masterPopQuiz':
      case 'shadowAnnouncedQuiz':
      case 'shadowPopQuiz':
        setContextMenu({
          event: {
            currentTarget: event?.currentTarget,
            times: new Date().getTime(),
          },
          type,
          quiz: item,
          dragId,
          planned: item?.planned,
        });
        break;
      case 'masterAssignment':
      case 'shadowAssignment':
        setContextMenu({
          event: {
            currentTarget: event?.currentTarget,
            times: new Date().getTime(),
          },
          type,
          assignment: item,
          dragId,
          planned: item?.planned,
        });
        break;
      default:
        setContextMenu({
          contextMenu: {
            event: {
              currentTarget: event?.currentTarget,
              times: new Date().getTime(),
            },
            type,
            unit: item,
            dragId,
            planned: item?.planned,
          },
        });
    }
  };

  const viewShadowDetail = (activity, type) => {
    switch (type) {
      case 'shadowAssignment':
        onEditShadowAssignment(activity);
        break;
      case 'shadowLesson':
        onEditShadowLesson(activity);
        break;
      case 'shadowQuiz':
        onEditShadowQuiz(activity);
        break;
      default:
        break;
    }
  };

  const viewMasterDetail = (activity, type) => {
    switch (type) {
      case 'masterAssignment':
        onEditMasterAssignment(activity);
        break;
      case 'masterLesson':
        onEditMasterLesson(activity);
        break;
      case 'masterAnnouncedQuiz':
      case 'masterPopQuiz':
        onEditMasterQuiz(activity);
        break;
      default:
        break;
    }
  };

  const handleRelinkShadowItem = useCallback(
    (type, data) => {
      if (!!type && !isEmpty(data)) {
        const confirmData = Object.assign(
          { ...data },
          { orgId, courseId, type }
        );
        switch (type) {
          case 'lessons':
            dispatch(
              myCourseActions.mcGetShadowLessonDetail({
                orgId,
                courseId,
                shadowId: confirmData?.id,
                errorShadow: {},
              })
            );
            break;
          case 'assignments':
            dispatch(
              myCourseActions.getShadowAssignmentDetail({
                orgId,
                courseId,
                shadowId: confirmData?.id,
              })
            );
            break;
          case 'quizzes':
            dispatch(
              myCourseActions.mcGetShadowQuizDetail({
                orgId,
                courseId,
                shadowId: confirmData?.id,
                errorShadow: {},
                shadowQuizDetail: {},
              })
            );
            break;
          default:
            break;
        }
        dispatch(
          myCourseActions.myCoursesSetState({
            isShowConfirmRelinkModal: true,
            confirmData,
          })
        );
      }
    },
    [courseId, dispatch, orgId]
  );

  const handleChangeMasterStatus = useCallback(
    (data) => {
      const { type, unitId, masterId, status, courseDayId } = data;
      if (
        (!!type || type === 0) &&
        unitId &&
        masterId &&
        (!!status || status === 0) &&
        !!courseDayId
      ) {
        const payload = {
          orgId,
          courseId,
          unitId,
          data: { status },
          masterId,
          isChangingShadowItemsStatusAtMasterLevel: true,
          mcChangeShadowItemsStatusAtMasterLevelSuccess: false,
          courseDayId,
          isInPlanningPage: true,
          error: {},
        };
        switch (type) {
          case COURSE_ITEM_TYPE.LESSON:
            Object.assign(payload, { courseItemType: 'lessons' });
            break;
          case COURSE_ITEM_TYPE.ASSIGNMENT:
            Object.assign(payload, { courseItemType: 'assignments' });
            break;
          case COURSE_ITEM_TYPE.QUIZ:
            Object.assign(payload, { courseItemType: 'quizzes' });
            break;
          default:
            break;
        }
        dispatch(
          myCourseActions.mcGetShadowItemValidations({
            orgId,
            courseId,
            unitId,
            masterId,
            courseItemType: payload.courseItemType,
            isFetchingShadowItemValidations: true,
          })
        );
        dispatch(
          myCourseActions.mcChangeShadowItemsStatusAtMasterLevel(payload)
        );
      }
    },
    [courseId, dispatch, orgId]
  );

  const getUnitByCourse = useCallback(() => {
    dispatch(
      myCourseActions.mcGetUnitByCourse({
        orgId,
        courseId,
      })
    );
  }, [courseId, orgId, dispatch]);

  const getTermsByCourse = useCallback(() => {
    dispatch(
      myCourseActions.getTermsListByCourse({
        orgId,
        courseId,
        urlParams: { attribute: 'term', timezone },
        isFetchingTermsList: true,
      })
    );
  }, [courseId, orgId, timezone, dispatch]);

  const getCourseItemByUnit = useCallback(
    (searchValue) => {
      // NOTE: get unit by id on the URL to avoid repeat call API many times
      // FIXME: Remove all of place used unitId unnecessary in this function
      const id = urlSearchParams?.get('unitId');
      dispatch(
        myCourseActions.mcGetCourseItemByUnit({
          orgId,
          courseId,
          unitId: id,
          urlParams: Object.assign(
            { attribute: 'term', timezone },
            { search: searchValue }
          ),
        })
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [searchParam]
  );

  const updatePlanningData = useCallback(
    (courseDayId = []) => {
      const queueObject = {};
      courseDayId.forEach((id) => {
        queueObject[`${id}`] = true;
      });
      getCourseItemByUnit();
      dispatch(
        myCourseActions.myCoursesSetState({
          queueUpdate: { ...queueObject },
        })
      );
    },
    [dispatch, getCourseItemByUnit]
  );
  const updateMasterItem = useCallback(
    (id, sourceId, unitSelected, activity, timeout) => {
      if (!!!id) {
        return;
      }
      // dispatch(myCourseActions.mcUpdateMasterItem({
      //   orgId,
      //   courseId,
      //   courseDayId: id,
      //   sourceId,
      //   unitId: unitSelected,
      //   activity
      // }));
      const planning = {
        headers,
        method: END_POINT.mc_update_master_item.method,
        action: END_POINT.mc_update_master_item.url(orgId, courseId, id),
        payload: activity,
        updateData: {
          destinationId: id,
          sourceId,
          unitId: unitSelected,
        },
        timeout,
      };
      worker.postMessage({ planning });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  const updateShadowLesson = useCallback(
    (courseDayId, sourceId, shadowId, activity, timeout) => {
      const planning = {
        headers,
        method: END_POINT.mc_update_shadow_lesson.method,
        action: END_POINT.mc_update_shadow_lesson.url(
          orgId,
          courseId,
          shadowId
        ),
        payload: activity,
        updateData: {
          destinationId: courseDayId,
          sourceId,
        },
        timeout,
      };
      worker.postMessage({ planning });
      // dispatch(myCourseActions.mcUpdateShadowLesson({
      //   orgId,
      //   courseId,
      //   courseDayId,
      //   sourceId,
      //   shadowId,
      //   activity
      // }));
    },
    [orgId, courseId, worker]
  );

  const updateShadowQuizzes = useCallback(
    (courseDayId, sourceId, shadowId, activity, timeout) => {
      const planning = {
        headers,
        method: END_POINT.mc_update_shadow_quizzes.method,
        action: END_POINT.mc_update_shadow_quizzes.url(
          orgId,
          courseId,
          shadowId
        ),
        payload: activity,
        updateData: {
          destinationId: courseDayId,
          sourceId,
        },
        timeout,
      };
      worker.postMessage({ planning });
      // dispatch(myCourseActions.mcUpdateShadowQuizzes({
      //   orgId,
      //   courseId,
      //   courseDayId,
      //   sourceId,
      //   shadowId,
      //   activity
      // }));
    },
    [courseId, orgId, worker]
  );

  const updateShadowAssignments = useCallback(
    (courseDayId, sourceId, shadowId, activity, timeout) => {
      const planning = {
        headers,
        method: END_POINT.mc_update_shadow_assignments.method,
        action: END_POINT.mc_update_shadow_assignments.url(
          orgId,
          courseId,
          shadowId
        ),
        payload: activity,
        updateData: {
          destinationId: courseDayId,
          sourceId,
        },
        timeout,
      };
      worker.postMessage({ planning });
      // dispatch(myCourseActions.mcUpdateShadowAssignments({
      //   orgId,
      //   courseId,
      //   courseDayId,
      //   sourceId,
      //   shadowId,
      //   activity
      // }));
    },
    [orgId, courseId, worker]
  );

  const getCourseDayByGradingPeriod = useCallback(
    (id) => {
      if (!!!id) {
        return;
      }
      dispatch(
        myCourseActions.mcGetCourseDayByGradingPeriod({
          orgId,
          courseId,
          gradingPeriodId: id,
          isFetchingPlanningData: true,
        })
      );
    },
    [dispatch, orgId, courseId]
  );

  const handleChangeUnit = useCallback((id) => {
    setUnitId(id);
    setUrlParam(location, history, { unitId: id }, null, urlSearchParams);
    if (!!id) {
      getCourseItemByUnit();
    }
    setSearchParam('');
    localStorage.setItem('searchCourseActivityName', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTermId = useCallback((id) => {
    setTermId(id);
    setUrlParam(location, history, { termId: id }, null, urlSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeGradingPeriod = useCallback((id) => {
    setGradingPeriodId(id);
    getCourseDayByGradingPeriod(id);
    setUrlParam(
      location,
      history,
      { gradingPeriodId: id },
      null,
      urlSearchParams
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEditShadowLesson = (lesson) => {
    setIsVisibleShadowLesson(true);
    setShadowLessonInfo(lesson);
  };

  const onEditShadowAssignment = (assignment) => {
    setIsVisibleShadowAssignment(true);
    setShadowAssignmentInfo(assignment);
  };

  const onEditMasterAssignmentDuetime = (assignment) => {
    setIsVisibleMasterAssignmentDuetimeDialog(true);
    setMasterAssignmentInfo(assignment);
  };

  const onCloseShadowAssignmentDrawer = () => {
    setIsVisibleShadowAssignment(false);
  };

  const onEditMasterQuizAnnouncedTime = (quiz) => {
    setIsVisibleMasterQuizAnnouncedTime(true);
    setMasterQuizInfo(quiz);
  };

  const onCloseMasterQuizAnnouncedTimeDialog = () => {
    setIsVisibleMasterQuizAnnouncedTime(false);
  };

  const onEditMasterLesson = (lesson) => {
    setIsVisibleMasterLesson(true);
    const courseDayId = getCourseDayId(lesson?.dragId);
    setMasterLessonInfo({
      ...lesson?.master,
      page: 'plan',
      courseDayId: !Number.isNaN(parseInt(courseDayId)) ? courseDayId : null,
    });
  };

  const onCloseMasterAssignmentDuetimeDialog = () => {
    setIsVisibleMasterAssignmentDuetimeDialog(false);
  };

  const onCloseLessonDrawer = (type) => {
    if (type === 'master') {
      setIsVisibleMasterLesson(false);
    } else {
      setIsVisibleShadowLesson(false);
    }
  };

  const onEditShadowQuiz = (quiz) => {
    setIsVisibleShadowQuiz(true);
    setShadowQuizInfo(quiz);
  };

  const onEditMasterQuiz = (quiz) => {
    setIsVisibleMasterQuiz(true);
    const courseDayId = getCourseDayId(quiz?.dragId);
    setMasterQuizInfo({
      ...quiz?.master,
      page: 'plan',
      courseDayId: !Number.isNaN(parseInt(courseDayId)) ? courseDayId : null,
    });
  };

  const onCloseQuizDrawer = (type) => {
    if (type === 'master') {
      setIsVisibleMasterQuiz(false);
    } else {
      setIsVisibleShadowQuiz(false);
    }
  };

  const onEditMasterAssignment = useCallback(
    (assignment) => {
      setIsVisibleMasterAssignment(true);
      const courseDayId = getCourseDayId(assignment?.dragId);
      const assignmentInfo = { ...assignment?.master, page: 'plan' };
      const unitId = urlSearchParams?.get('unitId') || '';
      if (!Number.isNaN(parseInt(courseDayId))) {
        Object.assign(assignmentInfo, { courseDayId });
      }
      setMasterAssignmentInfo({ ...assignmentInfo, unitId });
    },
    [urlSearchParams]
  );

  // const onPublishShadowItem = (data) => {
  //   setIsVisiblePublishShadowItemDialog(true);
  //   const courseDayId = getCourseDayId(data?.dragId);
  //   setDataItem({ ...data?.dataItem, courseDayId });
  //   setCourseItemType(data?.courseItemType);
  // };

  // const onClosePublishShadowItemDialog = () => {
  //   setIsVisiblePublishShadowItemDialog(false);
  // };

  useEffect(() => {
    getUnitByCourse();
    getTermsByCourse();
    const unitId = urlSearchParams?.get('unitId') || '';
    const termId = urlSearchParams?.get('termId') || '';
    const gradingPeriodId = urlSearchParams?.get('gradingPeriodId') || '';
    handleChangeUnit(unitId);
    handleChangeTermId(termId);
    handleChangeGradingPeriod(gradingPeriodId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEmpty(unitList)) {
      return;
    }
    const unitId = urlSearchParams?.get('unitId') || '';
    if (!!!unitId) {
      handleChangeUnit(unitList[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitList]);

  useEffect(() => {
    if (isEmpty(termsListByCourse)) {
      return;
    }
    const termId = urlSearchParams?.get('termId') || '';
    const gradingPeriodId = urlSearchParams?.get('gradingPeriodId') || '';
    const { indexTerm, indexGdp } =
      getIndexOfTermAndGradingPeriod(termsListByCourse) || {};

    if (!!!termId) {
      handleChangeTermId(termsListByCourse[indexTerm].id);
    }
    if (!!!gradingPeriodId) {
      handleChangeGradingPeriod(
        termsListByCourse[indexTerm].gradingPeriods[indexGdp].id
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termsListByCourse]);

  useEffect(() => {
    if (isEmpty(courseItemByUnit)) {
      return;
    }
    const newData = {};
    const columnKeys = getColumnKeys(courseItemByUnit?.items);
    newData.columnKeys = columnKeys;
    newData.quoteMap = generateData(
      courseItemByUnit?.items,
      'availableList-none'
    );
    setCourseItemMap(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseItemByUnit]);

  const onCloseContextMenu = useCallback(() => {
    // setContextMenu({});
    dispatch(
      myCourseActions.myCoursesSetState({ courseDays: [], courseDayList: [] })
    );
  }, [dispatch]);

  const onSearch = (e) => {
    const { value } = e.target;
    setSearchParam(value);
  };
  useEffect(() => {
    getCourseItemByUnit(searchParam);
    localStorage.setItem('searchCourseActivityName', searchParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam]);

  const modalGetCourseItemByUnit = () => {
    getCourseItemByUnit(searchParam);
  };

  // Component will unmount
  useEffect(
    () => () => {
      if (setStateTimeout) {
        clearTimeout(setStateTimeout);
      }
      // NOTE: Remove highlight mode
      authContext.setData({ highlightId: '' }, 'user');
      dispatch(
        myCourseActions.myCoursesSetState({
          courseItemByUnit: {},
          termsListByCourse: [],
          unitList: [],
          courseDayList: [],
          courseDays: [],
          courseDaysByGradingPeriod: [],
          courseDaysHeight: {
            maxMasterCourseDayId: null,
            maxMaster: 100,
            maxShadow: [],
            maxShadowCourseDayId: [],
          },
          planningData: {},
          queueUpdate: {},
          masterHeight: 0,
          shadowHeight: {},
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  useEffect(() => {
    if (termId || gradingPeriodId) {
      dispatch(
        myCourseActions.myCoursesSetState({
          courseDayList: [],
          courseDays: [],
          courseDaysByGradingPeriod: [],
          courseDaysHeight: {
            maxMasterCourseDayId: null,
            maxMaster: 100,
            maxShadow: [],
            maxShadowCourseDayId: [],
          },
          planningData: {},
          queueUpdate: {},
          masterHeight: 0,
          shadowHeight: {},
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termId, gradingPeriodId]);

  useEffect(() => {
    if (
      mcChangeShadowItemsStatusAtMasterLevelSuccess &&
      courseDayId &&
      isInPlanningPage &&
      shadowItemValidations
    ) {
      let queueUpdate = {};
      //NOTE: Update shadow course days
      const courseDayIds = union(
        shadowItemValidations?.map((item) => item.courseDayId) ?? []
      );
      if (courseDayIds?.length > 0) {
        courseDayIds.forEach((id) => (queueUpdate[id] = true));
      }
      //NOTE: Update master course day
      queueUpdate[courseDayId] = true;
      enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
      dispatch(
        myCourseActions.myCoursesSetState({
          queueUpdate: { ...queueUpdate },
          mcChangeShadowItemsStatusAtMasterLevelSuccess: false,
          isInPlanningPage: false,
        })
      );
    }
  // eslint-disable-next-line max-len
  }, [courseDayId, dispatch, enqueueSnackbar, isInPlanningPage, mcChangeShadowItemsStatusAtMasterLevelSuccess, shadowItemValidations, t]);

  useEffect(() => {
    if (!isEmpty(error) && isInPlanningPage) {
      enqueueSnackbar(error?.message ?? t('error:general_error'), {
        variant: 'error',
      });
      dispatch(
        myCourseActions.myCoursesSetState({
          isInPlanningPage: false,
          error: {},
        })
      );
    }
  }, [dispatch, enqueueSnackbar, error, isInPlanningPage, t]);

  const CourseDayListMemo = React.useMemo(() => {
    if (isFetchingTermsList) {
      return null;
    }
    if (isFetchingPlanningData) {
      return (
        <div className={classes.wrapSkeletonPlanningData}>
          {[...Array(4)].map(() => (
            <div className={classes.skeletonPlanningData}>
              <Skeleton variant='rectangular' height={26} />
              <Skeleton variant='rectangular' height={300} />
            </div>
          ))}
        </div>
      );
    }
    if (!isEmpty(courseDaysByGradingPeriod)) {
      return (
        <div className={classes.courseDayList}>
          <CourseDayList
            t={t}
            list={courseDaysByGradingPeriod}
            handleIconsMore={handleIconsMore}
            viewShadowDetail={viewShadowDetail}
            handleRelinkShadowItem={handleRelinkShadowItem}
            hasPermission={hasPermission}
            viewMasterDetail={viewMasterDetail}
            handleChangeMasterStatus={handleChangeMasterStatus}
          />
        </div>
      );
    }
    return (
      <EmptyContent
        title={t('myCourses:no_course_days')}
        emptyImage={emptyImage}
        subTitle={t('myCourses:empty_class_schedule_subtitle')}
        className='style1'
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDaysByGradingPeriod, isFetchingPlanningData, isFetchingTermsList]);
  // console.log('Planning');

  const UnitListMemo = React.useMemo(
    () => (
      <SelectMemorization
        useTabulaSelect
        keyName='unitName'
        list={unitList}
        id={unitId || urlSearchParams?.get('unitId')}
        handleChange={handleChangeUnit}
        label={<span>{t('unit_name')}</span>}
        showEmptyList={true}
      />
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ),
    [unitId, unitList]
  );

  const TermListMemo = React.useMemo(() => {
    if (isFetchingTermsList) {
      return <Skeleton variant='rectangular' width={150} height={50} />;
    }
    return (
      <SelectMemorization
        disabled={termsListByCourse?.length === 1}
        keyName='termName'
        list={termsListByCourse}
        id={termId}
        showSubContent
        handleChange={(value) => {
          const selectedItem = termsListByCourse.find(
            (i) => i.id === Number(value)
          );
          handleChangeTermId(value);
          handleChangeGradingPeriod(selectedItem?.gradingPeriods[0].id);
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    termsListByCourse,
    termId,
    courseDaysByGradingPeriod,
    isFetchingTermsList,
  ]);

  const GradingPeriodMemo = React.useMemo(() => {
    const selectedItem = termsListByCourse.find((i) => i.id === Number(termId));
    if (selectedItem?.gradingPeriods?.length === 1) {
      return;
    }
    return (
      <SelectMemorization
        keyName='gradingPeriodName'
        list={selectedItem?.gradingPeriods}
        id={gradingPeriodId}
        handleChange={handleChangeGradingPeriod}
        showSubContent
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termsListByCourse, termId, gradingPeriodId]);
  return (
    <>
      <ConsolidateLesson updateMasterItem={updateMasterItem} />
      <ConsolidateAssignment
        updatePlanningData={updatePlanningData}
        orgId={orgId}
        courseId={courseId}
      />
      <ConsolidateAnnouncedQuiz
        updatePlanningData={updatePlanningData}
        orgId={orgId}
        courseId={courseId}
      />
      <ConsolidatePopQuiz
        updatePlanningData={updatePlanningData}
        orgId={orgId}
        courseId={courseId}
      />
      <DialogInformation />
      <WarningDialog open={openWarn} onClose={() => setOpenWarn(false)} />
      <ConfirmRelink />
      <UpdateMakeUpDeadline />
      {/* <PublishShadowItemDialog
        t={t}
        courseItemType={courseItemType}
        open={isVisiblePublishShadowItemDialog}
        dataItem={dataItem}
        onClose={onClosePublishShadowItemDialog}
        unitId={dataItem?.unitId}
        courseId={courseId}
      /> */}
      <EditShadowLesson
        shadowId={shadowLessonInfo?.id}
        open={isVisibleShadowLesson}
        sectionId={shadowLessonInfo?.sectionId}
        courseId={courseId}
        shadowLessonInfo={shadowLessonInfo}
        onCloseDrawer={() => onCloseLessonDrawer('shadow')}
        hasPermission={hasPermission}
        getCourseItemByUnit={modalGetCourseItemByUnit}
        setIsVisibleMasterLesson={setIsVisibleMasterLesson}
        setMasterLessonInfo={setMasterLessonInfo}
      />
      <ShadowAssignmentDialog
        visible={isVisibleShadowAssignment}
        // open={isVisibleShadowAssignment}
        sectionId={shadowAssignmentInfo?.sectionId}
        shadowAssignmentInfo={shadowAssignmentInfo}
        onClose={onCloseShadowAssignmentDrawer}
        updateShadowAssignments={updateShadowAssignments}
        getCourseItemByUnit={modalGetCourseItemByUnit}
      />
      {isVisibleMasterAssignment && (
        <CreateAssignmentDrawer
          visible={isVisibleMasterAssignment}
          onClose={() => setIsVisibleMasterAssignment(false)}
          assignmentId={masterAssignmentInfo?.id}
          unitId={unitId}
          unit={{ id: masterAssignmentInfo?.unitId }}
          assignmentInfo={masterAssignmentInfo}
          updateMasterItem={updateMasterItem}
          getCourseItemByUnit={modalGetCourseItemByUnit}
        />
      )}
      <MasterAssignmentDuetimeDialog
        visible={isVisibleMasterAssignmentDuetimeDialog}
        // open={isVisibleShadowAssignment}
        assignmentId={masterAssignmentInfo?.id}
        unitId={masterAssignmentInfo?.unitId}
        sectionId={shadowAssignmentInfo?.sectionId}
        // shadowAssignmentInfo={shadowAssignmentInfo}
        onClose={onCloseMasterAssignmentDuetimeDialog}
        updateMasterItem={updateMasterItem}
      />
      <MasterQuizAnnouncedTimeDialog
        isVisible={isVisibleMasterQuizAnnouncedTime}
        onCloseDialog={onCloseMasterQuizAnnouncedTimeDialog}
        quizId={masterQuizInfo?.id}
        unitId={masterQuizInfo?.unitId}
        masterQuizInfo={masterQuizInfo}
        courseId={courseId}
        updateMasterItem={updateMasterItem}
      />
      <ManageLesson
        isVisible={isVisibleMasterLesson}
        lessonInfo={masterLessonInfo}
        courseId={courseId}
        unit={{ id: masterLessonInfo?.unitId }}
        onCloseDrawer={() => onCloseLessonDrawer('master')}
        updateMasterItem={updateMasterItem}
        getCourseItemByUnit={modalGetCourseItemByUnit}
      />
      <EditShadowQuiz
        shadowId={shadowQuizInfo?.id}
        shadowQuizInfo={shadowQuizInfo}
        open={isVisibleShadowQuiz}
        sectionId={shadowQuizInfo?.sectionId}
        courseId={courseId}
        hasPermission={hasPermission}
        onCloseDrawer={() => onCloseQuizDrawer('shadow')}
        getCourseItemByUnit={modalGetCourseItemByUnit}
        updateShadowQuizzes={updateShadowQuizzes}
      />
      {isVisibleMasterQuiz && (
        <CreateEditQuiz
          orgId={orgId}
          onClose={() => onCloseQuizDrawer('master')}
          isVisible={isVisibleMasterQuiz}
          quizId={masterQuizInfo?.id}
          courseId={courseId}
          unitId={masterQuizInfo?.unitId ?? unitId}
          quizType={null}
          quizInfo={masterQuizInfo}
          updateMasterItem={updateMasterItem}
          getCourseItemByUnit={modalGetCourseItemByUnit}
        />
      )}
      <TblContextMenu
        placement={['bottom', 'right']}
        element={contextMenu?.event}
        onClose={onCloseContextMenu}
        menus={generateContextMenu()}
        hasScrollInside
      />
      <DragDropContext
        onDragEnd={onDragEnd}
        onBeforeDragStart={onDragStart}
        autoScroll={false}
      >
        <Layout2>
          <div className={classes.containerLeft}>
            <Box mb={1} mr={1.25}>
              {UnitListMemo}
            </Box>
            <Box mr={1.25}>
              <TblInputs
                // inputProps={{ ref: input => this.searchInput = input }}
                inputSize='medium'
                value={searchParam}
                placeholder={t('common:enter_name')}
                onChange={(e) => onSearch(e)}
                hasSearchIcon={true}
                hasClearIcon={true}
              />
            </Box>
            <div className='display-flex'>
              <PerfectScrollbar>
                <Box sx={{ height: 'calc(100vh - 300px)' }} mr={1.25}>
                  <AvailableListDnd
                    key='available-list'
                    courseItemMap={courseItemMap}
                    handleIconsMore={handleIconsMore}
                    columnKey='availableList-none'
                    hasPermission={hasPermission}
                  />
                </Box>
              </PerfectScrollbar>
            </div>
          </div>
          <div title={t('class_schedule')}>
            <div className={classes.containerRight}>
              {/* <Box display='flex' alignSelf='center' mt={2} mb={2} ml={1}>
                <Box display='flex' alignSelf='center' css={{ lineHeight: 'normal' }} mr={0.5}>
                  <InfoOutlinedIcon className={classes.subTitle} />
                </Box>
                <Box display='flex' alignSelf='center'>
                  <Typography component='span' color='primary' className={classes.infoContent} >Drag Course Activities to All Sections or click “Add Activity” to planning.</Typography>
                </Box>
              </Box> */}
              <Box display='flex' mb={2}>
                <Box mr={5}>{TermListMemo}</Box>
                <Box>{GradingPeriodMemo}</Box>
              </Box>
              {CourseDayListMemo}
            </div>
          </div>
        </Layout2>
      </DragDropContext>
    </>
  );
}, areEqual);
Plan.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  orgId: PropTypes.number,
  timezone: PropTypes.string,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  permission: PropTypes.object,
  authContext: PropTypes.object,
};

export default Plan;
