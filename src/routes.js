//   const sharedRoutes = require.context('./shared', true, /routes\.js$/).keys();
//   for(let i = 0; i < sharedRoutes.length; i++) {
//     path = sharedRoutes[i];
//     path = path.substr(1, path.length-1);
//     res = require(`./shared${path}`);
//     importRoutes.push(...res.default);
//   }
//   return importRoutes;
// }
// export default getRoutes;
// const sharedRoutes = require.context('./shared', true, /routes\.js$/).keys();
// for(let i = 0; i < sharedRoutes.length; i++) {
//     path = sharedRoutes[i];
//     path = path.substr(1, path.length-1);
//     // import(`./shared${path}`).then((res) => {
//     //   console.log(res);
//     //   importRoutes.push(...res.default);
//     // });
//     importRoutes.push(import(`./shared${path}`));

// }
import componentRoutes from 'components/routes';

import AllCourses from 'shared/AllCourses/routes';
import AuthRoutes from 'shared/Auth/routes';
import Google from 'shared/Google/routes';
import Media from 'shared/Media/routes';

import Agenda from 'modules/Agenda/routes';
import AssessmentMethod from 'modules/AssessmentMethod/routes';
import Calendar from 'modules/Calendar/routes';
import DomainSettings from 'modules/DomainSettings/routes';
import Grader from 'modules/Grader/routes';
import GradeReport from 'modules/GradeReport/routes';
import GuardianStudent from 'modules/GuardianStudent/routes';
import ManageCourseTemplate from 'modules/ManageCourseTemplate/routes';
import MyCourses from 'modules/MyCourses/routes';
import MyProfileRoutes from 'modules/MyProfile/routes';
import MyTasks from 'modules/MyTasks/routes';
import SchoolLibrary from 'modules/SchoolLibrary/routes';
import SchoolYear from 'modules/SchoolYear/routes';
import Subject from 'modules/Subject/routes';
import UserRoutes from 'modules/Users/routes';

export default [
  ...componentRoutes,
  ...AuthRoutes,
  ...UserRoutes,
  ...MyProfileRoutes,
  ...SchoolYear,
  ...DomainSettings,
  ...AllCourses,
  ...MyCourses,
  ...Subject,
  ...AssessmentMethod,
  ...Media,
  ...GuardianStudent,
  ...MyTasks,
  ...Agenda,
  ...Calendar,
  ...Google,
  ...Grader,
  ...GradeReport,
  ...SchoolLibrary,
  ...ManageCourseTemplate,

  // ...ContactUs
];
