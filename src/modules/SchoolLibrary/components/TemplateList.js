import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import EmptyContent from 'components/EmptyContent';
import TemplateCard from 'modules/SchoolLibrary/components/TemplateCard';

import useWindowSize from 'utils/windowSize';

import noCoursesAddedYet from 'assets/images/noCoursesAddedYet.svg';
import { PropTypes } from 'prop-types';

import { ROUTE_SCHOOL_LIBRARY } from '../constantsRoute';

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

export default function CoursesList({ listItems, isBusy, showStatus, emptyContent }) {
  const { t } = useTranslation(['common']);
  const classes = useStyles();
  const [, updateState] = useState();
  const [items, setItems] = useState(listItems || []);
  const size = useWindowSize();
  const history = useHistory();

  useEffect(() => {
    updateState({});
  }, [size]);

  useEffect(() => {
    setItems(listItems);
  }, [listItems, size]);

  const viewDetails = (courseId) => {
    history.push(
      ROUTE_SCHOOL_LIBRARY.LIBRARY_TEMPLATE_DETAIL(courseId)
    );
  };

  if (isEmpty(items) && !isBusy) {
    return (
      <EmptyContent
        subTitle={isNull(emptyContent) ? t('no_data') : emptyContent}
        emptyImage={noCoursesAddedYet}
      />
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justifyContent='flex-start' alignItems='stretch'>
        {items?.map((item, index) => (
          <Grid item xs={6} sm={6} md={4} lg={3} xl={3} key={index}>
            <TemplateCard
              item={item}
              viewDetails={() => viewDetails(item.id)}
              showStatus={showStatus}
            />
          </Grid>
        ))}
      </Grid>
      {isBusy && (
        <Grid container justifyContent='flex-start' spacing={3} py={3}>
          {[0, 1, 2].map((item, index) => (
            <Grid item xs={6} sm={6} md={4} lg={3} xl={2} key={index}>
              <Skeleton variant='rectangular' className={classes.image} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

CoursesList.propTypes = {
  listItems: PropTypes.array,
  emptyContent: PropTypes.string,
  isBusy: PropTypes.bool,
  showStatus: PropTypes.object
};

CoursesList.defaultProps = {
  emptyContent: null,
};
