import React from 'react';
import { useTranslation } from 'react-i18next';

import isNil from 'lodash/isNil';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblCustomScrollbar from 'components/TblCustomScrollbar';
import TblGoogleLabel from 'components/TblGoogleFile/TblGoogleLable';
import TblGoogleFileList from 'components/TblGoogleFileList';
import TblViewContentEditor from 'components/TblViewContentEditor';

import AttachmentLabel from 'shared/Attachments/Attachment/AttachmentLabel';
import AttachmentList from 'shared/Attachments/Attachment/AttachmentList';
import LinkedContents from 'shared/MyCourses/containers/LinkedContents';

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
  content: {
    width: '100%',
    wordWrap: 'break-word',
  },
}));

function QuizTaskContents(props) {
  const classes = useStyles();
  const { t } = useTranslation(['myCourses', 'common']);
  const {
    details,
    sectionId,
    courseIdProp,
    teacherView,
    viewLinkItem,
    isFetching,
  } = props;
  const teacherViewLinkContent = (item) => {
    viewLinkItem && viewLinkItem(item);
  };
  //NOTE: Section 4 in TL-3330
  const contentArray = [
    {
      title: t('common:description'),
      data:
        isNil(details?.masterQuiz?.studyTips) ||
        replaceHTMLTag(details?.masterQuiz?.studyTips) === ''
          ? ''
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
      data: (
        <TblGoogleFileList
          list={details?.masterQuiz?.googleFiles}
          onUseTemplate={true}
        />
      ),
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
            onClickViewItem={teacherView ? teacherViewLinkContent : null}
          />
        </Box>
      ),
      viewHtmlEditor: false,
    },
  ];

  return (
    <>
      {isFetching ? (
        <Skeleton
          variant='rectangular'
          animation='wave'
          width={'100%'}
          height={'58px'}
        />
      ) : (
        <TblCustomScrollbar maxHeightScroll={'calc(100vh - 172px)'}>
            {contentArray.map((item) => (
              <Box mb={3}>
                <Typography
                  variant='bodyMedium'
                  color='primary'
                >
                  <Box fontWeight='labelLarge.fontWeight'>{item.title}</Box>
                </Typography>
                <Box mt={1} className={`${classes.content} ${item.className}`}>
                  {!item.viewHtmlEditor ? (
                    item.data
                  ) : (
                    <TblViewContentEditor content={item.data} />
                  )}
                </Box>
              </Box>
            ))}
        </TblCustomScrollbar>
      )}
    </>
  );
}

QuizTaskContents.defaultProps = {
  details: {},
};

QuizTaskContents.propTypes = {
  details: PropTypes.object,
  info: PropTypes.object,
  isFetching: PropTypes.bool,
  sectionId: PropTypes.string,
  courseIdProp: PropTypes.number,
  teacherView: PropTypes.bool,
  viewLinkItem: PropTypes.func,
};

export default React.memo(QuizTaskContents);
