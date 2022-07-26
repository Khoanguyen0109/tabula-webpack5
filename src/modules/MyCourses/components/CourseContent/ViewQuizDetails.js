import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import isNil from 'lodash/isNil';

import { Box, Grid, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import TblConfirmDialog from 'components/TblConfirmDialog';
import TblGoogleLabel from 'components/TblGoogleFile/TblGoogleLable';
import TblViewContentEditor from 'components/TblViewContentEditor';

import { isTeacher } from 'utils/roles';

import AttachmentLabel from 'shared/Attachments/Attachment/AttachmentLabel';
import AttachmentList from 'shared/Attachments/Attachment/AttachmentList';
import { GRADE_TYPE_NAME, QUIZ_TYPE } from 'shared/MyCourses/constants';
import LinkedContents from 'shared/MyCourses/containers/LinkedContents';
import myTasksSharedActions from 'shared/MyTasks/actions';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import clsx from 'clsx';
import compareAsc from 'date-fns/compareAsc';
import { TASK_STATUS } from 'modules/MyTasks/constants';
import moment from 'moment';
import PropTypes from 'prop-types';
import { replaceHTMLTag } from 'utils';

import TblGoogleFileList from '../../../../components/TblGoogleFileList';
import { formatTimeNeeded } from '../../../MyTasks/utils';
import { getPathname } from '../../utils';

const useStyles = makeStyles((theme) => ({
  noneText: {
    color: theme.newColors.gray[700],
  },
  icon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    fontSize: theme.spacing(3),
  },
  content: {
    fontSize: theme.fontSize.normal,
    color: theme.palette.primary.main,
  },
  taskStatus: {
    padding: theme.spacing(0.5, 1),
    backgroundColor: theme.newColors.gray[300],
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSize.normal,
    marginLeft: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
  emptyTaskInfoLine: {
    width: 4,
    background: theme.newColors.gray[300],
    borderRadius: 8,
  },
  link: {
    color: theme.mainColors.primary2[0],
    fontSize: theme.fontSize.normal,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}));

function ViewQuizDetails(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const authContext = useContext(AuthDataContext);
  const {
    isFetching = false,
    details,
    sectionId,
    courseIdProp,
    teacherView,
    viewLinkItem,
  } = props;
  const { t } = useTranslation(['myCourses', 'common']);
  const teacherViewLinkContent = (item) => {
    viewLinkItem && viewLinkItem(item);
  };
  const [message, setMessage] = useState('');
  const taskInProgress = useSelector(
    (state) => state.MyTasksShared.taskInProgressShared
  );
  const currentUser = useSelector((state) => state.Auth.currentUser);
  const onViewTaskDetail = () => {
    if (checkTaskNotGenerated()) {
      return setMessage(t('myTasks:task_not_generated_until_session_ended'));
    }
    if (
      !!taskInProgress.taskId &&
      taskInProgress.taskId !== details.tasks[0].id
    ) {
      return setMessage(
        t(
          `The task ${taskInProgress.taskName} is in-progress. You can not view the task ${details.name} at the moment.`
        )
      );
    }
    const path = getPathname(authContext, details?.tasks[0]);
    return history.push(path);
  };

  const onCancel = () => {
    setMessage('');
  };

  //  Compare the Now is equal & after executeTime( taken on) and the Now is equal and before classSessionEndTime
  const checkTaskNotGenerated = () =>
    details.quizType === QUIZ_TYPE.POP &&
    compareAsc(new Date(), new Date(details?.executeTime)) !== -1 &&
    compareAsc(new Date(), new Date(details?.classSessionEndTime)) !== 1;

  useEffect(() => {
    const { organizationId } = currentUser;
    dispatch(
      myTasksSharedActions.mtGetTaskInProgress({
        orgId: organizationId,
        isFetchingMTTaskInProgress: true,
      })
    );
  }, [currentUser, details, dispatch]);

  const renderLeftContent = React.useMemo(() => {
    //NOTE: Section 4 in TL-3330
    const contentLeft = [
      // {
      //   title: t('quiz_description'),
      //   data: isNil(masterQuiz?.description)
      //     ? t('common:none')
      //     : masterQuiz?.description,
      // },
      {
        data: details?.tasks?.length ? (
          <>
            <Box>
              <Typography variant='bodyMedium' color='primary'>
                {details?.tasks[0]?.status !== 3
                  ? t('go_to_my_task_message')
                  : t('to_view_completed_task')}
              </Typography>
            </Box>

            <Box display='flex' alignItems='center' mt={1}>
              <span onClick={onViewTaskDetail} className={classes.link}>
                {t('view_task_details')}
              </span>
              <div className={classes.taskStatus}>
                {t(`myTasks:${TASK_STATUS[details?.tasks[0]?.status]}`)}
              </div>
            </Box>
          </>
        ) : (
          !isTeacher(currentUser) && (
            <Box mt={3} display='flex'>
              <Box className={classes.emptyTaskInfoLine} mr={1} />
              <Box>{t('myTasks:empty_task_info')}</Box>
            </Box>
          )
        ),
      },
      {
        title: t('common:description'),
        data:
          isNil(details?.masterQuiz?.studyTips) ||
          replaceHTMLTag(details?.masterQuiz?.studyTips) === ''
            ? t('common:none')
            : details?.masterQuiz?.studyTips,
        className: 'ql-editor tbl-view-editor',
        viewHtmlEditor: true,
      },
      {
        data: (
          <Box mt={3.5}>
            <Typography variant='labelLarge'>
              {t('common:attachments')}
            </Typography>
          </Box>
        ),
      },
      {
        title: <TblGoogleLabel />,
        data: <TblGoogleFileList list={details?.masterQuiz?.googleFiles} />,
      },
      {
        title: <AttachmentLabel />,
        data: (
          <AttachmentList
            files={details?.masterQuiz?.attachments}
            canDownload={true}
          />
        ),
      },
      {
        data: (
          <Box ml={-1}>
            <LinkedContents
              actionLabel={null}
              initialLinkedContents={
                teacherView
                  ? details?.masterQuiz?.linkContents
                  : details?.masterQuiz?.linkData
              }
              viewOnly={true}
              sectionId={sectionId}
              ableViewItem
              courseIdProp={courseIdProp}
              noMarginLeft
              onClickViewItem={teacherView ? teacherViewLinkContent : null}
            />
          </Box>
        ),
      },
    ];
    return contentLeft.map((item) => {
      let content = null;
      if (isFetching) {
        content = <Skeleton height={25} />;
      } else {
        content = content = !item.viewHtmlEditor ? (
          item.data
        ) : (
          <TblViewContentEditor content={item?.data} />
        );
      }
      return (
        item.data && (
          <Box mb={3}>
            <Typography variant='bodyMedium' color='primary'>
              <Box fontWeight='labelLarge.fontWeight'>{item.title}</Box>
            </Typography>
            <Box mt={1} className={clsx(classes.content, item.className)}>
              {content}
            </Box>
          </Box>
        )
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, details, t, taskInProgress]);

  const renderRightContent = React.useMemo(() => {
    let contentRight = null;
    if (teacherView) {
      contentRight = [
        {
          title: t('total_possible_points'),
          data: details?.masterQuiz?.totalPossiblePoints,
          show: true,
        },
        {
          title: t('time_to_complete'),
          // data: t('common:minWithCount', { count: details?.masterQuiz?.timeToComplete }),
          data: formatTimeNeeded(details?.masterQuiz?.timeToComplete),
          show: true,
        },
        {
          title: t('study_effort'),
          // data: t('common:minWithCount', { count: details?.masterQuiz?.studyEffort }),
          data: formatTimeNeeded(details?.masterQuiz?.studyEffort),
          show: details?.masterQuiz?.quizType === QUIZ_TYPE.ANNOUNCED,
        },
        {
          title: t('grade_type'),
          data: t(`${GRADE_TYPE_NAME[details?.masterQuiz?.gradeType]}`),
          show: true,
        },
        {
          title: t('grade_weighting_category'),
          data: details?.masterQuiz?.gradeWeightCriteria?.name,
          show: true,
        },
        {
          title: t('allow_retake'),
          data: !!details?.masterQuiz?.allowRetake
            ? t('common:yes')
            : t('common:no'),
          show: true,
        },
        {
          title: t('number_of_days'),
          data: details?.masterQuiz?.numberOfDays,
          show: !!details?.masterQuiz?.allowRetake,
        },
        {
          title: t('max_retakes'),
          data: details?.masterQuiz?.maxRetakes,
          show: !!details?.masterQuiz?.allowRetake,
        },
        {
          title: t('percent_credit'),
          data: `${details?.masterQuiz?.percentCredit}%`,
          show: !!details?.masterQuiz?.allowRetake,
        },
      ];
    } else {
      contentRight = [
        {
          title: t('taken_on'),
          data: moment(details?.executeTime).format('MMM DD, YYYY - hh:mm a'),
          show: true,
        },
        {
          title: t('make_up_deadline'),
          data: moment(details?.makeupDeadline).isValid()
            ? moment(details?.makeupDeadline).format('MMM DD, YYYY')
            : t('common:none'),
          show: true,
        },
        {
          title: t('unit'),
          data: details?.masterQuiz?.unit?.unitName,
          show: true,
        },
        {
          title: t('total_possible_points'),
          data: details?.masterQuiz?.totalPossiblePoints,
          show: true,
        },
        {
          title: t('time_to_complete'),
          // data: t('common:minWithCount', { count: details?.masterQuiz?.timeToComplete }),
          data: formatTimeNeeded(details?.masterQuiz?.timeToComplete),
          show: true,
        },
        {
          title: t('study_effort'),
          // data: t('common:minWithCount', { count: details?.masterQuiz?.studyEffort }),
          data: formatTimeNeeded(details?.masterQuiz?.studyEffort),
          show: details?.quizType === QUIZ_TYPE.ANNOUNCED,
        },
        {
          title: t('grade_type'),
          data: t(`${GRADE_TYPE_NAME[details?.masterQuiz?.gradeType]}`),
          show: true,
        },
        {
          title: t('grade_weighting_category'),
          data: details?.masterQuiz?.gradeWeightCriteria?.name,
          show: true,
        },
        {
          title: t('allow_retake'),
          data: (
            <span>
              {!!details?.masterQuiz?.allowRetake
                ? t('common:yes')
                : t('common:no')}
            </span>
          ),
          show: true,
        },
        {
          title: t('retake_deadline'),
          data: moment(details?.retakeDeadline).format(
            'MMM DD, YYYY - hh:mm a'
          ),
          show: !!details?.masterQuiz?.allowRetake,
        },
        {
          title: t('max_retakes'),
          data: details?.masterQuiz?.maxRetakes,
          show: !!details?.masterQuiz?.allowRetake,
        },
        {
          title: t('percent_credit'),
          data: `${details?.masterQuiz?.percentCredit}%`,
          show: !!details?.masterQuiz?.allowRetake,
        },
      ];
    }

    return contentRight.map((item) => {
      if (!item.show) {
        return null;
      }
      let content = null;
      if (isFetching) {
        content = <Skeleton height={25} />;
      } else {
        content =
          item.data === t('common:none') ? (
            <div className={classes.noneText}>
              <Typography variant='bodyMedium' color='inherit'>
                {item.data}
              </Typography>
            </div>
          ) : (
            <Typography variant='bodyMedium' color='primary'>
              {item.data}
            </Typography>
          );
      }
      return (
        <Box mb={3}>
          <Typography variant='bodyMedium' color='primary'>
            <Box fontWeight='labelLarge.fontWeight' className='text-ellipsis'>
              {item.title}
            </Box>
          </Typography>
          <Box mt={1} className='text-ellipsis'>
            {content}
          </Box>
        </Box>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, details, t]);

  return (
    <Grid container>
      <Grid item xs={8}>
        <Box mr={2.5} mb={10}>
          {renderLeftContent}
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box ml={2.5}>{renderRightContent}</Box>
      </Grid>
      <TblConfirmDialog
        cancelText={t('common:cancel')}
        open={!!message}
        message={message}
        onCancel={onCancel}
        onConfirmed={onCancel}
        title={t('common:warning')}
      />
    </Grid>
  );
}

ViewQuizDetails.propTypes = {
  details: PropTypes.object,
  sectionId: PropTypes.string,
  courseIdProp: PropTypes.number,
  teacherView: PropTypes.bool,
  viewLinkItem: PropTypes.func,
  isFetching: PropTypes.bool,
};

ViewQuizDetails.defaultProps = {
  details: {},
};

export default ViewQuizDetails;
