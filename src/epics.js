// requires and returns all modules that match  
// BUG: https://github.com/webpack/webpack/issues/9300
// Cannot move to function
// const modules = require.context('./modules', true, /epics\.js$/).keys();

// const epics = [];
// let path = '';
// let res;
// for(let i = 0; i < modules.length; i++) {
//     path = modules[i];
//     path = path.substr(1, path.length-1);
//     res = require(`./modules${path}`);
//     epics.push(...res.default);
// }
// const sharedModules = require.context('./shared', true, /epics\.js$/).keys();

// const sharedEpics = [];
// for(let i = 0; i < sharedModules.length; i++) {
//     path = sharedModules[i];
//     path = path.substr(1, path.length-1);
//     res = require(`./shared${path}`);
//     sharedEpics.push(...res.default);
// }
// const rootEpics = combineEpics(...epics, ...sharedEpics);
import allCourses from 'shared/AllCourses/epics';
import authEpics from 'shared/Auth/epics';
import common from 'shared/Common/epics';
import google from 'shared/Google/epics';
import importEpic from 'shared/Import/epics';
import mediaEpics from 'shared/Media/epics';
import MyTasksSharedEpics from 'shared/MyTasks/epics';

import agenda from 'modules/Agenda/epics';
import assessmentMethod from 'modules/AssessmentMethod/epics';
import calendarEpic from 'modules/Calendar/epics';
import contactUs from 'modules/ContactUs/epics';
import domainSettings from 'modules/DomainSettings/epics';
import grader from 'modules/Grader/epics';
import gradeReport from 'modules/GradeReport/epics';
import guardianStudent from 'modules/GuardianStudent/epics';
import manageCourseTemplate from 'modules/ManageCourseTemplate/epics';
import myCourses from 'modules/MyCourses/epics';
import myProfile from 'modules/MyProfile/epics';
import myTasksEpics from 'modules/MyTasks/epics';
import notification from 'modules/Notifications/epics';
import schoolLibrary from 'modules/SchoolLibrary/epics';
import schoolYear from 'modules/SchoolYear/epics';
import subject from 'modules/Subject/epics';
import userEpics from 'modules/Users/epics';
import { combineEpics } from 'redux-observable';

export default combineEpics(
  ...authEpics,
  ...userEpics,
  ...mediaEpics,
  ...schoolYear,
  ...allCourses,
  ...domainSettings,
  ...myProfile,
  ...subject,
  ...myCourses,
  ...guardianStudent,
  ...assessmentMethod,
  ...common,
  ...myTasksEpics,
  ...MyTasksSharedEpics,
  ...calendarEpic,
  ...agenda,
  ...contactUs,
  ...notification,
  ...google,
  ...grader,
  ...gradeReport,
  ...manageCourseTemplate,
  ...schoolLibrary,
  ...importEpic
);
