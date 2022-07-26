import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { END_POINT } from 'modules/MyCourses/constants';
import moment from 'moment';

const headers = {
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
};
function useGetCourseDayListBySection({ sectionId, startTime }) {
  const [courseDayList, setCourseDayList] = useState([]);
  const match = useRouteMatch();
  const { courseId } = match?.params || {};
  const authContext = useContext(AuthDataContext);
  const { organizationId, timezone } = authContext.currentUser;
  const url = END_POINT.mc_get_course_day_list.url(
    organizationId,
    courseId,
    sectionId,
    { timezone }
  );
  const fetchData = useCallback(() => {
    if (!!!sectionId) {
      return;
    }
    fetch(url, {
      method: 'GET',
      headers,
    })
      .then((results) => results.json())
      .then((data) => {
        if (data?.schedules) {
          const cloneSchedules = data?.schedules.map((i) => {
            i.dates = i.dates.filter(
              (date) =>
                moment().isBefore(date.endTime) &&
                moment(startTime).isBefore(date.endTime)
            );
            return i;
          });
          setCourseDayList(cloneSchedules);
        }
      });
  }, [sectionId, startTime, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return courseDayList;
}

export default useGetCourseDayListBySection;
