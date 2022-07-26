import React from 'react';

import ErrorPage from 'components/TblErrorPage';
import EmptyStudent from 'components/TblErrorPage/EmptyStudent';

const EmptyStudentPage = (props) => <EmptyStudent title='myTasks:my_task' ns='myTasks' {...props} />;

const ForbiddenPage = () => <ErrorPage errorCode='403' shortDescription='forbidden' detailDescription='no_permission' isNotFoundPage={false} isPublic={true} />;

export { EmptyStudentPage, ForbiddenPage };