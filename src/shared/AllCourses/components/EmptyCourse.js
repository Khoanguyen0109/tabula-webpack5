import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@mui/styles/makeStyles';

import EmptyContent from 'components/EmptyContent';

import emptyImage from 'assets/images/EmptyCourse.svg';
import PropTypes from 'prop-types';

// material-ui

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.newColors.primary[500],
    cursor: 'pointer',
    fontWeight: theme.fontWeight.semi,
  },
}));

const EmptyCourse = (props) => {
  const classes = useStyles();
  const { emptySchoolYear, emptyDataClick } = props;
  const { t } = useTranslation('allCourses');
  const imageWith = 150;

  return emptySchoolYear ? (
    <EmptyContent
      emptyImage={emptyImage}
      width={imageWith}
      title={t('allCourses:guide_create_school_year')}
      subTitle={
        <span>
          {t('allCourses:guide_create_shool_year_sub')}{' '}
          <a onClick={emptyDataClick} className={classes.link}>
            {t('common:click_here')}
          </a>
        </span>
      }
    />
  ) : (
    <EmptyContent
      subTitle={
        <span>
          {t('allCourses:no_course_have_been_added_yet')}
        </span>
      }
    />
  );
};

EmptyCourse.propTypes = {
  emptyDataClick: PropTypes.func,
  emptySchoolYear: PropTypes.bool,
};

export default EmptyCourse;
