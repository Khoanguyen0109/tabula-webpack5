import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { areEqual } from 'react-window';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import makeStyles from '@mui/styles/makeStyles';

import moment from 'moment';
import PropTypes from 'prop-types';

import ActivityItem from '../../shared/ActivityItem';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi
  },
  emptyContent: {
    color: theme.newColors.gray[800],
    fontSize: theme.fontSize.normal
  }
}));

const ActivitiesList = React.memo(function(props) {
  const { data, activitiesList, activeId, handleClickItem, fetchData } = props;
  const { date, timeFrom, timeTo, sectionSchedulesId } = data;
  const classes = useStyles();
  const { t } = useTranslation(['plan']);
  useEffect(() => {
    fetchData(sectionSchedulesId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionSchedulesId]);

  return (
    <Fade in={true} timeout={400}>
      <Box mb={3}>
        <Box className={classes.title} mb={0.5} pl={1}>
          {moment(date).format('MMM DD, YYYY')} - {moment(timeFrom).format('hh:mm a')} to {moment(timeTo).format('hh:mm a')}
        </Box>
        {activitiesList.length > 0 ? (
          <>
            {activitiesList.map((item, index) => (
              <Box mb={0.5} key={index}>
                <ActivityItem activity={{ ...item }} activeId={activeId} handleClickItem={handleClickItem}/>
              </Box>
            ))}
          </>
        ) : (
            <Box p={1} className={classes.emptyContent}>{t('no_activities')}</Box>
        )}
        
      </Box>
    </Fade>
  );
}, areEqual);

ActivitiesList.propTypes = {
  data: PropTypes.object,
  activitiesList: PropTypes.array,
  fetchData: PropTypes.func,
  hasPermission: PropTypes.bool,
  activeId: PropTypes.string,
  handleClickItem: PropTypes.func
};

export default ActivitiesList;