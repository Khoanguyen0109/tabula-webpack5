import React from 'react';

import ErrorPage from 'components/TblErrorPage';
import EmptyStudent from 'components/TblErrorPage/EmptyStudent';

const EmptyStudentPage = (props) => <EmptyStudent title='myCourses:my_courses' ns='myCourses' {...props} />;

const ForbiddenPage = () => <ErrorPage errorCode='403' shortDescription='forbidden' detailDescription='no_permission' isNotFoundPage={false} isPublic={true} />;

export { EmptyStudentPage, ForbiddenPage };
