import React from 'react';
import { useTranslation } from 'react-i18next';

import isNil from 'lodash/isNil';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblGoogleLabel from 'components/TblGoogleFile/TblGoogleLable';
import TblGoogleFileList from 'components/TblGoogleFileList';
import TblViewContentEditor from 'components/TblViewContentEditor';

import AttachmentLabel from 'shared/Attachments/Attachment/AttachmentLabel';
import AttachmentList from 'shared/Attachments/Attachment/AttachmentList';
import LinkedContents from 'shared/MyCourses/containers/LinkedContents';

import moment from 'moment';
import PropTypes from 'prop-types';
import { replaceHTMLTag } from 'utils';

const useStyles = makeStyles((theme) => ({
  noneText: {
    color: theme.newColors.gray[700],
  },
  icon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    fontSize: theme.spacing(3),
  },
}));

function ViewLessonDetails(props) {
  const classes = useStyles();
  const {
    lessonDetails,
    isFetching,
    sectionId,
    courseIdProp,
    teacherView,
    viewLinkItem,
  } = props;
  const { t } = useTranslation(['lesson', 'common']);
  const renderLeftContent = () => {
    // NOTE: Section 5 in TL-3330
    const contentLeftArray = [
      // {
      //   title: t('lesson_description'),
      //   data:
      //     isNil(lessonDetails?.masterLesson?.description) ||
      //     replaceHTMLTag(lessonDetails?.masterLesson?.description) === ''
      //       ? t('common:none')
      //       : lessonDetails?.masterLesson?.description,
      //   className: 'ql-editor tbl-view-editor'
      // },
      {
        title: t('common:description'),
        data:
          isNil(lessonDetails?.masterLesson?.lessonContent) ||
          replaceHTMLTag(lessonDetails?.masterLesson?.lessonContent) === ''
            ? t('common:none')
            : lessonDetails?.masterLesson?.lessonContent,
        className: 'ql-editor tbl-view-editor',
      },
    ];

    const teacherViewLinkContent = (item) => {
      viewLinkItem && viewLinkItem(item);
    };
    return (
      <>
        {contentLeftArray.map((item, index) => (
          <Box mt={index !== 0 ? 3 : 0}>
            <Typography
              variant='bodyMedium'
              color='primary'
            >
              <Box fontWeight='labelLarge.fontWeight'>{item.title}</Box>
            </Typography>
            <Typography>
              <Box mt={1} fontSize='fontSize' className={`${item.className}`}>
                <TblViewContentEditor content={item.data} />
              </Box>
            </Typography>
          </Box>
        ))}
        <Box mt={3.5}>
          <Typography variant='labelLarge'>
            {t('common:attachments')}
          </Typography>
        </Box>
        <Box mt={3}>
          <TblGoogleLabel />
          <TblGoogleFileList list={lessonDetails?.masterLesson?.googleFiles} />
        </Box>
        <Box mt={3}>
          <AttachmentLabel />
          <AttachmentList
            files={lessonDetails?.masterLesson?.attachments}
            canDownload={true}
          />
        </Box>
        <Box mt={3} ml={-1}>
          <LinkedContents
            actionLabel={null}
            initialLinkedContents={
              teacherView
                ? lessonDetails?.masterLesson?.linkContents
                : lessonDetails?.masterLesson?.linkData
            }
            courseIdProp={courseIdProp}
            ableViewItem
            sectionId={sectionId}
            viewOnly
            emptyContent={t('myCourses:no_linked_contents')}
            onClickViewItem={teacherView ? teacherViewLinkContent : null}
          />
        </Box>
      </>
    );
  };

  const renderRightContent = () => {
    const contentRightArray = [
      {
        title: t('common:unit'),
        data: lessonDetails?.masterLesson?.unit?.unitName,
        display: teacherView,
      },
      // {
      //   title: t('myCourses:teacher'),
      //   data: `${lessonDetails?.masterLesson?.teacher?.firstName} ${lessonDetails?.masterLesson?.teacher?.lastName}`,
      // },
      // {
      //   title: t('myCourses:teaching_assistant'),
      //   data: isNil(lessonDetails?.masterLesson?.teachingAssistant)
      //     ? t('common:none')
      //     : `${lessonDetails?.masterLesson?.teachingAssistant?.firstName} ${lessonDetails?.masterLesson?.teachingAssistant?.lastName}`,
      // },
      {
        title: t('common:duration', { count: 2 }),
        data: t('common:minWithCount', {
          count: lessonDetails?.masterLesson?.duration,
        }),
      },
    ];
    return (
      <>
        {!teacherView && (
          <Box>
            <Typography
              variant='bodyMedium'
              color='primary'
            >
              <Box fontWeight='labelLarge.fontWeight'>
                {t('myCourses:class_session')}
              </Box>
            </Typography>
            <Box mt={1}>
              <Typography
                variant='bodyMedium'
                color='primary'
              >
                {moment(lessonDetails?.sectionSchedule?.date?.date).format(
                  'MMM DD, YYYY'
                )}{' '}
                -{' '}
                {moment(lessonDetails?.sectionSchedule?.time?.timeFrom).format(
                  'hh:mm a'
                )}{' '}
                to{' '}
                {moment(lessonDetails?.sectionSchedule?.time?.timeTo).format(
                  'hh:mm a'
                )}
              </Typography>
            </Box>
          </Box>
        )}

        {contentRightArray.map(
          (item) =>
            !item?.display && (
              <Box mt={3}>
                <Typography
                  variant='bodyMedium'
                  color='primary'
                >
                  <Box fontWeight='labelLarge.fontWeight'>{item.title}</Box>
                </Typography>
                <Box mt={1}>
                  {item.data === t('common:none') ? (
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
                  )}
                </Box>
              </Box>
            )
        )}
      </>
    );
  };

  return (
    <Grid container>
      <Grid item xs={8}>
        <Box mr={2.5} mb={10}>
          {isFetching ? (
            <Skeleton
              variant='rectangular'
              animation='wave'
              width={'100%'}
              height={'61px'}
            />
          ) : (
            renderLeftContent()
          )}
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box ml={2.5}>
          {isFetching ? (
            <Skeleton
              variant='rectangular'
              animation='wave'
              width={'100%'}
              height={'61px'}
            />
          ) : (
            renderRightContent()
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

ViewLessonDetails.defaultProps = {
  lessonDetails: {},
};

ViewLessonDetails.propTypes = {
  lessonDetails: PropTypes.object,
  isFetching: PropTypes.bool,
  sectionId: PropTypes.string,
  courseIdProp: PropTypes.number,
  teacherView: PropTypes.bool,
  viewLinkItem: PropTypes.func,
};

export default ViewLessonDetails;
