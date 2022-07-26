export default {
    mc_get_grade_weight: {
      url: (id, courseId) =>
        `${process.env.REACT_APP_API_URL}/organization/${id}/courses/${courseId}?attribute=gradeWeight`,
      method: 'GET',
    },
    mc_update_grade_weight: {
      url: (id, courseId) =>
        `${process.env.REACT_APP_API_URL}/organization/${id}/courses/${courseId}?attribute=gradeWeight`,
      method: 'PUT',
    },
  };