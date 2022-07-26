import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';

import Comment from './Comment';
import CommentBox from './CommentBox';

function Comments() {
  const { t } = useTranslation('grader');
  const comments = useSelector((state) => state.Grader.comments) || [
    { comment: 'comments' },
  ];
  useEffect(() => {
    // Fetch Comments
  }, []);
  return (
    <Box>
      <Typography className='title'>{t('comments')}</Typography>
      <CommentBox />
      <Box mt={3}>
        {comments.map((comment) => (
          <Comment comment={comment} />
        ))}
      </Box>
    </Box>
  );
}

export default Comments;
