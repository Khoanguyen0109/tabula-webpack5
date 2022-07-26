import React from 'react';

import isNil from 'lodash/isNil';

import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { replaceHTMLTag } from 'utils';

function TblViewContentEditor(props) {
  const { content } = props;
  return (
    <div
      className='tbl-view-editor'
      dangerouslySetInnerHTML={{
        __html:
          isNil(content) || replaceHTMLTag(content) === ''
            ? ''
            : DOMPurify.sanitize(content.replace(/(?:\r\n|\r|\n)/g, '<br>')),
      }}
    />
  );
}

TblViewContentEditor.propTypes = {
  content: PropTypes.string,
};

export default TblViewContentEditor;
