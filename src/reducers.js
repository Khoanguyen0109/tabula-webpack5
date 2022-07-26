import Import from 'shared/Import/reducers';

import { combineReducers } from 'redux';
// function getReducers() {
// BUG: https://github.com/webpack/webpack/issues/9300
// Cannot move to function
//   const modules = require.context('./modules', true, /reducers\.js$/).keys();
//   let reducers = {};
//   let path = '';
//   let res;
//   let name = '';
//   for(let i = 0; i < modules.length; i++) {
//       path = modules[i];
//       path = path.substr(1, path.length-1);
//       name = path.split('/')[1];
//       // res = require(`./modules${path}`);
//       reducers[name] = import(`./modules${path}`);
//       // reducers[name] = res.default;
//   }

//   const shareModules = require.context('./shared', true, /reducers\.js$/).keys();
//   for(let i = 0; i < shareModules.length; i++) {
//     path = shareModules[i];
//     path = path.substr(1, path.length-1);
//     name = path.split('/')[1];
//     // res = require(`./shared${path}`);
//     reducers[name] = import(`./shared${path}`);
//   }
//   // return reducers;
// // }
import Google from './/shared/Google/reducers';
import AssessmentMethod from './modules/AssessmentMethod/reducers';
import ContactUs from './modules/ContactUs/reducers';
import MyCourses from './modules/MyCourses/reducers';
import MyProfile from './modules/MyProfile/reducers';
import Notification from './modules/Notifications/reducers';
import SchoolYear from './modules/SchoolYear/reducers';
import Subject from './modules/Subject/reducers';
import Auth from './shared/Auth/reducers';
import Common from './shared/Common/reducers';
import MyTasksShared from './shared/MyTasks/reducers';
const createReducer = (asyncReducers) =>
  combineReducers({
    Auth,
    MyProfile,
    MyTasksShared,
    Subject,
    SchoolYear,
    AssessmentMethod,
    Common,
    ContactUs,
    Notification,

    MyCourses,
    Google,
    Import,
    ...asyncReducers
  });
export default createReducer;