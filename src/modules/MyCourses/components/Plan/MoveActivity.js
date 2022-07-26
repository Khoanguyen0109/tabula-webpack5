import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';

import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';

import NestedMenuItem from 'components/TblNestedMenu';

import PropTypes from 'prop-types';

import { isAvailableItemInPlan } from '../../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: 'space-between',
  },
  listItem: {
    marginLeft: 8,
  },
  contextMenuItem: {
    display: 'flex',
    zIndex: 999,
    alignItems: 'center',
    fontSize: theme.fontSize.normal,
    '& span': {
      marginRight: theme.spacing(1),
      fontSize: theme.fontSizeIcon.medium,
    },
  },
  contextMenuSelected: {
    color: theme.mainColors.primary2[0],
    opacity: `${1}!important`,
  },
  wrapLoadingMoveTo: {
    height: 'auto',
    minWidth: '270px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wrapMoveTo: {
    height: '600px',
    minWidth: '270px',
  },
}));
function MoveActivity(props) {
  const currentDayId = useSelector((state) => state.AllCourses.currentDayId);

  const {
    t,
    parentEl,
    value,
    courseDays,
    courseDayList,
    getCourseDay,
    getAllCourseDays,
    onMove,
    type,
    handleCloseMenu,
    dragId,
  } = props;
  const classes = useStyles();
  const [data, setData] = useState([]);
  const originCourseDayId = dragId.split('_')[0]?.split('-')[1];
  const isMaster = type.indexOf('master') !== -1;
  const courseDayId =
    isMaster && originCourseDayId === 'none'
      ? props.value.courseDayId || currentDayId
      : originCourseDayId;

  useEffect(() => {
    if (isEmpty(courseDays) && type.indexOf('master') !== -1) {
      getAllCourseDays();
    }
  }, [courseDays, data, getAllCourseDays, type]);
  useEffect(() => {
    if (
      isEmpty(courseDayList) &&
      type.indexOf('master') === -1 &&
      value.sectionId
    ) {
      getCourseDay(value?.sectionId);
    }
  }, [courseDayList, data, getCourseDay, type, value]);
  useEffect(() => {
    if (!isEmpty(courseDayList) && type.indexOf('master') === -1) {
      setData(courseDayList);
    } else {
      setData(courseDays);
    }
  }, [type, courseDays, courseDayList]);

  // if (!parentEl) {
  //   return null;
  // }
  const menuPosition = {
    top: parentEl.pageX,
    left: parentEl.pageY,
  };
  let sourceId = dragId.split('_')[0];
  sourceId = sourceId.split('-')[1];
  const onClickMenu = (courseDayId, termId) => () => {
    // NOTE: Fixed bug move from basket curricular, can't reload old column for Assignment and Quiz
    const id = isAvailableItemInPlan(dragId)
      ? value?.course_day?.id ?? value?.executeDateId ?? value?.courseDayId
      : sourceId;
    onMove(
      courseDayId,
      id,
      value.id,
      type,
      value?.sectionId,
      termId,
      dragId,
      sourceId
    );
    handleCloseMenu();
  };

  // if (isEmpty(courseDays)) {
  //   return <CircularProgress />;
  // }
  // console.log(data);

  // convert courseDay... to single level array
  const convertedData = data?.reduce(
    (accumulator, currentValue) => [
      ...accumulator,
      currentValue,
      ...currentValue.dates,
    ],
    []
  );

  const getInitialScrollOffset = useCallback(
    (height = 35) => {
      let scrollOffset = 0;
      if (convertedData.length && courseDayId) {
        const index = convertedData.findIndex((i) => {
          const { id: dataId, courseDayId: dataCourseDayId } = i;
          const compareId = isMaster ? dataId : dataCourseDayId;
          return compareId === courseDayId;
        });
        scrollOffset = index * height;
      }
      return scrollOffset;
    },
    [convertedData, courseDayId, isMaster]
  );

  const checkDisabled = useCallback(
    (row) => {
      if (isMaster) {
        return (
          Number(courseDayId) === Number(row.id) &&
          (originCourseDayId === 'none' ? value.planned : true)
        );
      }
      return (
        Number(value?.course_day?.id) === Number(row.courseDayId) ||
        Number(value?.courseDayId) === Number(row.courseDayId) ||
        Number(row.courseDayId) === Number(sourceId)
      );
    },
    [courseDayId, isMaster, originCourseDayId, sourceId, value]
  );

  if (!parentEl) {
    return null;
  }
  return (
    <NestedMenuItem
      label={
        <Box className={classes.contextMenuItem}>{t('common:move_to')}</Box>
      }
      className={classes.root}
      loading={isEmpty(data)}
      parentMenuOpen={!!menuPosition}
    >
      {isEmpty(data) && isEmpty(convertedData) ? (
        <div className={classes.wrapLoadingMoveTo}>
          <CircularProgress size={30} />
        </div>
      ) : convertedData.length < 20 ? (
        convertedData.map((row) => {
          if (row?.termName) {
            return (
              <ListSubheader
                color='primary'
                disableSticky
                key={row?.termName}
                className='text-ellipsis'
              >
                {row?.termName}
              </ListSubheader>
            );
          }
          return (
            <MenuItem
              key={row.id}
              disabled={checkDisabled(row)}
              onClick={onClickMenu(row.courseDayId ?? row.id, row.termId)}
              className={`${
                checkDisabled(row) ? classes.contextMenuSelected : ''
              }`}
            >
              <Box className={classes.contextMenuItem}>{row.courseDayName}</Box>
            </MenuItem>
          );
        })
      ) : (
        <div className={classes.wrapMoveTo}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                itemKey={(key) => `course-day-${key}`}
                itemData={convertedData}
                itemCount={convertedData.length}
                itemSize={(index) => (convertedData[index]?.termName ? 50 : 35)}
                layout='vertical'
                initialScrollOffset={getInitialScrollOffset()}
              >
                {(item) => {
                  const iRow = item.index;
                  const row = item.data[iRow];
                  if (row?.termName) {
                    return (
                      <ListSubheader
                        style={item.style}
                        color='primary'
                        disableSticky
                        key={row?.termName}
                        className='text-ellipsis'
                      >
                        {row?.termName}
                      </ListSubheader>
                    );
                  }
                  return (
                    <MenuItem
                      key={row.id}
                      style={item.style}
                      disabled={checkDisabled(row)}
                      onClick={onClickMenu(
                        row.courseDayId ?? row.id,
                        row.termId
                      )}
                      className={`${
                        checkDisabled(row) ? classes.contextMenuSelected : ''
                      }`}
                    >
                      <Box className={classes.contextMenuItem}>
                        {row.courseDayName}
                      </Box>
                    </MenuItem>
                  );
                }}
              </List>
            )}
          </AutoSizer>
        </div>
      )}
    </NestedMenuItem>
  );
}

MoveActivity.propTypes = {
  t: PropTypes.func,
  handleCloseMenu: PropTypes.func,
  getCourseDay: PropTypes.func,
  getAllCourseDays: PropTypes.func,
  courseDays: PropTypes.array,
  onMove: PropTypes.func,
  type: PropTypes.string,
  dragId: PropTypes.string,
  value: PropTypes.object,
  courseDayList: PropTypes.array,
  parentEl: PropTypes.element,
};
export default MoveActivity;
