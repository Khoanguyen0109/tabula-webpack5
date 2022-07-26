import React, { useContext } from 'react';

import TemplateList from 'modules/SchoolLibrary/components/TemplateList';

import { isTeacher } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { PropTypes } from 'prop-types';

function SchoolTemplateList(props) {
  const authContext = useContext(AuthDataContext);
  const { t, schoolTemplateList, isBusy } = props;
  const isTeacherRole = isTeacher(authContext.currentUser);

  return (
    <TemplateList
      listItems={schoolTemplateList}
      isBusy={isBusy}
      showStatus={isTeacherRole}
      emptyContent={t('common:no_result_match')}
    />
  );
}

SchoolTemplateList.propTypes = {
  schoolTemplateList: PropTypes.array,
  location: PropTypes.object,
  authContext: PropTypes.object,
  search: PropTypes.string,
  t: PropTypes.func,
  isBusy: PropTypes.bool
};

export default SchoolTemplateList;
