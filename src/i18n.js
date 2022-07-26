import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';

import agenda from './locales/en/agenda.json';
import allCourses from './locales/en/allCourses.json';
import assessmentMethod from './locales/en/assessmentMethod.json';
import auth from './locales/en/auth.json';
import calendar from './locales/en/calendar.json';
import common from './locales/en/common.json';
import confirmMessage from './locales/en/confirmMessage.json';
import contactUs from './locales/en/contactUs.json';
import course from './locales/en/course.json';
import curriculumTopics from './locales/en/curriculumTopics.json';
import dialog from './locales/en/dialog.json';
import districtLibrary from './locales/en/districtLibrary.json';
import domain from './locales/en/domain.json';
import error from './locales/en/error.json';
import google from './locales/en/google.json';
import grader from './locales/en/grader.json';
import importFile from './locales/en/importFile.json';
import language from './locales/en/language.json';
import lesson from './locales/en/lesson.json';
import manageCourseTemplate from './locales/en/manageCourseTemplate.json';
import media from './locales/en/media.json';
import myCourses from './locales/en/myCourses.json';
import myProfile from './locales/en/myProfile.json';
import myTasks from './locales/en/myTasks.json';
import notification from './locales/en/notification.json';
import plan from './locales/en/plan.json';
import schoolLibrary from './locales/en/schoolLibrary.json';
import schoolYear from './locales/en/schoolYear.json';
import status from './locales/en/status.json';
import students from './locales/en/students.json';
import subject from './locales/en/subject.json';
import tour from './locales/en/tour.json';
import user from './locales/en/user.json';

const resources = {
  en: {
    common,
    auth,
    course,
    allCourses,
    myCourses,
    lesson,
    user,
    students,
    error,
    schoolYear,
    dialog,
    subject,
    assessmentMethod,
    myProfile,
    plan,

    calendar,
    domain,
    media,
    myTasks,
    status,
    agenda,
    contactUs,
    notification,
    tour,
    google,
    language,
    grader,
    confirmMessage,
    schoolLibrary,
    manageCourseTemplate,
    curriculumTopics,
    districtLibrary,
    importFile
  }
};
// for(let i = 0; i < enResources.length; i++) {
//     path = enResources[i];
//     path = path.substr(1, path.length-1);
//     res = require(`./locales${path}`);
//     name = path.split('/');
//     name = name[name.length - 1];
//     name = name.split('.')[0];
//     resources.en = {...resources.en, [name]: {...res}};
// }
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;