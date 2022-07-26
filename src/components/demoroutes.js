import CourseNavigation from './CourseNavigation';
import NotificationSample from './Notifications/sample';
import SampleAutoComplete from './TblAutocomplete/sample';
import TblButtonSample from './TblButton/sample';
import SampleCheckbox from './TblCheckBox/sample';
import SampleDialog from './TblDialog/sample';
import TblIconButtonSample from './TblIconButton/sample';
import TblInputSample from './TblInputs/sample';
import TblSelect from './TblSelect/sample';
import SampleSwitch from './TblSwitch/sample';

export default [

  {
    title: 'Inputs',
    path: 'input',
    Component: TblInputSample,
  },
  {
    title: 'Buttons',
    path: 'buttons',
    Component: TblButtonSample,
  },
  {
    title: 'Autocomplete',
    path: 'autocomplete',
    Component: SampleAutoComplete,
  },
  {
    title: 'Notification',
    path: 'notification',
    Component: NotificationSample,
  },
  {
    title: 'Select',
    path: 'select',
    Component: TblSelect,
  },
  {
    title: 'Course Navigation',
    path: 'nav',
    Component: CourseNavigation,
  },
  {
    title: 'Info Popup',
    path: 'infoPopup',
    Component: SampleDialog,
  },
  {
    title: 'Icon Button',
    path: 'iconButton',
    Component: TblIconButtonSample,
  },
  {
    title: 'Switch',
    path: 'switch',
    Component: SampleSwitch,
  },
  {
    title: 'Checkbox',
    path: 'Checkbox',
    Component: SampleCheckbox,
  },
];
