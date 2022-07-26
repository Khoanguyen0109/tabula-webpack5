/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// import clsx from 'clsx';
import isNil from 'lodash/isNil';

import { Box, Grid, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import TblGoogleLabel from 'components/TblGoogleFile/TblGoogleLable';
import TblViewContentEditor from 'components/TblViewContentEditor';

import AttachmentLabel from 'shared/Attachments/Attachment/AttachmentLabel';
import AttachmentList from 'shared/Attachments/Attachment/AttachmentList';
import LinkedContents from 'shared/MyCourses/containers/LinkedContents';

import moment from 'moment';
import PropTypes from 'prop-types';
import { replaceHTMLTag } from 'utils';

import TblGoogleFileList from '../../../../components/TblGoogleFileList';
import { SUBMISSION_METHOD } from '../../../../shared/MyCourses/constants';
import { formatTimeNeeded } from '../../../MyTasks/utils';

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
    width: '100%',
    wordWrap: 'break-word',
  },
}));

function ViewAssignmentDetails(props) {
  const classes = useStyles();
  const {
    details,
    isFetching,
    sectionId,
    courseIdProp,
    teacherView,
    viewLinkItem,
  } = props;
  const { t } = useTranslation(['myCourses', 'common']);
  const teacherViewLinkContent = (item) => {
    viewLinkItem && viewLinkItem(item);
  };
  const renderLeftContent = useMemo(() => {
    //NOTE: Section 3 in TL-3330
    const contentLeftArray = [
      {
        title: t('common:description'),
        data:
          isNil(details?.masterAssignment?.requirement) ||
          replaceHTMLTag(details?.masterLesson?.lessonContent) === ''
            ? t('common:none')
            : details?.masterAssignment?.requirement,
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
        data: (
          <TblGoogleFileList list={details?.masterAssignment?.googleFiles} />
        ),
      },
      {
        title: <AttachmentLabel />,
        data: (
          <AttachmentList
            files={details?.masterAssignment?.attachments}
            canDownload={true}
          />
        ),
      },
      {
        // title: t('myCourses:linked_contents'),
        data: (
          <Box ml={-1}>
            <LinkedContents
              actionLabel={null}
              initialLinkedContents={
                teacherView
                  ? details?.masterAssignment?.linkContents
                  : details?.masterAssignment?.linkData
              }
              ableViewItem
              sectionId={sectionId}
              viewOnly
              noMarginLeft
              emptyContent={t('myCourses:no_linked_contents')}
              courseIdProp={courseIdProp}
              onClickViewItem={teacherView ? teacherViewLinkContent : null}
            />
          </Box>
        ),
        className: '',
        viewHtmlEditor: false,
      },
    ];
    return contentLeftArray.map((item) => {
      let content = null;
      if (isFetching) {
        content = <Skeleton height={25} />;
      } else {
        content = !item.viewHtmlEditor ? (
          item.data
        ) : (
          <TblViewContentEditor content={item.data} />
        );
      }
      return (
        <Box mb={3}>
          <Typography variant='bodyMedium' color='primary'>
            <Box fontWeight='labelLarge.fontWeight'>{item.title}</Box>
          </Typography>
          <Typography>
            <Box mt={1} fontSize='fontSize' className={item.className}>
              {content}
            </Box>
          </Typography>
        </Box>
      );
    });
  }, [isFetching, details, t]);

  const renderRightContent = useMemo(() => {
    const contentRightArray = [
      {
        title: t('due'),
        data: moment(details?.originalDueTime).format('MMM DD, YYYY - hh:mm a'),
        show: !teacherView,
      },
      {
        title: t('due_late_turn_in'),
        data: moment(details?.finalDueTime).format('MMM DD, YYYY - hh:mm a'),
        show: !teacherView,
      },
      {
        title: t('unit'),
        data: details?.masterAssignment?.unit?.unitName,
        show: !teacherView,
      },
      {
        title: t('total_possible_points'),
        data: details?.masterAssignment?.totalPossiblePoints,
        show: true,
      },
      {
        title: t('time_to_complete'),
        data: formatTimeNeeded(details?.masterAssignment?.timeToComplete),
        show: true,
      },
      {
        title: t('extra_credit'),
        data: details?.masterAssignment?.extraCredit
          ? t('common:yes')
          : t('common:no'),
        show: true,
      },
      {
        title: t('submission_type'),
        data:
          details?.masterAssignment?.submissionMethod ===
          SUBMISSION_METHOD.ONLINE
            ? t('submission_type_online')
            : t('submission_type_offline'),
        show: true,
      },
      // {
      //   title: t('materials_needed'),
      //   data: details?.masterAssignment?.fileTypeAccepted || t('common:none'),
      //   show: true,
      // },
      {
        title: t('grade_weighting_category'),
        data: details?.masterAssignment?.gradeWeightCriteria?.name,
        show: true,
      },
      {
        title: t('allow_late_turn_in_label'),
        data: details?.masterAssignment?.allowLateTurnIn
          ? t('common:yes')
          : t('common:no'),
        show: true,
      },
      {
        title: t('number_of_days'),
        data: details?.masterAssignment?.numberOfDaysAllowLateTurnIn,
        show: teacherView && details?.masterAssignment?.allowLateTurnIn,
      },
      {
        title: t('percent_credit'),
        data: `${details?.masterAssignment?.percentCredit}%`,
        show: details?.masterAssignment?.allowLateTurnIn,
      },
    ];

    return contentRightArray.map((item) => {
      if (!!!item.show) {
        return <></>;
      }
      let content = null;
      if (isFetching) {
        content = <Skeleton height={25} />;
      } else {
        content =
          item.data === t('common:none') ? (
            <div className={classes.noneText}>
              <Typography
                variant='bodyMedium'
                color='inherit'
              >
                {item.data}
              </Typography>
            </div>
          ) : (
            <Typography
              variant='bodyMedium'
              color='primary'
            >
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
    </Grid>
  );
}

ViewAssignmentDetails.defaultProps = {
  details: {},
};

ViewAssignmentDetails.propTypes = {
  details: PropTypes.object,
  info: PropTypes.object,
  isFetching: PropTypes.bool,
  sectionId: PropTypes.string,
  courseIdProp: PropTypes.number,
  teacherView: PropTypes.bool,
  viewLinkItem: PropTypes.func,
};

export default ViewAssignmentDetails;
