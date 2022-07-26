import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List, areEqual } from 'react-window';

import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import debounceRender from 'components/TblDebounce';
import TblTour from 'components/TblTour';
import TourContent from 'components/TblTour/TourContent';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { delay } from 'lodash-es';
import myProfileActions from 'modules/MyProfile/actions';
import PropTypes from 'prop-types';

import { USER_BEHAVIOR } from '../../../../shared/User/constants';
import myCourseActions from '../../actions';
import { getInitialScrollOffset } from '../../utils';

import CourseDayColumn from './CourseDayColumn';

const useStyles = makeStyles((theme) => ({
  list: {
    overflow: 'hidden',
    marginTop: 30,
  },
  listHeader: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  courseDayName: {
    paddingLeft: theme.spacing(0),
    paddingBottom: theme.spacing(0.5),
  },
}));

const renderColumn = React.memo(
  ({
    index,
    isScrolling,
    style,
    data: {
      list,
      handleIconsMore,
      viewShadowDetail,
      hasPermission,
      worker,
      isDragging,
      viewMasterDetail,
      handleRelinkShadowItem,
      handleChangeMasterStatus,
    },
  }) => 
     (
      <div style={style}>
        <CourseDayColumn
          worker={worker}
          isScrolling={isScrolling && !isDragging}
          data={list[index]}
          viewShadowDetail={viewShadowDetail}
          handleIconsMore={handleIconsMore}
          hasPermission={hasPermission}
          viewMasterDetail={viewMasterDetail}
          handleRelinkShadowItem={handleRelinkShadowItem}
          handleChangeMasterStatus={handleChangeMasterStatus}
        />
      </div>
    )
  
);
renderColumn.propTypes = {
  t: PropTypes.func,
  index: PropTypes.number,
  isScrolling: PropTypes.bool,
  isDragging: PropTypes.bool,
  style: PropTypes.object,
  data: PropTypes.object,
};
const debounceRenderColumn = debounceRender(renderColumn, 100);
// function onItemsRendered(props) {
//   console.log(props);
// }
const itemKey = (index) => `courseDay-${index}`;
// const onSyncScroll = debounce((ps) => {
//   ps.update();
// }, 1000);
const HeaderTitle = ({ index, style, data: { list } }) => {
  const { courseDayName, range, id } = list[index];
  const currentCourseDayId = useSelector(
    (state) => state.AllCourses.currentCourseDayId
  );

  return (
    <div style={style}>
      <Typography
        component='div'
        variant='labelLarge'
        data-tut={
          id === currentCourseDayId.toString() ? 'reactour__courseDay' : ''
        }
      >
        {courseDayName} ({range})
      </Typography>
    </div>
  );
};
HeaderTitle.propTypes = {
  index: PropTypes.number,
  style: PropTypes.object,
  data: PropTypes.object,
};
const debounceRenderHeaderTitle = debounceRender(HeaderTitle, 100);

const CustomScrollbar = React.memo(
  React.forwardRef(({ onScroll, ...props }, ref) => {
    const newScroll = (container) => {
      // console.log(container);
      const event = {
        currentTarget: {
          clientWidth: container.offsetWidth,
          scrollLeft: container.scrollLeft,
          scrollWidth: container.scrollWidth,
        },
      };
      // console.log(event);
      onScroll(event);
    };
    // const newStyle = {...style, overflow: 'hidden'};
    // console.log('custom scrollbar');
    return (
      <PerfectScrollbar onScrollX={newScroll} containerRef={ref} {...props} />
    );
  }),
  areEqual
);
CustomScrollbar.propTypes = {
  onScroll: PropTypes.func,
  style: PropTypes.object,
};
// const WrapperDiv = React.memo(React.forwardRef(({onScroll, style, ...props}, ref) => {
//   // const isDragging = useSelector(state => state.AllCourses.isDragging);
//   // const newStyle = {...style, 'overflow': 'hidden'};
//   // // console.log(isDragging, newStyle);
//   // const newScroll = (e) => {

//   //   onScroll(e);
//   // };
//   // console.log('Render list', props, newScroll);
//   return <div ref={ref}  style={style} {...props} />;
// }));
const itemSize = 296;
const CourseDayList = React.memo(function (props) {
  const dispatch = useDispatch();
  const headerRef = React.useRef();
  const contentRef = React.useRef();
  const authContext = useContext(AuthDataContext);
  const { currentUser } = authContext;
  const { t } = useTranslation('tour');
  const havePlaned = currentUser?.settings?.behavior?.includes(
    USER_BEHAVIOR.HAVE_PLANED
  );
  const [open, setOpen] = useState(false);
  const currentCourseDayId = useSelector(
    (state) => state.AllCourses.currentCourseDayId
  );
  const planningData = useSelector((state) => state.AllCourses.planningData);
  const firstTime = useSelector((state) => state.AllCourses.firstTime);

  const {
    handleIconsMore,
    hasPermission,
    viewShadowDetail,
    viewMasterDetail,
    handleRelinkShadowItem,
    handleChangeMasterStatus,
    list,
  } = props;
  // const isDragging = useSelector(state => state.AllCourses.isDragging);
  const classes = useStyles();
  let worker = new Worker(new URL('../../../../workers/course.worker.js', import.meta.url));
  let callback = {};
  worker.onmessage = (e) => {
    if (callback[e.data.courseDayId]) {
      callback[e.data.courseDayId](e);
    }
  };
  // worker.onerror = e => {
  //   console.log(e);
  // };
  worker.addCallback = (key, func) => {
    callback[key] = func;
  };
  worker.removeCallback = (key) => {
    delete callback[key];
  };
  // useEffect(() => {
  //   callback = null;
  //   worker = null;
  // }, []);
  // console.log('Course Day');
  const onClose = () => {
    setOpen(false);
    dispatch(myCourseActions.myCoursesSetState({ firstTime: false }));
  };

  const updateBehavior = () => {
    onClose();
    currentUser.settings.behavior.push(USER_BEHAVIOR.HAVE_PLANED);
    const payload = { settings: currentUser.settings };
    dispatch(myProfileActions.updateMyProfile(payload));
  };

  useEffect(() => {
    if (
      firstTime &&
      !havePlaned &&
      Object.keys(planningData).includes(currentCourseDayId)
    ) {
      delay(() => setOpen(true), 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planningData, currentCourseDayId]);
  const tourConfig = [
    {
      selector: '[data-tut="reactour__courseDay"]',
      content: () => (
        <TourContent
          label={t('tour:course_day')}
          content={t('tour:course_day_content')}
        />
      ),
      position: 'right',
    },
    {
      selector: '[data-tut="reactour__masterItem"]',
      content: () => (
        <TourContent
          label={t('master_activity')}
          content={t('master_activity_content')}
        />
      ),
      position: 'right',
    },
    {
      selector: '[data-tut="reactour__shadowItem"]',
      content: () => (
        <TourContent
          label={t('section_activity')}
          content={t('section_activity_content')}
        />
      ),
      position: window.innerHeight <= 800 ? 'top' : 'right',
    },
  ];
  return (
    <>
      <AutoSizer>
        {({ height, width }) => (
            <List
              className={classes.listHeader}
              height={height}
              itemCount={props.list.length}
              itemSize={itemSize}
              ref={headerRef}
              width={width}
              layout='horizontal'
              itemData={{ list: props.list, classes }}
              onScroll={(e) => contentRef.current?.scrollTo(e.scrollOffset)}
              initialScrollOffset={getInitialScrollOffset(
                list,
                currentCourseDayId,
                itemSize
              )}
            >
              {debounceRenderHeaderTitle}
            </List>
          )}
      </AutoSizer>
      <AutoSizer>
        {({ height, width }) => (
            <List
              className={`${classes.list}`}
              height={height - 30}
              itemCount={props.list.length}
              itemSize={itemSize}
              useIsScrolling
              overscanCount={6}
              itemKey={itemKey}
              ref={contentRef}
              // isDragging={isDragging}
              width={width + 40}
              // onItemsRendered={onItemsRendered}
              layout='horizontal'
              itemData={{
                list: props.list,
                handleIconsMore,
                hasPermission,
                worker,
                viewShadowDetail,
                viewMasterDetail,
                handleRelinkShadowItem,
                handleChangeMasterStatus,
              }}
              // outerElementType={WrapperDiv}
              onScroll={(e) => headerRef.current.scrollTo(e.scrollOffset)}
              initialScrollOffset={getInitialScrollOffset(
                list,
                currentCourseDayId,
                itemSize
              )}
            >
              {debounceRenderColumn}
            </List>
          )}
      </AutoSizer>
      <TblTour
        // onRequestClose={onClose}
        steps={tourConfig}
        isOpen={open}
        lastStepNextButton={
          <TblButton onClick={updateBehavior}>{t('ok_I_got_it')}</TblButton>
        }
      />
    </>
  );
}, areEqual);

CourseDayList.propTypes = {
  t: PropTypes.func,
  viewShadowDetail: PropTypes.func,
  data: PropTypes.object,
  columnId: PropTypes.number,
  quotes: PropTypes.array,
  handleIconsMore: PropTypes.func,
  list: PropTypes.array,
  hasPermission: PropTypes.bool,
  viewMasterDetail: PropTypes.func,
  handleRelinkShadowItem: PropTypes.func,
  handleChangeMasterStatus: PropTypes.func,
};

export default CourseDayList;
