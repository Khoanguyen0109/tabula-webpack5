import React, { createContext, useContext } from 'react';

import isEmpty from 'lodash/isEmpty';

import PropTypes from 'prop-types';

import { generateData, getColumnKeys } from '../../components/Plan/utils';

export const PlanContext = createContext(null);

const PlanProvider = (props) => {
  const { orgId, courseId } = props;
  const allData = {};

  const getData = (courseDayId) => {
    if (allData[courseDayId]) {
      return allData[courseDayId];
    }
    return [];
  };

  // const getHeight = useCallback((key) => {
  //   var test_elements = document.getElementsByClassName(key);
  //   var maxHeight = 0;
  //   for (var i = 0; i < test_elements.length; i++) {
  //     maxHeight = Math.max(maxHeight, test_elements[i].offsetHeight);
  //   }
  //   return maxHeight;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const fetchData = (courseDayId) => {
    fetch(
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/course-days/${courseDayId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    )
      .then((results) => results.json())
      .then((data) => {
        const courseDayData = data?.courseDay;
        const masterItem = {};
        const masterColumnKeys = getColumnKeys(courseDayData?.items);
        masterItem.columnKeys = masterColumnKeys;
        masterItem.quoteMap = generateData(
          courseDayData?.items,
          `masterItem-${courseDayId}`
        );

        const shadowItem = [];

        if (!isEmpty(courseDayData?.sectionSchedules)) {
          courseDayData.sectionSchedules.forEach((s) => {
            const shadowKey = `shadowItem-${courseDayId}-${s.id}`;
            const newData = {};
            const columnKeys = getColumnKeys(s?.items);
            newData.columnKeys = columnKeys;
            newData.data = s;
            newData.quoteMap = generateData(s?.items, shadowKey);
            shadowItem.push(newData);
          });
        }

        // setCourseDayDetail({
        //   masterItem,
        //   shadowItem,
        //   courseDayData
        // });
        allData[courseId] = {
          masterItem,
          shadowItem,
          courseDayData,
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const moveItem = () => {
  };

  return (
    <PlanContext.Provider value={{ getData, fetchData, moveItem }} {...props} />
  );
};
PlanProvider.propTypes = {
  orgId: PropTypes.number,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export const usePlanDataContext = () => useContext(PlanContext);

export default PlanProvider;
