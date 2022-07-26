/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import concat from 'lodash/concat';
import sum from 'lodash/sum';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblCheckBox from 'components/TblCheckBox';
import TblInputs from 'components/TblInputs';

import clsx from 'clsx';
import { Field, Formik } from 'formik';
import { ROUTE_MY_COURSES } from 'modules/MyCourses/constantsRoute';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { AGENDA_ACTIVITY_TYPE } from '../constants';
import StudentViewActivityDrawer from '../containers/StudentViewActivityDrawer';
import TeacherViewActivityDrawer from '../containers/TeacherViewActivityDrawer';
import { getIcon } from '../utils';

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    paddingLeft: props?.studentView ? theme.spacing(1) : 0,
  }),
  noneValue: {
    fontSize: theme.fontSize.normal,
    color: theme.newColors.gray[700],
  },
  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 8,
  },
  flexAlignStart: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  formItem: {
    marginTop: 10,
    // marginLeft: theme.spacing(-1)
  },
  label: {
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
    textTransform: 'capitalize',
  },

  value: {
    fontSize: theme.fontSize.normal,
    color: theme.mainColors.primary1[0],
    wordBreak: 'break-word',
  },
  contentWrapper: {
    marginTop: -12,
  },
  totalTime: {
    whiteSpace: 'pre',
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSize.normal,
  },
  timeNote: {
    whiteSpace: 'pre',
    fontWeight: theme.fontWeight.semi,
    color: theme.newColors.gray[800],
    fontSize: theme.fontSize.small,
  },
  note: {
    color: theme.newColors.gray[700],
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
  underlineText: {
    color: theme.mainColors.primary2[0],
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  rootFormControl: {
    alignItems: 'flex-start',
    marginLeft: 0,
    marginTop: theme.spacing(1),
    width: '100%',
    '& .MuiFormControlLabel-label': {
      width: '100%',
    },
    cursor: 'default',
  },
  checkBox: (props) => ({
    // paddingLeft: 0,
    display: props.studentView ? 'none' : '',
  }),
  dateTime: {
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.normal,
    marginBottom: theme.spacing(3),
  },
}));

const useStylesActivityDetail = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  rootActivity: {
    borderLeft: `4px solid ${theme.newColors.gray[300]}`,
    cursor: 'default',
  },
  rootDraft: {
    marginTop: theme.spacing(1),
  },
  labelWrapper: {
    marginTop: 10,
  },

  icon: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSizeIcon.medium,
  },
  activityName: {
    color: theme.mainColors.primary1[0],
    maxWidth: 'calc(100% - 130px)',
    fontSize: theme.fontSize.normal,
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    overflow: 'hidden',
    width: 'fit-content',
    whiteSpace: 'nowrap',
  },
  activityNameWrapper: {
    marginLeft: theme.spacing(1),
    width: '100%',
  },
  activityDue: {
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSize.small,
    width: 'fit-content',
    cursor: 'pointer',
  },
  itemButton: {
    marginLeft: 'auto',
    marginRight: 92,
    display: 'flex',
    alignItems: 'center',
  },
  lockIcon: {
    color: theme.mainColors.green[0],
    background: theme.openColors.green[0],
    width: 32,
    height: 32,
    padding: 4,
    borderRadius: theme.spacing(1),
    marginRight: 4,
  },
  disableLockIcon: {
    color: theme.mainColors.gray[6],
    background: theme.newColors.gray[300],
  },
}));

function NoneValue() {
  const { t } = useTranslation(['common']);
  const classes = useStyles();

  return <div className={classes.noneValue}>{t('common:none')}</div>;
}

// const getIcon = (item, classes) => {
//   if (item?.shadowLessons || item?.lessonName)
//     return <ImportContactsIcon className={classes.icon} />;
//   if (item?.shadowQuizzes?.masterQuiz?.quizType === 1 || item?.quizType === 1)
//     return <PlaylistAddCheckIcon className={classes.icon} />;
//   if (item?.shadowQuizzes?.masterQuiz?.quizType === 2 || item?.quizType === 2)
//     return <PollIcon className={classes.icon} />;
//   if (item?.shadowAssignments || item?.assignmentName)
//     return <BallotIcon className={classes.icon} />;
//   return <ImportContactsIcon className={classes.icon} />;
// };
function ActivityDetail(props) {
  const { t } = useTranslation(['agenda', 'common']);
  const { activity, viewActivityDetail } = props;
  const classesActivity = useStylesActivityDetail();
  const classes = useStyles();

  const renderLabel = (activityType, agendaType) => {
    let type = '';

    if (activityType === 1 && agendaType === 0) {
      type = t('assigned');
    }
    if (activityType === 1 && agendaType === 1) {
      type = t('due');
    }
    if (activityType === 3 && agendaType === 0) {
      type = t('announced');
    }
    if (activityType === 3 && agendaType === 1) {
      type = t('taken');
    }
    const activity = Object.keys(AGENDA_ACTIVITY_TYPE).find(
      (key) => AGENDA_ACTIVITY_TYPE[key] === activityType).toLowerCase();
    const name = t(`common:${activity}`);
    return `${name} ${type}`;
  };

  const renderSubInfo = (activityType, agendaType, startTime, endTime) => {
    if (activityType === 1 && agendaType === 0) {
      // assignment + assigned
      return `${t('due_on')}: ${moment(endTime).format(
        'MMM DD, YYYY - hh:mm a'
      )} `;
    }
    if (activityType === 3 && agendaType === 0) {
      // quiz annouced
      return `${t('taken_on')}: ${moment(startTime).format(
        'MMM DD, YYYY - hh:mm a'
      )}`;
    }
    return null;
  };

  const durationEachActivity = (activity) => {
    let duration = 5;
    if (activity?.shadowLessons?.masterLesson?.duration)
      duration = activity?.shadowLessons?.masterLesson?.duration;
    if (activity?.shadowQuizzes?.masterQuiz?.duration)
      duration = activity?.shadowQuizzes?.masterQuiz?.duration;
    if (activity?.shadowAssignments?.masterAssignment?.duration)
      duration = activity?.shadowAssignments?.masterAssignment?.duration;

    return duration;
  };

  return (
    <div className={classesActivity.root}>
      <div
        className={clsx(classes.flexAlignCenter, classesActivity.labelWrapper)}
      >
        <div className={classes.label}>
          {renderLabel(
            activity?.activityType,
            activity?.agendaType
          ).toLowerCase()}
        </div>
        <div className={classes.timeNote}>
          {` (${t('common:min', { count: durationEachActivity(activity) })})`}
        </div>
      </div>
      {(activity?.shadowAssignments?.masterAssignment?.assignmentName ||
        activity?.shadowQuizzes?.masterQuiz?.quizName ||
        activity?.shadowLessons?.masterLesson?.lessonName) && (
          <div
            className={clsx(
              classes.flexAlignCenter,
              classesActivity.rootActivity
            )}
          >
            {getIcon(activity, classesActivity)}
            <div className={classesActivity.activityNameWrapper}>
              <Typography
                noWrap
                className={classesActivity.activityName}
                onClick={(e) => viewActivityDetail(e, activity)}
              >
                {activity?.shadowAssignments?.masterAssignment?.assignmentName ||
                  activity?.shadowQuizzes?.masterQuiz?.quizName ||
                  activity?.shadowLessons?.masterLesson?.lessonName}
              </Typography>
              <div
                className={classesActivity.activityDue}
                onClick={(e) => viewActivityDetail(e, activity)}
              >
                {renderSubInfo(
                  activity?.activityType,
                  activity?.agendaType,
                  activity?.shadowQuizzes?.executeTime,
                  activity?.shadowAssignments?.originalDueTime
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

function DraftActivityDetail(props) {
  // const { t } = useTranslation('agenda', 'common');
  const {
    activity,
    viewActivityDetail,
    // publishActivity,
    // isPrimaryTeacher,
  } = props;
  const classesActivity = useStylesActivityDetail();
  const classes = useStyles();

  // const toolTipTitle = (activity) => {
  //   const validation = activity?.validation;
  //   return (
  //     <div>
  //       <div>{t('this_item_is_not_publishable_due_to')}</div>

  //       {find(validation, (item) => item.subcode === 1) && (
  //         <div>{t('missing_required_fields_at_master_level')}</div>
  //       )}

  //       {find(validation, (item) => item.subcode === 3) &&
  //         activity?.assignmentName && <div>{t('missing_due_on')}</div>}

  //       {find(validation, (item) => item.subcode === 4) &&
  //         activity?.assignmentName && <div>{t('due_time_is_in_the_past')}</div>}

  //       {find(validation, (item) => item.subcode === 2) &&
  //         activity?.quizName && <div>{t('missing_announced_on')}</div>}

  //       {find(validation, (item) => item.subcode === 4) &&
  //         activity?.quizName && <div>{t('taken_time_is_in_the_past')}</div>}
  //     </div>
  //   );
  // };
  return (
    <div className={classesActivity.rootDraft}>
      {(activity?.assignmentName ||
        activity?.quizName ||
        activity?.lessonName) && (
          <div
            className={clsx(
              classes.flexAlignCenter,
              classesActivity.rootActivity
            )}
          >
            {getIcon(activity, classesActivity)}
            <div
              className={classesActivity.activityName}
              onClick={(e) => viewActivityDetail(e, activity)}
            >
              {activity?.assignmentName ||
                activity?.quizName ||
                activity?.lessonName}
            </div>
            <div
              className={classesActivity.itemButton}
              onClick={(e) => e.stopPropagation()}
            >
              {/* {activity?.pulishable ? (
              <LockOpenIcon className={classesActivity.lockIcon} />
            ) : (
              <Tooltip placement='top' title={toolTipTitle(activity)}>
                <LockOpenIcon
                  className={clsx(
                    classesActivity.lockIcon,
                    classesActivity.disableLockIcon
                  )}
                />
              </Tooltip>
            )}
            {activity?.pulishable && isPrimaryTeacher && (
              <TblButton
                size='small'
                variant='contained'
                color='secondary'
                onClick={(e) => publishActivity(e, activity)}
              >
                {activity?.assignmentName ? t('common:assign') : t('common:publish')}
              </TblButton>
            )} */}
            </div>
          </div>
        )}
    </div>
  );
}

function AgendaContent(props) {
  const {
    agendaDetailProp,
    editAgendaDetail,
    markAgendaActivityComplete,
    agenda,
    studentView,
    agendaProps,
    // activityDetails,
    getAssignmentDetails,
    getLessonDetails,
    getQuizDetails,
    drawer1Ref,
    selectedCourseBlock,
    publishActivity,
    courseTeacher,
    currentUserId,
    draftActivities,
  } = props;
  const { t } = useTranslation('agenda', 'common');
  const isPrimaryTeacher = currentUserId === courseTeacher?.userId;
  // const classesActivity = useStylesActivityDetail();
  const classes = useStyles(props);
  const formikFormRef = useRef(null);
  const history = useHistory();
  const [
    visibleStudentActivityDetails,
    setVisibleStudentActivityDetails,
  ] = React.useState(false);
  const [
    visibleTeacherActivityDetails,
    setVisibleTeacherActivityDetails,
  ] = React.useState(false);

  const [selectedAssignment, setSelectedAssignment] = React.useState(null);
  const [selectedLesson, setSelectedLesson] = React.useState(null);
  const [selectedQuiz, setSelectedQuiz] = React.useState(null);
  // const agendaDetail =
  //   agendaDetailProp &&
  //   Object.keys(agendaDetailProp).reduce(function (res, v) {
  //     return res.concat(agendaDetailProp[v]);
  //   }, []);

  // const attendance = agendaDetailProp?.attendance || [];
  const lesson = agendaDetailProp?.lesson || [];
  const assignmentAssigned = agendaDetailProp?.assignmentAssigned || [];
  const assignmentDue = agendaDetailProp?.assignmentDue || [];
  const quizAnnounced = agendaDetailProp?.quizAnnounced || [];
  const quizTaken = agendaDetailProp?.quizTaken || [];
  // const adjourn = agendaDetailProp?.adjourn || [];

  const agendaDetail = concat(
    // attendance,
    lesson,
    assignmentAssigned,
    assignmentDue,
    quizAnnounced,
    quizTaken,
    // adjourn
  );

  const draftLessons = draftActivities?.lessons || [];
  const draftAssignments = draftActivities?.assignments || [];
  const draftQuizzes = draftActivities?.quizzes || [];
  const draftItems = concat(draftLessons, draftAssignments, draftQuizzes);

  const totalAgendaTime = sum(
    agendaDetail?.map(
      (activity) =>
        activity?.shadowLessons?.masterLesson?.duration ||
        activity?.shadowAssignments?.masterAssignment?.duration ||
        activity?.shadowQuizzes?.masterQuiz?.duration ||
        0
    )
  );

  const viewActivityDetail = (e, activity) => {
    e.preventDefault();
    e.stopPropagation();
    if (activity?.shadowLessons?.masterLesson || activity?.lessonName) {
      getLessonDetails(activity);
      setSelectedLesson(activity);
      setSelectedQuiz(null);
      setSelectedAssignment(null);
    }
    if (activity?.shadowQuizzes?.masterQuiz || activity?.quizName) {
      getQuizDetails(activity);
      setSelectedQuiz(activity);
      setSelectedLesson(null);
      setSelectedAssignment(null);
    }
    if (
      activity?.shadowAssignments?.masterAssignment ||
      activity?.assignmentName
    ) {
      getAssignmentDetails(activity);
      setSelectedAssignment(activity);
      setSelectedQuiz(null);
      setSelectedLesson(null);
    }
    if (studentView) {
      setVisibleStudentActivityDetails(true);
      if (drawer1Ref) {
        drawer1Ref.current.classList.toggle('overlayed');
      }
    } else {
      setVisibleTeacherActivityDetails(true);
    }
  };

  const publishItem = (e, activity) => {
    // e.preventDefault();
    // e.stopPropagation();
    publishActivity(activity);
  };

  const viewLinkItem = (item) => {
    if (item?.lessonName) {
      getLessonDetails(item);
      setSelectedLesson(item);
      setSelectedQuiz(null);
      setSelectedAssignment(null);
    }
    if (item?.quizName) {
      getQuizDetails(item);
      setSelectedQuiz(item);
      setSelectedAssignment(null);
      setSelectedLesson(null);
    }
    if (item?.assignmentName) {
      getAssignmentDetails(item);
      setSelectedAssignment(item);
      setSelectedLesson(null);
      setSelectedQuiz(null);
    }
  };
  const handleToggle = (e, activity) => {
    if (studentView) {
      e.preventDefault();
    } else {
      markAgendaActivityComplete(e.target.checked, activity);
    }
  };
  const formSchema = Yup.object().shape({});
  const onEditAgenda = (values, agenda) => {
    if (agenda[Object.keys(values)[0]] === Object.values(values)[0]) {
      return;
    }
    editAgendaDetail(values, agenda);
  };

  const renderClassSession = () => (
      <div className={classes.dateTime}>
        {`${moment(agendaProps?.start).format('MMM DD, YYYY')} - ${moment(
          agendaProps?.start
        ).format(' hh:mm a')} to ${moment(agendaProps?.end).format(
          ' hh:mm a'
        )}`}
      </div>
    );

  const renderDraftActivities = () => (
      <Box mt={7}>
        <div className={classes.label}>{t('draft_course_activities')}</div>
        {draftItems?.length > 0 ? (
          draftItems?.map((activity) => (
            <DraftActivityDetail
              activity={activity}
              viewActivityDetail={viewActivityDetail}
              publishActivity={publishItem}
              isPrimaryTeacher={isPrimaryTeacher}
            // courseTeacher={courseTeacher}
            />
          ))
        ) : (
          <Typography className='emptyText' color='primary'>
            {t('common:empty')}
          </Typography>
        )}
      </Box>
    );

  const goToPlan = () => {
    history.push(`${ROUTE_MY_COURSES.MY_COURSES_DETAIL(agenda?.courseId) }?active=plan`);
  };
  // console.log(agenda, 'agenda');

  return (
    <div className={classes.contentWrapper}>
      <StudentViewActivityDrawer
        visible={visibleStudentActivityDetails}
        onClose={() => setVisibleStudentActivityDetails(false)}
        activity={selectedQuiz || selectedAssignment || selectedLesson}
        drawer1Ref={drawer1Ref}
      />
      <TeacherViewActivityDrawer
        visible={visibleTeacherActivityDetails}
        onClose={() => setVisibleTeacherActivityDetails(false)}
        activity={selectedQuiz || selectedAssignment || selectedLesson}
        viewLinkItem={viewLinkItem}
      // drawer1Ref={drawer1Ref}
      />
      <Formik
        key={agenda?.id} // add key to update values when change between agenda content
        enableReinitialize
        initialValues={agenda}
        validationSchema={formSchema}
        innerRef={formikFormRef}
      >
        {({ values, setFieldValue }) => (
            <div className={classes.root}>
              {!studentView && (
                <div className={classes.dateTime}>
                  {`${moment(selectedCourseBlock?.startTime).format(
                    'MMM DD, YYYY'
                  )} - ${moment(selectedCourseBlock?.startTime).format(
                    ' hh:mm a'
                  )} to ${moment(selectedCourseBlock?.endTime).format(
                    ' hh:mm a'
                  )}`}
                </div>
              )}
              <Grid container>
                <Grid item xs={8}>
                  {studentView && renderClassSession()}
                  <div className={classes.flexAlignCenter}>
                    <div className={classes.label}>
                      {t('total_agenda_time')}
                    </div>
                    <div className={classes.totalTime}>
                      {` (${t('common:min', {
                        count: Number(totalAgendaTime),
                      })})`}
                    </div>
                  </div>

                  {!studentView && (
                    <div className={classes.note}>
                      To add or edit an activity, go back to{' '}
                      <span
                        className={classes.underlineText}
                        onClick={goToPlan}
                      >
                        {t('myCourses:schedule')}
                      </span>
                      .
                    </div>
                  )}

                  {/* {agendaDetail?.map((activity, i) => (
                    <Box key={i}>
                      <FormControlLabel
                        control={
                          <TblCheckBox
                            onChange={(e) => handleToggle(e, activity)}
                            // checked={checked.includes(item.id)}
                            checked={activity?.completed}
                            // defaultChecked={activity?.completed}
                            className={classes.checkBox}
                            // inputProps={{ 'aria-labelledby': labelId }}
                          />
                        }
                        className={classes.rootFormControl}
                        label={
                          <ActivityDetail
                            activity={activity}
                            viewActivityDetail={viewActivityDetail}
                          />
                        }
                      />
                    </Box>
                  ))} */}

                  {agendaDetail?.map((activity, i) => (
                    <div
                      className={clsx(classes.flexAlignStart, classes.formItem)}
                      key={i}
                    >
                      <TblCheckBox
                        onChange={(e) => handleToggle(e, activity)}
                        // checked={checked.includes(item.id)}
                        checked={activity?.completed}
                        // defaultChecked={activity?.completed}
                        className={classes.checkBox}
                      // inputProps={{ 'aria-labelledby': labelId }}
                      />
                      <ActivityDetail
                        activity={activity}
                        viewActivityDetail={viewActivityDetail}
                      />
                    </div>
                  ))}
                  {!studentView && renderDraftActivities()}
                </Grid>
                <Grid item xs={4}>
                  {studentView ? (
                    <Box>
                      <div className={classes.label}>
                        {t('physical_location')}
                      </div>
                      {values?.physicalLocation ? (
                        <div className={classes.value}>
                          {values?.physicalLocation}
                        </div>
                      ) : (
                        <NoneValue />
                      )}
                    </Box>
                  ) : (
                    <Box>
                      <Field
                        name='physicalLocation'
                        as={TblInputs}
                        placeholder={t('enter_physical_location')}
                        errorMessage={null}
                        label={t('physical_location')}
                        inputProps={{ maxLength: 254 }}
                        onSave={() =>
                          onEditAgenda(
                            { physicalLocation: values?.physicalLocation },
                            agenda
                          )
                        }
                        singleSave={true}
                        onAbort={() => {
                          setFieldValue(
                            'physicalLocation',
                            agenda?.physicalLocation || ''
                          );
                        }}
                        value={values?.physicalLocation}
                      />
                    </Box>
                  )}

                  {studentView ? (
                    <Box mt={2}>
                      <div className={classes.label}>
                        {t('distance_learning_url')}
                      </div>
                      {values?.url ? (
                        <div className={classes.value}>{values?.url}</div>
                      ) : (
                        <NoneValue />
                      )}
                    </Box>
                  ) : (
                    <Box>
                      <Field
                        name='url'
                        as={TblInputs}
                        placeholder={t('enter_url')}
                        errorMessage={null}
                        label={t('distance_learning_url')}
                        onSave={() =>
                          onEditAgenda({ url: values?.url }, agenda)
                        }
                        singleSave={true}
                        onAbort={() => {
                          setFieldValue('url', agenda?.url || '');
                        }}
                        value={values?.url}
                      />
                    </Box>
                  )}

                  {studentView ? (
                    <Box mt={2}>
                      <div className={classes.label}>{t('notes')}</div>
                      {values?.note ? (
                        <div className={classes.value}>{values?.note}</div>
                      ) : (
                        <NoneValue />
                      )}
                    </Box>
                  ) : (
                    <Box>
                      <Field
                        name='note'
                        as={TblInputs}
                        label={t('notes')}
                        multiline
                        singleSave
                        onAbort={() => {
                          setFieldValue('note', agenda?.note || '');
                        }}
                        onSave={() =>
                          onEditAgenda({ note: values?.note }, agenda)
                        }
                        value={values?.note}
                        rows={3}
                        placeholder={t('add_notes_annoucements_or_reminders')}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </div>
          )}
      </Formik>
    </div>
  );
}

AgendaContent.propTypes = {
  // agendaDetail: PropTypes.array,
  editAgendaDetail: PropTypes.func,
  markAgendaActivityComplete: PropTypes.func,
  agenda: PropTypes.object,
  studentView: PropTypes.bool,
  agendaProps: PropTypes.object,
  activityDetails: PropTypes.object,
  getAssignmentDetails: PropTypes.func,
  getLessonDetails: PropTypes.func,
  getQuizDetails: PropTypes.func,
  agendaDetailProp: PropTypes.object,
  drawer1Ref: PropTypes.any,
  selectedCourseBlock: PropTypes.object,
  publishActivity: PropTypes.func,
  draftActivities: PropTypes.object,
  courseTeacher: PropTypes.object,
  currentUserId: PropTypes.number,
};

AgendaContent.defaultProps = {};

ActivityDetail.propTypes = {
  activity: PropTypes.object,
  viewActivityDetail: PropTypes.func,
};
DraftActivityDetail.propTypes = {
  activity: PropTypes.object,
  publishActivity: PropTypes.func,
  viewActivityDetail: PropTypes.func,
  isPrimaryTeacher: PropTypes.bool,
};

export default AgendaContent;
