import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';

import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';

import EmptyContent from 'components/EmptyContent';
import TblButton from 'components/TblButton';
import TblTour from 'components/TblTour';
import TourContent from 'components/TblTour/TourContent';

import { isGuardian, isTeacher } from 'utils/roles';
import useWindowSize from 'utils/windowSize';

import { USER_BEHAVIOR } from 'shared/User/constants';

import { useAuthDataContext } from 'AppRoute/AuthProvider';
import noCoursesAddedYet from 'assets/images/noCoursesAddedYet.svg';
import { delay } from 'lodash';
import { ROUTE_MY_COURSES } from 'modules/MyCourses/constantsRoute';
import myProfileActions from 'modules/MyProfile/actions';
import { PropTypes } from 'prop-types';

import { COURSE_STATUS } from '../constants';

import CourseItemCard from './CourseItemCard';

const useStyles = makeStyles((theme) => ({
  image: {
    [theme.breakpoints.down('md')]: {
      width: 220,
      height: 224,
    },
    [theme.breakpoints.up('md')]: {
      width: 256,
      height: 251,
    },
    [theme.breakpoints.up('lg')]: {
      width: 288,
      height: 275,
    },
    [theme.breakpoints.up('xl')]: {
      width: 280,
      height: 269,
    },
  },
}));

export default function CoursesList({
  listItems,
  showStatus,
  emptyContent,
  status,
}) {
  const { t } = useTranslation(['common']);
  const authContext = useAuthDataContext();
  const { currentUser } = authContext;
  const { settings } = currentUser;
  const haveAccessed = settings?.behavior?.includes(
    USER_BEHAVIOR.HAVE_ACCESSED_COURSE_LIST
  );
  const classes = useStyles();
  const [, updateState] = useState();
  const dispatch = useDispatch();
  const [items, setItems] = useState(listItems);
  const history = useHistory();
  const size = useWindowSize();
  const [openTour, setOpenTour] = useState(false);
  const isGuardianRole = isGuardian(authContext?.currentUser);

  useEffect(() => {
    updateState({});
  }, [size]);

  useEffect(() => {
    setItems(listItems);
  }, [listItems, size]);

  const viewDetails = (courseId) => {
    if (isGuardianRole) {
      history.push({
        pathname: ROUTE_MY_COURSES.MY_COURSES_DETAIL_GUARDIAN(
          authContext?.currentStudentId,
          courseId
        ),
        state: {
          fromCourseList: true,
        },
      });
    } else {
      history.push({
        pathname: ROUTE_MY_COURSES.MY_COURSES_DETAIL(courseId),
        state: {
          fromCourseList: true,
        },
      });
    }
  };
  const updateBehavior = () => {
    settings.behavior.push(USER_BEHAVIOR.HAVE_ACCESSED_COURSE_LIST);
    const payload = { settings };
    setOpenTour(false);
    dispatch(myProfileActions.updateMyProfile(payload));
  };

  useEffect(() => {
    if (
      !haveAccessed &&
      status === COURSE_STATUS.DRAFT &&
      items.length > 0 &&
      isTeacher(currentUser)
    ) {
      delay(() => {
        setOpenTour(true);
      }, 500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haveAccessed, status]);
  const tourConfig = [
    {
      selector: '[data-tut="reactour__courseThumbnail"]',
      content: () => (
        <TourContent
          label={t('tour:view_course_detail')}
          content={t('tour:view_course_detail_content')}
        />
      ),
      position: 'right',
    },
  ];

  if (isEmpty(items)) {
    return (
      <EmptyContent
        subTitle={isNull(emptyContent) ? t('no_data') : emptyContent}
        emptyImage={noCoursesAddedYet}
      />
    );
  }
  return (
    <div className={classes.root}>
      <Grid container justifyContent='flex-start' spacing={3}>
        {items?.map((course, index) => (
          <Grid item xs={6} sm={6} md={4} lg={3} xl={2} key={index}>
            <CourseItemCard
              item={course}
              viewDetails={() => viewDetails(course.id)}
              showStatus={showStatus}
              dataTut={index === 0 && 'reactour__courseThumbnail'}
            />
          </Grid>
        ))}
      </Grid>
      <TblTour
        // onRequestClose={onClose}
        steps={tourConfig}
        isOpen={openTour}
        lastStepNextButton={
          <TblButton onClick={updateBehavior}>
            {t('tour:ok_I_got_it')}
          </TblButton>
        }
      />
    </div>
  );
}

CoursesList.propTypes = {
  emptyContent: PropTypes.string,
  isBusy: PropTypes.bool,
  listItems: PropTypes.array,
  showStatus: PropTypes.object,
  status: PropTypes.number
};

CoursesList.defaultProps = {
  emptyContent: null,
};
