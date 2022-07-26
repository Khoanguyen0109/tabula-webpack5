import { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

// import { generateData, getColumnKeys } from '../../components/Plan/utils';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import { objectToParams } from 'utils';

import myCourseActions from '../../actions';

const headers = {
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
};
function useAPIHook(props) {
  // const [errorCourseDayDetail, setErrorCourseDayDetail] = useState(null);
  // const [loadingCourseDayDetail, setLoadingCourseDayDetail] = useState(true);
  const { courseDayId, courseId, worker, gradingPeriodId, isScrolling } = props;
  const planningData = useSelector((state) => state.AllCourses.planningData);
  const queueUpdate = useSelector((state) => state.AllCourses.queueUpdate);
  // const masterHeight = useSelector(state => state.AllCourses.masterHeight);
  // const shadowHeight = useSelector(state => state.AllCourses.shadowHeight);
  const gradingPeriodList = useSelector(
    (state) => state.AllCourses.gradingPeriodList
  );
  const gradingPeriod = gradingPeriodList?.find(
    (g) => g.id === gradingPeriodId
  );
  let sections = [];
  if (gradingPeriod) {
    sections = gradingPeriod.sections;
  }
  sections.sort();
  const dispatch = useDispatch();

  const updateData = useSelector((state) => state.AllCourses.updateData);
  const mcUpdateShadowLessonSuccess = useSelector(
    (state) => state.AllCourses.mcUpdateShadowLessonSuccess
  );
  const mcUpdateShadowAssignmentsSuccess = useSelector(
    (state) => state.AllCourses.mcUpdateShadowAssignmentsSuccess
  );
  const mcUpdateShadowQuizzesSuccess = useSelector(
    (state) => state.AllCourses.mcUpdateShadowQuizzesSuccess
  );
  const courseDaysHeight = useSelector(
    (state) => state.AllCourses.courseDaysHeight
  );
  const authContext = useContext(AuthDataContext);
  const { organizationId, timezone } = authContext.currentUser;
  if (worker) {
    worker.addCallback(courseDayId, (e) => {
      const data = e.data;
      // console.log(data, courseDayId);
      if (data.courseDayId === courseDayId) {
        if (!data.processedData) {
          // data.courseDayId = courseDayId;
          worker.postMessage({ processData: data, sections });
        } else {
          // console.log(data.processedData);
          processData(data.processedData);
        }
      }
    });
  }
  // const getHeight = useCallback((key) => {
  //   var test_elements = document.getElementsByClassName(key);
  //   var maxHeight = 0;
  //   for (var i = 0; i < test_elements.length; i++) {
  //     maxHeight = Math.max(maxHeight, test_elements[i].offsetHeight);
  //   }
  //   return maxHeight;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const getHeightBySelector = (selector) => {
    let element = document.querySelector(selector);
    if (element) {
      return element.offsetHeight;
    }
    return 100;
  };
  // useEffect(() => {
  //   if (courseDay && !isEqual(courseDayDetail,courseDay)) {
  //     setCourseDayDetail(courseDay);
  //   }
  // }, [courseDay, courseDayDetail, courseDayId]);
  const processData = (data) => {
    let newPlanningData = planningData;
    // Clear state if planing data too much
    if (newPlanningData.length > 50) {
      newPlanningData = {};
    }
    if (!isEqual(data, newPlanningData[courseDayId])) {
      newPlanningData[courseDayId] = data;
    }
    queueUpdate[courseDayId] = false;
    dispatch(
      myCourseActions.myCoursesSetState({
        planningData: newPlanningData,
        queueUpdate,
      })
    );
    // setCourseDayDetail(planningData[courseDayId]);
  };
  const fetchData = useCallback(() => {
    const planning = {
      headers,
      method: 'GET',
      courseDayId,
      action: `${
        process.env.REACT_APP_API_URL
      }/organizations/${organizationId}/courses/${courseId}/course-days/${courseDayId}?${objectToParams(
        { timezone }
      )}`,
    };
    if (worker) {
      worker.postMessage({
        planning,
      });
    }
    // fetch(`${process.env.REACT_APP_API_URL}/organizations/${organizationId}/courses/${courseId}/course-days/${courseDayId}`, {
    //   method: 'GET',

    // })
    //   .then(results => results.json())
    //   .then(data => {

    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDayId]);

  const calculateMaxShadowByIndex = useCallback(
    (index) => {
      const keys = Object.keys(courseDaysHeight);
      let max = 0;
      let id = '';
      for (let i = 0; i < keys.length; i++) {
        // Just check courseDayId, skip other key
        if (!isNaN(keys[i]) && courseDaysHeight[keys[i]].shadow[index] > max) {
          max = courseDaysHeight[keys[i]].shadow[index];
          id = keys[i];
        }
      }
      return [max, id];
    },
    [courseDaysHeight]
  );

  const calculateMaxMaster = useCallback(() => {
    const keys = Object.keys(courseDaysHeight);
    let max = 0;
    let id = 0;
    for (let i = 0; i < keys.length; i++) {
      // Just check courseDayId, skip other key
      if (!isNaN(keys[i]) && courseDaysHeight[keys[i]].masterHeight > max) {
        max = courseDaysHeight[keys[i]].masterHeight;
        id = keys[i];
      }
    }
    return [max, id];
  }, [courseDaysHeight]);

  const calculateHeight = useCallback(() => {
    if (isEmpty(planningData[courseDayId]) || isScrolling) {
      return;
    }
    let courseDayHeight = courseDaysHeight[courseDayId] ?? { shadow: [] };
    let newPlanning;
    courseDayHeight.masterHeight = getHeightBySelector(
      `#course-day-${courseDayId} .masterHeight`
    );
    if (courseDayHeight.masterHeight > courseDaysHeight.maxMaster) {
      courseDaysHeight.maxMaster = courseDayHeight.masterHeight;
      courseDaysHeight.maxMasterCourseDayId = courseDayId;
    }
    if (
      courseDayHeight.masterHeight < courseDaysHeight.maxMaster &&
      courseDaysHeight.maxMasterCourseDayId === courseDayId
    ) {
      const [newMaxMaster, newMasterId] = calculateMaxMaster();
      courseDaysHeight.maxMaster = newMaxMaster;
      courseDaysHeight.maxMasterCourseDayId = newMasterId;
    }
    // if (!isEmpty(planningData[courseDayId].masterItem) && masterHeight !== getHeight('masterHeight')) {
    //   dispatch(myCourseActions.myCoursesSetState({ masterHeight: getHeight('masterHeight') }));
    // }
    // let change = false;
    if (!isEmpty(planningData[courseDayId].shadowItem)) {
      // const shadowHeight = {};
      planningData[courseDayId].shadowItem.forEach((item, index) => {
        // if (shadowHeight[`shadow_${index}`] !== getHeight(`shadow_${index}`)) {
        //   shadowHeight[`shadow_${index}`] = getHeight(`shadow_${index}`);
        //   change = true;
        // }
        courseDayHeight.shadow[index] = getHeightBySelector(
          `#course-day-${courseDayId} .shadow_${index}`
        );
        if (
          !courseDaysHeight.maxShadow[index] ||
          courseDayHeight.shadow[index] > courseDaysHeight.maxShadow[index]
        ) {
          courseDaysHeight.maxShadow[index] = courseDayHeight.shadow[index];
          courseDaysHeight.maxShadowCourseDayId[index] = courseDayId;
          //Force re-render
          newPlanning = { ...planningData };
        }
        if (
          courseDayHeight.shadow[index] < courseDaysHeight.maxShadow[index] &&
          courseDayId === courseDaysHeight.maxShadowCourseDayId[index]
        ) {
          const [newMax, newId] = calculateMaxShadowByIndex(index);
          courseDaysHeight.maxShadow[index] = newMax;
          courseDaysHeight.maxShadowCourseDayId[index] = newId;
          //Force re-render
          newPlanning = { ...planningData };
        }
      });
      // if (change) {
      //   dispatch(myCourseActions.myCoursesSetState({ shadowHeight: {...shadowHeight} }));
      // }
    }
    courseDaysHeight[courseDayId] = courseDayHeight;
    // console.log(courseDaysHeight);
    dispatch(
      myCourseActions.myCoursesSetState({
        courseDaysHeight,
        planningData: newPlanning ?? planningData,
      })
    );
  }, [
    calculateMaxMaster,
    calculateMaxShadowByIndex,
    courseDayId,
    courseDaysHeight,
    dispatch,
    isScrolling,
    planningData,
  ]);

  useEffect(() => {
    calculateHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planningData[courseDayId]]);

  useEffect(() => {
    if (
      mcUpdateShadowLessonSuccess ||
      mcUpdateShadowAssignmentsSuccess ||
      mcUpdateShadowQuizzesSuccess
    ) {
      // console.log(updateData, 'updateData');
      if (
        Number(updateData.destinationId) === Number(courseDayId) ||
        (Number(updateData.sourceId) !== 0 &&
          Number(updateData.sourceId) === Number(courseDayId))
      ) {
        fetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);

  useEffect(() => {
    // console.log('Queue', courseDayId);
    if (queueUpdate[courseDayId]) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueUpdate]);

  // return [courseDayDetail, errorCourseDayDetail, loadingCourseDayDetail];
  // console.log('render hook', courseDayId);
  return [fetchData];
}

export default useAPIHook;
