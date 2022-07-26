/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblControllingPicker from 'components/TblControllingPicker';
import TblCustomScrollbar from 'components/TblCustomScrollbar';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { setUrlParam } from 'utils';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.mainColors.primary1[0],
  },
  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  dayWrapper: {
    marginBottom: 11,
  },
  weekDay: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semi,
    display: 'block',
  },
  date: {
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
  },
  today: {
    color: theme.newColors.gray[700],
    whiteSpace: 'pre',
  },
  courseName: {
    marginBottom: 4,
  },
  controlButtonWrapper: {
    marginLeft: 'auto',
  },
  controlButton: {
    backgroundColor: (props) =>
      props.view === 'daily' ? theme.newColors.gray[100] : 'white',
    marginRight: 2,
    height: theme.spacing(4),
    width: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  controlButtonLeft: {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  },
  controlButtonRight: {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  },
  rootItem: {
    display: 'grid',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
      background: theme.newColors.gray[300],
    },
    '& .active': {
      color: theme.palette.secondary.main,
    },
  },
  active: {
    background: theme.openColors.white,
  },
}));

function ListCourseBlock(props) {
  const {
    getAgendaList,
    agendaList,
    getAgendaDetail,
    updateSelectedCourseBlock,
  } = props;
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation('agenda', 'common');
  const classes = useStyles();
  const [activeItem, setActiveItem] = React.useState(null);
  const urlSearchParams = new URLSearchParams(location.search);

  const [selectedDay, setSelectedDay] = React.useState(
    moment(urlSearchParams.get('date'), 'DD-MM-YYYY') || moment()
  );
  // const classes = useStyles();

  useEffect(() => {
    if (selectedDay) {
      getAgendaList(selectedDay);
    }
  }, [getAgendaList, selectedDay]);

  useEffect(() => {
    if (isEmpty(urlSearchParams.get('date'))) {
      setUrlParam(
        location,
        history,
        { date: moment().format('DD-MM-YYYY') },
        null,
        urlSearchParams
      );
      setSelectedDay(moment());
    }
  }, []);

  const onClickCourseBlock = (courseBlock) => {
    setActiveItem(courseBlock?.agendaId);
    getAgendaDetail(Number(courseBlock?.agendaId));
    updateSelectedCourseBlock && updateSelectedCourseBlock(courseBlock);
  };

  const renderCourseBlock = (courseBlock, i) => (
      <div
        className={clsx(classes.rootItem, {
          [classes.active]: courseBlock?.agendaId === activeItem,
        })}
        key={i}
        onClick={() => onClickCourseBlock(courseBlock)}
      >
        <Typography
          component='span'
          noWrap
          variant='labelLarge'
          className={clsx(classes.courseName, {
            active: courseBlock?.agendaId === activeItem,
          })}
        >
          {courseBlock?.courseName}
        </Typography>
        <div
          className={clsx({
            active: courseBlock?.agendaId === activeItem,
          })}
        >
          <Typography variant='bodySmall'>
            {moment(courseBlock?.startTime).format('hh:mm a')} to{' '}
            {moment(courseBlock?.endTime).format('hh:mm a')} -{' '}
            {courseBlock?.sectionName}
          </Typography>
        </div>
      </div>
    );

  const next = debounce(() => {
    setSelectedDay(moment(selectedDay, 'DD-MM-YYYY').add(1, 'days'));
    setUrlParam(
      location,
      history,
      {
        date: moment(selectedDay, 'DD-MM-YYYY')
          .add(1, 'days')
          .format('DD-MM-YYYY'),
      },
      null,
      urlSearchParams
    );
    updateSelectedCourseBlock && updateSelectedCourseBlock(null);
    setActiveItem(null);
  }, 500);

  const prev = debounce(() => {
    setSelectedDay(moment(selectedDay, 'DD-MM-YYYY').subtract(1, 'days'));
    setUrlParam(
      location,
      history,
      {
        date: moment(selectedDay, 'DD-MM-YYYY')
          .subtract(1, 'days')
          .format('DD-MM-YYYY'),
      },
      null,
      urlSearchParams
    );
    setActiveItem(null);
    updateSelectedCourseBlock && updateSelectedCourseBlock(null);
  }, 500);

  const onDateChange = (date) => {
    if (date) {
      setSelectedDay(date);
      setActiveItem(null);
      setUrlParam(
        location,
        history,
        { date: moment(date).format('DD-MM-YYYY') },
        null,
        urlSearchParams
      );
      updateSelectedCourseBlock && updateSelectedCourseBlock(null);
    }
  };
  return (
    <div className={classes.root}>
      <div className={classes.flexAlignCenter}>
        <div className={classes.dayWrapper}>
          <div className={classes.weekDay}>{selectedDay.format('dddd')}</div>
          <div className={classes.flexAlignCenter}>
            <div className={classes.date}>
              {selectedDay.format('MMM DD, YYYY')}
            </div>
            {selectedDay.isSame(new Date(), 'day') && (
              <div className={classes.today}>{` (${t('common:today')})`}</div>
            )}
          </div>
        </div>
        <div
          className={clsx(
            classes.flexAlignCenter,
            classes.controlButtonWrapper
          )}
        >
          <Box mr={0.5}>
            <TblControllingPicker onChange={onDateChange} date={selectedDay} />
          </Box>
          <div
            className={clsx(classes.controlButton, classes.controlButtonLeft)}
            onClick={prev}
          >
            <ChevronLeftIcon
              className={clsx(classes.controlIcon, {
                [classes.disabled]: true,
              })}
            />
          </div>
          <div
            className={clsx(classes.controlButton, classes.controlButtonRight)}
            onClick={next}
          >
            <ChevronRightIcon className={classes.controlIcon} />
          </div>
        </div>
      </div>
      {isEmpty(agendaList) ? (
        t('common:no_class_sessions')
      ) : (
        <TblCustomScrollbar maxHeightScroll={'calc(100vh - 200px)'}>
          {agendaList?.map((courseBlock, i) =>
            renderCourseBlock(courseBlock, i)
          )}
        </TblCustomScrollbar>
      )}
    </div>
  );
}

ListCourseBlock.propTypes = {
  getAgendaList: PropTypes.func,
  agendaList: PropTypes.array,
  getAgendaDetail: PropTypes.func,
  updateSelectedCourseBlock: PropTypes.func,
};
export default ListCourseBlock;
