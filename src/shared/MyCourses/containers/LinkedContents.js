/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import concat from 'lodash/concat';
import differenceBy from 'lodash/differenceBy';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import trim from 'lodash/trim';
import unionBy from 'lodash/unionBy';
import uniqueId from 'lodash/uniqueId';
// import ImportContactsIcon from '@mui/icons-material/ImportContacts';

// import BallotIcon from '@mui/icons-material/Ballot';
// import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
// import PollIcon from '@mui/icons-material/Poll';

import Add from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';

import EmptyContent from 'components/EmptyContent';
import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblButton from 'components/TblButton';
import TblCheckBox from 'components/TblCheckBox';
import TblDialog from 'components/TblDialog';
import TblIconButton from 'components/TblIconButton';
import TblInputLabel from 'components/TblInputLabel';
import TblSelect from 'components/TblSelect';

import { COURSE_ITEM_TYPE } from 'utils/constants';
import { isGuardian } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { ROUTE_MY_COURSES } from 'modules/MyCourses/constantsRoute';
import PropTypes from 'prop-types';

import myCoursesActions from '../../../modules/MyCourses/actions';
import { isTeacher } from '../../../utils/roles';

const useStylesTooltip = makeStyles((theme) => ({
  arrow: {
    fontSize: 5,
    color: theme.palette.common.black,
  },
  tooltip: {
    padding: theme.spacing(1),
    fontSize: theme.fontSize.normal,
    borderRadius: theme.borderRadius.default,
    backgroundColor: theme.palette.common.black,
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 598,
    maxHeight: 'calc(100vh - 435px)',
    '& .MuiListItem-button:hover': {
      background: theme.newColors.gray[300],
    },
  },
  button: {
    width: theme.spacing(10.5),
  },
  inputRoot: {
    borderBottom: `1px solid ${theme.newColors.gray[300]}`,
  },
  positionStart: {
    padding: theme.spacing(1, 0.5, 1, 1),
    fontSize: theme.fontSizeIcon.medium,
    color: theme.mainColors.primary1[0],
    marginRight: 0,
  },
  inputSearch: {
    fontSize: theme.fontSize.normal,
    color: theme.newColors.gray[700],
    padding: '11px 0 11px 0',
  },
  rootDialog: {
    minWidth: 600,
  },
  rootContent: {
    overflow: 'hidden',
  },
  paper: {
    minWidth: 648,
  },
  subtitle: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  listTitle: {
    display: 'flex',
    marginTop: theme.spacing(1),
  },
  emptyContent: {
    marginLeft: '16px',
    color: theme.newColors.gray[700],
    fontSize: theme.fontSize.normal,
  },
  selectedNumber: {
    padding: 0,
    marginLeft: 'auto',
  },
  LinkedContents: {
    border: `1px solid ${theme.newColors.gray[300]}`,
    borderRadius: 8,
    // maxHeight: 496,
    maxHeight: 'calc(100vh - 387px)', //FIXED: comment of TL-3172 (overlap the frame)
  },
  actionLabel: (props) => ({
    alignItems: ' center',
    color: props.viewOnly
      ? theme.mainColors.gray[6]
      : theme.mainColors.primary2[0],
    marginTop: '10px',
    display: 'inline-flex',
    cursor: props.viewOnly ? 'default' : 'pointer',
    marginLeft: '8px',
  }),
  link: {
    textDecoration: 'none',
    color: theme.mainColors.primary1[0],

    '&:focus, &:hover, &:visited, &:link, &:active': {
      textDecoration: 'none',
    },
  },
  type: {
    paddingLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  listItem: {
    height: 64,
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSize.normal,
  },
  no_activity_note: {
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSize.normal,
    paddingLeft: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  fileRow: {
    width: '100%',
    minHeight: theme.spacing(6),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '8px',
    boxShadow: 'inset 0px -1px 0px rgba(0, 0, 0, 0.07)',
    '&:last-child': {
      boxShadow: 'none',
    },
  },
  fileIcon: {
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSizeIcon.normal,
    display: 'flex',
    alignItems: 'center',
  },
  fileName: {
    maxWidth: 'calc(100% - 130px)',
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSize.normal,
    // marginLeft: theme.spacing(1),
  },

  actionIcon: {
    marginLeft: 'auto',
  },
  labelIcon: {
    fontSize: theme.fontSizeIcon.normal,
  },
  removeBtn: {
    color: `${theme.newColors.gray[500] }!important`,
  }
}));

// const myCoursesSelector = (state) => state.AllCourses || {};
const GroupNameEnum = {
  LESSONS: 'lessons',
  ASSIGNMENTS: 'assignments',
  QUIZZES: 'quizzes',
};
const convertLinkedDataToUniqueId = (data) => data.map((item) => ({
      ...item,
      id: `${item?.assignmentLinkId ||
        item?.lessonLinkId ||
        item?.quizLinkId ||
        item?.id
        }_${uniqueId()}`,
    }));

const convertLinkedDataBackToOriginId = (data) => data.map((item) => ({
      ...item,
      id: parseInt(item.id.split('_')[0]),
    }));
function LinkedContents(props) {
  const classes = useStyles(props);
  const classTooltip = useStylesTooltip();

  const {
    title,
    subtitle,
    updateData,
    emptyContent,
    actionLabel,
    unit,
    initialLinkedContents,
    courseActivityInfo,
    viewOnly,
    ableViewItem,
    getUrl,
    courseIdProp,
    onClickViewItem,
    sectionId,
  } = props;
  const theme = useTheme();
  const authContext = useContext(AuthDataContext);
  const assignmentsContents = useSelector(
    (state) => state.AllCourses?.assignmentsContents
  );
  const lessonsContents = useSelector(
    (state) => state.AllCourses?.lessonsContents
  );
  const quizzesContents = useSelector(
    (state) => state.AllCourses?.quizzesContents
  );
  const unitList = useSelector((state) => state.AllCourses?.unitList);

  const { t } = useTranslation(['myCourses', 'common', 'error']);

  const [checkedAssignment, setCheckedAssignment] = React.useState([]);
  const [checkedLesson, setCheckedLesson] = React.useState([]);
  const [checkedQuiz, setCheckedQuiz] = React.useState([]);
  const [linkContents, setLinkContents] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [lessons, setLessons] = React.useState([]);
  const [assignments, setAssignments] = React.useState([]);
  const [quizzes, setQuizzes] = React.useState([]);

  const [selectedUnit, setSelectedUnit] = useState('');

  useEffect(() => {
    if (isArray(initialLinkedContents)) {
      const linkContents = convertLinkedDataToUniqueId(initialLinkedContents);
      setLinkContents(linkContents);
    } else {
      setLinkContents([]);
    }
  }, [initialLinkedContents]);

  const initialAssignmentsContent = useMemo(
    () =>
      convertLinkedDataBackToOriginId(
        linkContents?.filter((item) => item?.assignmentName)
      ),
    [linkContents]
  );
  const initialLessonsContent = useMemo(
    () =>
      convertLinkedDataBackToOriginId(
        linkContents?.filter((item) => item?.lessonName)
      ),
    [linkContents]
  );
  const initialQuizzesContent = useMemo(
    () =>
      convertLinkedDataBackToOriginId(
        linkContents?.filter((item) => item?.quizName)
      ),
    [linkContents]
  );
  const availableAssignmentsContents = useMemo(
    () =>
      differenceBy(
        assignmentsContents,
        initialAssignmentsContent,
        courseActivityInfo?.assignmentName ? [courseActivityInfo] : [],
        'id'
      ),
    [assignmentsContents, initialAssignmentsContent, courseActivityInfo]
  );

  const availableLessonsContents = useMemo(
    () =>
      differenceBy(
        lessonsContents,
        initialLessonsContent,
        courseActivityInfo?.lessonName ? [courseActivityInfo] : [],
        'id'
      ),
    [lessonsContents, initialLessonsContent, courseActivityInfo]
  );
  const availableQuizzesContents = useMemo(
    () =>
      differenceBy(
        quizzesContents,
        initialQuizzesContent,
        courseActivityInfo?.quizName ? [courseActivityInfo] : [],
        'id'
      ),
    [initialQuizzesContent, courseActivityInfo, quizzesContents]
  );
  useEffect(() => {
    setLessons(availableLessonsContents);
  }, [availableLessonsContents, linkContents, open]); //add open un dependencies to reset available list after searching => close => open [bug 2603]

  useEffect(() => {
    setAssignments(availableAssignmentsContents);
  }, [availableAssignmentsContents, linkContents, open]);

  useEffect(() => {
    setQuizzes(availableQuizzesContents);
  }, [availableQuizzesContents, linkContents, open]);

  const { organizationId } = authContext.currentUser;
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const courseId = match.params.courseId || courseIdProp;

  const getLinkedContents = useCallback(() => {
    if (courseId) {
      //to prevent call api undefine course in view activity details in my dashboard
      dispatch(
        myCoursesActions.getLinkedContents({
          orgId: organizationId,
          courseId: courseId,
          isBusy: true,
          urlParams: { unitId: selectedUnit }, //fix bug TL-2427: not filter by unit, get all course day
          // improve TL-3479: filter by unit
        })
      );
    }
  }, [courseId, dispatch, organizationId, selectedUnit]);

  const getUnitsByTerm = useCallback(() => {
    if (courseId) {
      dispatch(
        myCoursesActions.mcGetUnitByCourse({
          orgId: organizationId,
          courseId: courseId,
          isBusy: true,
        })
      );
    }
  }, [courseId, dispatch, organizationId]);

  useEffect(() => {
    if (isTeacher(authContext.currentUser)) {
      getUnitsByTerm();
    }
  }, []);
  useEffect(() => {
    if (isTeacher(authContext.currentUser)) {
      getLinkedContents();
    }
  }, [getLinkedContents]);

  const toggleDialog = (value) => {
    setOpen(value);
    if (value === false) {
      setCheckedLesson([]);
      setCheckedAssignment([]);
      setCheckedQuiz([]);
    }
    setSelectedUnit(unit.id);
  };

  const handleChecked = (item, e, checkedItems, setCheckedItem) => {
    const currentIndex = checkedItems.findIndex((t) => t.id === item.id);
    const newChecked = [...checkedItems];
    if ((e?.target?.checked || isNull(e)) && currentIndex === -1) {
      newChecked.push(item);
    } else if ((!e?.target?.checked || isNull(e)) && currentIndex !== -1) {
      newChecked.splice(currentIndex, 1);
    } else {
      return;
    }
    setCheckedItem(newChecked);
  };

  const handleToggle = (item, e, group) => {
    if (group === GroupNameEnum.LESSONS) {
      handleChecked(item, e, checkedLesson, setCheckedLesson);
    }
    if (group === GroupNameEnum.ASSIGNMENTS) {
      handleChecked(item, e, checkedAssignment, setCheckedAssignment);
    }
    if (group === GroupNameEnum.QUIZZES) {
      handleChecked(item, e, checkedQuiz, setCheckedQuiz);
    }
  };

  const handleSubmit = () => {
    const lessonsData = unionBy(checkedLesson, initialLessonsContent, 'id');
    const assignmentsData = unionBy(
      checkedAssignment,
      initialAssignmentsContent,
      'id'
    );
    const quizzesData = unionBy(checkedQuiz, initialQuizzesContent, 'id');
    const linkContentsData = {
      lessonLinkIds: lessonsData?.map((lesson) => lesson.id),
      assignmentLinkIds: assignmentsData?.map((assignment) => assignment.id),
      quizLinkIds: quizzesData?.map((quiz) => quiz.id),
    };
    const newLinkContents = convertLinkedDataToUniqueId(
      concat(lessonsData, assignmentsData, quizzesData)
    );
    updateData && updateData(linkContentsData);
    setOpen(false);
    setLinkContents(newLinkContents);
    setCheckedLesson([]);
    setCheckedAssignment([]);
    setCheckedQuiz([]);
  };

  const onFilterByUnit = (e) => {
    setSelectedUnit(e.target.value);
  };

  const onSearch = (e) => {
    const value = trim(e.target.value.toLowerCase());
    if (isEmpty(value)) {
      setAssignments(availableAssignmentsContents);
      setLessons(availableLessonsContents);
      setQuizzes(availableQuizzesContents);
      // setItemsList(props.itemsList);
    } else {
      const totalItems = concat(
        availableLessonsContents,
        availableAssignmentsContents,
        availableQuizzesContents
      ).map((item) => ({
          ...item,
          name: item?.quizName || item?.lessonName || item?.assignmentName,
        }));
      const filteredItems = totalItems?.filter(
        (item) => item?.name?.toLowerCase().indexOf(value) !== -1
        // item?.lessonName?.toLowerCase().indexOf(value) !== -1 ||
        // item?.quizName?.toLowerCase().indexOf(value) !== -1
      );
      // const totalItems = concat(
      //   availableLessonsContents,
      //   availableAssignmentsContents,
      //   availableQuizzesContents
      // );
      setAssignments(filteredItems.filter((item) => item?.assignmentName));
      setLessons(filteredItems.filter((item) => item?.lessonName));
      setQuizzes(filteredItems.filter((item) => item?.quizName));
      // setAssignments(filteredAssignments);
      // setLessons(filteredLessons);
      // setQuizzes(filteredQuizzes);
    }
  };

  const renderGroup = (array, group) => {
    if (isEmpty(array)) {
      return (
        <div className={classes.no_activity_note}>{t('no_activities')}</div>
      );
    }
    return array?.map((item) => (
      <ListItem
        key={item?.id}
        button
        className={classes.listItem}
        onClick={() => handleToggle(item, null, group)}
      >
        <Grid container alignItems='center'>
          {getIcon(item)}
          <Grid item>
            <Typography noWrap style={{ maxWidth: 480 }}>
              {item?.lessonName || item?.assignmentName || item?.quizName}
            </Typography>
          </Grid>
        </Grid>
        <ListItemSecondaryAction>
          <TblCheckBox
            edge='end'
            onChange={(e) => handleToggle(item, e, group)}
            // checked={checked.includes(item.id)}
            checked={
              !!checkedLesson.find(
                (checkedItem) => checkedItem.id === item.id && item.lessonName // fix bug TL 2643: to prevent 2 similar ids checked
              ) ||
              !!checkedAssignment.find(
                (checkedItem) =>
                  checkedItem.id === item.id && item.assignmentName // fix bug TL 2643: to prevent 2 similar ids checked
              ) ||
              !!checkedQuiz.find(
                (checkedItem) => checkedItem.id === item.id && item.quizName // fix bug TL 2643: to prevent 2 similar ids checked
              )
            }
          // inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    ));
  };

  const deleteFile = (item) => {
    const data = linkContents.filter((f) => f.id !== item.id);
    setLinkContents(data);
    const getId = (id) => parseInt(id.split('_')[0]);

    const linkContentsData = {
      lessonLinkIds: data
        ?.filter((item) => item.lessonName)
        .map((lesson) => getId(lesson.id)),
      assignmentLinkIds: data
        ?.filter((item) => item.assignmentName)
        .map((assignment) => getId(assignment.id)),
      quizLinkIds: data
        ?.filter((item) => item.quizName)
        .map((quiz) => getId(quiz.id)),
    };
    updateData && updateData(linkContentsData);
  };

  const getIcon = (item) => {
    const type = item?.lessonName
      ? 0
      : item?.quizType === 1 || item?.quizType === 2
        ? 3
        : item?.assignmentName
          ? 1
          : -1;
    return <TblActivityIcon type={type} className={classes.icon} />;
    // if (item?.lessonName)
    //   return <ImportContactsIcon className={classes.icon} />;
    // if (item?.quizType === 1)
    //   return <PlaylistAddCheckIcon className={classes.icon} />;
    // if (item?.quizType === 2) return <PollIcon className={classes.icon} />;
    // if (item?.assignmentName) return <BallotIcon className={classes.icon} />;
  };

  const onClickItem = (e, item) => {
    if (!ableViewItem) {
      e.preventDefault();
    }
    onClickViewItem(item);
  };

  const onRedirectLink = (e, item) => {
    if (!ableViewItem) {
      e.preventDefault();
    } else {
      const path = url(item);
      window.open(`${window.location.origin}${path}`);
    }
  };

  const url = (item) => {
    const { currentStudentId, currentUser } = authContext;
    /** fix bug 3100 - add course id in url for guardian to view activity detail */
    const path =
      !!currentStudentId && isGuardian(currentUser)
        ? ROUTE_MY_COURSES.MY_COURSES_DETAIL_GUARDIAN(
          currentStudentId,
          courseId
        )
        : ROUTE_MY_COURSES.MY_COURSES_DETAIL(courseId);
    let id = item?.shadowId;
    if (getUrl) {
      return getUrl(item);
    }
    let type;
    if (item?.lessonName) {
      type = COURSE_ITEM_TYPE.LESSON;
    }
    if (item?.assignmentName) {
      type = COURSE_ITEM_TYPE.ASSIGNMENT;
    }
    if (item?.quizName) {
      type = `${COURSE_ITEM_TYPE.QUIZ}`;
      id = `${id}-${item.quizType}`;
    }
    return `${path}?week=${item?.weekly}_${item?.termId}&id=${type}-${id}&sectionId=${sectionId}`;
  };

  const renderItems = () => (
      <Box mt={1}>
        {linkContents && linkContents.length === 0 && viewOnly ? (
          <div className={classes.emptyContent}>{emptyContent}</div>
        ) : (
          <>
            <Box mb={2} />
            {linkContents?.map((item) => (
              <Grid
                container
                wrap='nowrap'
                direction='row'
                alignItems='center'
                key={`attach-${item.id}`}
                className={classes.fileRow}
              >
                <Grid className={classes.fileIcon}>{getIcon(item)}</Grid>

                <Grid className={classes.fileName}>
                  <Typography noWrap>
                    {onClickViewItem ? (
                      <Typography noWrap onClick={(e) => onClickItem(e, item)}>
                        {item.lessonName ||
                          item.quizName ||
                          item.assignmentName}
                      </Typography>
                    ) : (
                      <span
                        onClick={(e) => onRedirectLink(e, item)}
                        className={classes.link}
                      >
                        {item.lessonName ||
                          item.quizName ||
                          item.assignmentName}
                      </span>
                    )}
                  </Typography>
                </Grid>
                <Grid className={classes.actionIcon}>
                  {!viewOnly && (<Tooltip arrow classes={classTooltip} title={t('common:remove')} placement='top'>
                  <span>
                    <TblIconButton
                        className={classes.removeBtn}
                        onClick={() => deleteFile(item)}>
                        <CancelIcon size='small' />
                      </TblIconButton>
                  </span>
                  </Tooltip>)}
                </Grid>
              </Grid>
            ))}
          </>
        )}
      </Box>
    );

  const renderDialog = () => (
      <TblDialog
        title={title || t('add_linked_contents')}
        open={open}
        showScrollBar={false}
        classes={{ root: classes.rootDialog, paper: classes.paper }}
        footer={
          <>
            <Box mt={3}>
              <TblButton
                variant='outlined'
                color='primary'
                onClick={() => {
                  toggleDialog(false);
                  // resetForm();
                }}
              >
                {t('common:cancel')}
              </TblButton>
            </Box>
            <Box mt={3}>
              <TblButton
                variant='contained'
                color='primary'
                type='submit'
                onClick={handleSubmit}
              >
                {t('common:add')}
              </TblButton>
            </Box>
          </>
        }
      >
        <Box mb={2}>
          <TblSelect
            label={t('common:unit')}
            placeholder={t('common:select')}
            value={selectedUnit}
            onChange={onFilterByUnit}
          >
            <MenuItem value={''}>{t('common:all_units')}</MenuItem>
            {unitList?.map((unit) => (
              <MenuItem value={unit.id}>{unit.unitName}</MenuItem>
            ))}
          </TblSelect>
        </Box>

        <div className={classes.subtitle}>{subtitle}</div>
        <div className={classes.listTitle}>
          <TblInputLabel>{t('available_activities')}</TblInputLabel>
          <TblInputLabel className={classes.selectedNumber}>
            {concat(checkedQuiz, checkedAssignment, checkedLesson)?.length}{' '}
            {t('selected')}
          </TblInputLabel>
        </div>
        <Box className={classes.LinkedContents}>
          <Input
            fullWidth
            classes={{ input: classes.inputSearch, root: classes.inputRoot }}
            startAdornment={
              <InputAdornment
                position='start'
                classes={{ positionStart: classes.positionStart }}
              >
                <span className={'icon-icn_search'} />
              </InputAdornment>
            }
            disableUnderline
            placeholder={t('common:search')}
            onChange={onSearch}
          />
          {concat(lessonsContents, assignmentsContents, quizzesContents)
            ?.length ? (
            <PerfectScrollbar>
              <List dense className={classes.root}>
                <>
                  <TblInputLabel className={classes.type}>
                    {t('lessons')}
                  </TblInputLabel>
                  {renderGroup(lessons, GroupNameEnum.LESSONS)}
                </>
                <>
                  <TblInputLabel className={classes.type}>
                    {t('assignments')}
                  </TblInputLabel>
                  {renderGroup(assignments, GroupNameEnum.ASSIGNMENTS)}
                </>
                <>
                  <TblInputLabel className={classes.type}>
                    {t('quizzes')}
                  </TblInputLabel>
                  {renderGroup(quizzes, GroupNameEnum.QUIZZES)}
                </>
              </List>
            </PerfectScrollbar>
          ) : (
            <EmptyContent subTitle={t('common:no_data')} />
          )}
        </Box>
      </TblDialog>
    );
  return (
    <Box pl={1}>
      {renderDialog()}
      <Box display='flex' alignItems='center'>
        <LinkIcon className={classes.labelIcon} />
        <Typography ml={1} variant='labelLarge' color={theme.newColors.gray[600]}>
          {title}
        </Typography>
      </Box>

      {actionLabel && (
        <>
          <Box mb={3} />
          <TblButton
            variant='outlined'
            className={classes.button}
            color='primary'
            onClick={() => toggleDialog(viewOnly ? false : true)}
            startIcon={<Add />}
          >
            {t('common:add')}
          </TblButton>
        </>
      )}
      {renderItems()}
    </Box>
  );
}

export default React.memo(LinkedContents);
LinkedContents.propTypes = {
  selectedItems: PropTypes.array,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  itemsList: PropTypes.array,
  updateData: PropTypes.func,
  menu: PropTypes.array,
  initialLinkedContents: PropTypes.array,
  unit: PropTypes.object,
  LinkedContentsTitle: PropTypes.string,
  actionLabel: PropTypes.string,
  courseActivityInfo: PropTypes.object,
  viewOnly: PropTypes.bool,
  emptyContent: PropTypes.string,
  type: PropTypes.string,
  getUrl: PropTypes.func,
  ableViewItem: PropTypes.bool,
  sectionId: PropTypes.number,
  courseIdProp: PropTypes.number,
  onClickViewItem: PropTypes.func,
};
LinkedContents.defaultProps = {
  subtitle: 'Choose the course activities that will be in this Assignment',
  viewOnly: false,
  title: 'Related Lessons, Assignments, Tests',
  actionLabel: 'Add Related Lessons, Assignments, Tests',
  ableViewItem: false,
  emptyContent: 'No Related Lessons, Assignments, Tests',
};
