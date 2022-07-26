/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { areEqual } from 'react-window';

import isNil from 'lodash/isNil';

import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
// import PollRoundedIcon from '@mui/icons-material/PollRounded';
// import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblIconButton from 'components/TblIconButton';
import TblSelect from 'components/TblSelect';

import { COURSE_ITEM_TYPE } from 'utils/constants';
import { checkIsInThePast } from 'utils/validation';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { ReactComponent as IconPlugged } from 'assets/images/icn_plugged.svg';
import { ReactComponent as IconUnplugged } from 'assets/images/icn_unplugged.svg';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import {
  ASSIGNMENT_STATUS,
  MASTER_ITEM_STATUS,
  PLANNING_STATUS,
  QUIZ_STATUS,
  QUIZ_TYPE,
} from '../../constants';
import { isAvailableItemInPlan, isMasterItemInPlan } from '../../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    borderRadius: theme.spacing(1),
    background: theme.openColors.white,
    minHeight: theme.spacing(5.5),
    fontSize: theme.fontSize.normal,
    border: `1px solid ${theme.newColors.gray[300]}`,
    marginBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: '280px',
    maxWidth: '100%',
    '& .text-ellipsis-2row': {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(0.5),
    },
  },
  highlight: {
    backgroundColor: theme.openColors.yellow[1],
  },
  flex: {
    display: 'flex',
  },
  headerRow: {
    fontSize: theme.fontSize.small,
  },
  headerRowPlanned: {
    boxShadow: '0 1px 0 0 #f1f3f5',
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  iconDrag: {
    fontSize: theme.fontSizeIcon.small,
    color: theme.mainColors.gray[6],
  },
  iconMore: {
    fontSize: theme.fontSizeIcon.medium,
    color: theme.palette.primary.main,
  },
  iconCourseItem: {
    fontSize: theme.fontSizeIcon.medium,
  },
  iconLink: {
    fontSize: theme.fontSizeIcon.medium,
    cursor: 'pointer',
  },
  disabled: {
    color: theme.mainColors.status.archived,
  },
  // colorGray: {
  //   color: theme.newColors.gray[500]
  // },
  setTimeNotActive: {
    color: theme.palette.secondary.main,
    textDecoration: 'underline',
    fontSize: theme.fontSize.small,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  setTimeActive: {
    color: theme.palette.secondary.primary,
    fontSize: theme.fontSize.small,
    '&:hover': {
      cursor: 'default',
    },
  },
  activeMaster: {
    color: theme.palette.primary.main,
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.secondary.main,
    },
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  marginRightHalf: {
    marginRight: theme.spacing(0.25),
  },
  flexGrow1: {
    flexGrow: 1,
  },
  iconStatus: {
    fontSize: 8,
    marginRight: theme.spacing(0.5),
  },
  paddingRight2: {
    paddingRight: theme.spacing(2),
  },
  paddingLeft2: {
    paddingLeft: theme.spacing(2),
  },
  justifyContentFlexEnd: {
    justifyContent: 'flex-end',
  },
  availableList: {
    // minWidth: 168,
    width: '70%',
    maxWidth: '200%',
  },
  planned: {
    '&.text-ellipsis-2row': {
      marginLeft: theme.spacing(5.5),
      // marginTop: theme.spacing(0)
    },
  },
  linkAction: {
    display: 'flex',
    alignItems: 'center',
    '& .link-icon': {
      padding: theme.spacing(0.25),
      borderRadius: theme.spacing(1),
      marginLeft: theme.spacing(0.5),
    },
    '&.link-plugged': {
      color: theme.openColors.blue[7],
      '& .link-icon': {
        background: theme.openColors.blue[0],
      },
    },
    '&.link-unplugged': {
      color: theme.newColors.gray[500],
      '& .link-icon': {
        background: theme.newColors.gray[100],
      },
    },
  },
  header: {
    fontSize: theme.fontSize.small,
    height: theme.spacing(4.5),
    paddingBottom: theme.spacing(1),
    boxShadow: '0 1px 0 0 #f1f3f5',
  },
  masterHeader: {
    '& .Mui-disabled': {
      backgroundColor: 'transparent',
    },
    '& .TblSelect-root': {
      marginLeft: theme.spacing(0.5),
      '& .MuiInputLabel-root': {
        marginBottom: '0',
      },
      '& .MuiOutlinedInput-root': {
        height: theme.spacing(3.5),
        fontWeight: theme.fontWeight.semi,
        borderRadius: theme.spacing(1),
        '& .MuiSelect-select': {
          color: theme.openColors.white,
          fontSize: theme.fontSize.small,
        },
        '& .MuiSelect-icon': {
          top: theme.spacing(0.5),
          right: theme.spacing(1),
          color: theme.openColors.white,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      },
    },
  },
  draftStyle: {
    '& .MuiOutlinedInput-root': {
      width: theme.spacing(9),
      backgroundColor: theme.mainColors.red[1],
      border: `1px solid ${theme.mainColors.red[2]}`,
      '&.Mui-disabled': {
        width: 'auto',
      },
    },
  },
  publishedStyle: {
    '& .MuiOutlinedInput-root': {
      width: theme.spacing(13),
      backgroundColor: theme.mainColors.green[1],
      border: '1px solid #269918',
      '&.Mui-disabled': {
        width: 'auto',
      },
    },
  },
}));

const ActivityItem = React.memo(function (props) {
  const authContext = useContext(AuthDataContext);
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(['plan', 'status', 'error']);
  const dataItem = props?.dataItem?.data;
  const key = props?.dataItem?.id?.split('-')[0];
  const { type, status, linked, quizType } = dataItem;
  const { hasPermission } = props;
  const isShowSetTime =
    isNil(dataItem.planned) &&
    !isNil(dataItem.type) &&
    ((dataItem.type === COURSE_ITEM_TYPE.QUIZ &&
      quizType === QUIZ_TYPE.ANNOUNCED) ||
      dataItem.type === COURSE_ITEM_TYPE.ASSIGNMENT);
  const [masterKey, setMasterKey] = useState('');
  const keyType = `${dataItem?.type || 0}${
    dataItem?.type === COURSE_ITEM_TYPE.QUIZ ? `-${quizType}` : ''
  }`;
  const id = isMasterItemInPlan(props.id)
    ? `${dataItem.id}_${keyType}`
    : `${dataItem[`${masterKey}`]}_${keyType}`;
  const isHighlight =
    !isAvailableItemInPlan(props.id) &&
    !!authContext.highlightId &&
    authContext.highlightId === id;
  const isMasterItem = key === 'masterItem';
  const isShadowItem = key === 'shadowItem';
  const [itemStatus, setItemStatus] = useState(
    status || MASTER_ITEM_STATUS.DRAFT
  );
  const isPlanned = key === 'masterItem' || key === 'shadowItem';

  useEffect(() => {
    if ((status || status === 0) && isMasterItem) {
      setItemStatus(status || MASTER_ITEM_STATUS.DRAFT);
    }
  }, [status]);

  const handleClick = (event, hasShowSetTimeModal = false) => {
    const { handleIconsMore } = props;
    if (handleIconsMore) {
      let type = 'masterLesson';
      if (
        dataItem.hasOwnProperty('type') &&
        !dataItem.hasOwnProperty('sectionScheduleId')
      ) {
        switch (dataItem?.type) {
          case COURSE_ITEM_TYPE.QUIZ:
            type =
              quizType === QUIZ_TYPE.ANNOUNCED
                ? 'masterAnnouncedQuiz'
                : 'masterPopQuiz';
            break;
          case COURSE_ITEM_TYPE.ASSIGNMENT:
            type = 'masterAssignment';
            break;
          default:
            break;
        }
      } else if (dataItem.hasOwnProperty('sectionScheduleId')) {
        switch (dataItem?.type) {
          case COURSE_ITEM_TYPE.QUIZ:
            type =
              quizType === QUIZ_TYPE.ANNOUNCED
                ? 'shadowAnnouncedQuiz'
                : 'shadowPopQuiz';
            break;
          case COURSE_ITEM_TYPE.ASSIGNMENT:
            type = 'shadowAssignment';
            break;
          default:
            type = 'shadowLesson';
            break;
        }
      }
      handleIconsMore(
        event,
        dataItem,
        type,
        hasShowSetTimeModal,
        props.dataItem.id
      );
    }
  };

  const handleChangeMasterStatus = (value) => {
    const { handleChangeMasterStatus } = props;
    const courseDayData = props.id.split('-')[1];
    const courseDayId = courseDayData.split('_')[0];
    const payload = {
      type: type || COURSE_ITEM_TYPE.LESSON,
      unitId: dataItem?.unitId,
      status: value,
      masterId: dataItem?.id,
      courseDayId,
    };
    handleChangeMasterStatus(payload);
  };

  const renderActivityIcon = React.useMemo(() => {
    const className = `${classes.iconCourseItem} ${
      dataItem?.planned ? classes.disabled : ''
    }`;
    if (type === COURSE_ITEM_TYPE.ASSIGNMENT) {
      setMasterKey('masterAssignmentId');
      // return <BallotRoundedIcon className={className} />;
      return (
        <TblActivityIcon
          type={COURSE_ITEM_TYPE.ASSIGNMENT}
          className={className}
        />
      );
    } else if (type === COURSE_ITEM_TYPE.QUIZ) {
      setMasterKey('masterQuizId');
      if (quizType === QUIZ_TYPE.ANNOUNCED) {
        // return <PlaylistAddCheckRoundedIcon className={className} />;
        return (
          <TblActivityIcon type={COURSE_ITEM_TYPE.QUIZ} className={className} />
        );
      }
      // return <PollRoundedIcon className={className} />;
      return (
        <TblActivityIcon type={COURSE_ITEM_TYPE.QUIZ} className={className} />
      );
    }
    setMasterKey('masterLessonId');
    // return <ImportContactsIcon className={className} />;
    return (
      <TblActivityIcon type={COURSE_ITEM_TYPE.LESSON} className={className} />
    );
  }, [dataItem]);

  const renderStatusIcon = () => {
    const { name, color } = PLANNING_STATUS[type || 0][status] || {};
    return (
      <div
        className={`${classes.flex} ${classes.alignSelfCenter} ${classes.flexGrow1} ${classes.alignItemsCenter}`}
      >
        <FiberManualRecordIcon
          style={{ color: theme.mainColors.planningStatus[`${color}`] }}
          className={classes.iconStatus}
        />{' '}
        {t(`status:${name}`)}
      </div>
    );
  };

  const renderStatusSelect = React.useMemo(
    () => (
      <div
        className={
          itemStatus === MASTER_ITEM_STATUS.DRAFT
            ? classes.draftStyle
            : classes.publishedStyle
        }
      >
        <TblSelect
          hasBoxShadow={false}
          value={itemStatus}
          onChange={(e) => handleChangeMasterStatus(e.target.value)}
          disabled={!hasPermission}
        >
          <MenuItem value={MASTER_ITEM_STATUS.DRAFT}>
            {t('common:draft')}
          </MenuItem>
          <MenuItem value={MASTER_ITEM_STATUS.PUBLISHED}>
            {t('common:published')}
          </MenuItem>
        </TblSelect>
      </div>
    ),
    [itemStatus]
  );

  const renderSetTimeUI = React.useMemo(() => {
    let text =
      dataItem.type === COURSE_ITEM_TYPE.ASSIGNMENT
        ? t('set_due_time')
        : t('set_announced_time');
    const isShadow = !isNil(dataItem?.sectionScheduleId);
    const isActive =
      dataItem.type === COURSE_ITEM_TYPE.ASSIGNMENT
        ? !isNil(dataItem?.dueName) || !isNil(dataItem?.dueDate?.courseDayName)
        : !isNil(dataItem?.announceDate?.courseDayName) ||
          !isNil(dataItem?.announceName);
    if (isActive) {
      text =
        dataItem.type === COURSE_ITEM_TYPE.ASSIGNMENT
          ? t('due_on_with_day', {
              day: dataItem?.dueName ?? dataItem?.dueDate?.courseDayName,
            })
          : t('announced_on_with_day', {
              day:
                dataItem?.announceName ?? dataItem?.announceDate?.courseDayName,
            });
    }
    if ((isShadow && !isActive) || (!hasPermission && !isShadow)) {
      return null;
    }
    return (
      <div className={classes.paddingLeft2}>
        <div
          onClick={(e) => {
            !isShadow && handleClick(e, isShowSetTime);
          }}
        >
          <Typography
            component='a'
            className={`time-active
              ${
                isActive && isShadow
                  ? classes.setTimeActive
                  : classes.setTimeNotActive
              }
              ${!isShadow && isActive ? classes.activeMaster : ''}
            `}
          >
            {text}
          </Typography>
        </div>
      </div>
    );
  }, [dataItem]);

  const onClickName = useCallback(() => {
    const { viewShadowDetail, viewMasterDetail } = props;
    if (key === 'shadowItem' && viewShadowDetail) {
      let type = 'masterLesson';
      if (
        dataItem.hasOwnProperty('type') &&
        !dataItem.hasOwnProperty('sectionScheduleId')
      ) {
        switch (dataItem?.type) {
          case COURSE_ITEM_TYPE.QUIZ:
            type = 'masterQuiz';
            break;
          case COURSE_ITEM_TYPE.ASSIGNMENT:
            type = 'masterAssignment';
            break;
          default:
            break;
        }
      } else if (dataItem.hasOwnProperty('sectionScheduleId')) {
        switch (dataItem?.type) {
          case COURSE_ITEM_TYPE.QUIZ:
            type = 'shadowQuiz';
            break;
          case COURSE_ITEM_TYPE.ASSIGNMENT:
            type = 'shadowAssignment';
            break;
          default:
            type = 'shadowLesson';
            break;
        }
      }
      viewShadowDetail(dataItem, type);
    }
    if (key === 'masterItem' && viewMasterDetail) {
      let type = 'masterLesson';
      if (
        dataItem.hasOwnProperty('type') &&
        !dataItem.hasOwnProperty('sectionScheduleId')
      ) {
        switch (dataItem?.type) {
          case COURSE_ITEM_TYPE.QUIZ:
            type =
              quizType === QUIZ_TYPE.ANNOUNCED
                ? 'masterAnnouncedQuiz'
                : 'masterPopQuiz';
            break;
          case COURSE_ITEM_TYPE.ASSIGNMENT:
            type = 'masterAssignment';
            break;
          default:
            break;
        }
      }
      viewMasterDetail({ master: dataItem, dragId: props.dataItem?.id }, type);
    }
  }, []);

  const handleRelinkShadowItem = useCallback(() => {
    let type = 'lessons';
    switch (dataItem?.type) {
      case COURSE_ITEM_TYPE.QUIZ:
        type = 'quizzes';
        break;
      case COURSE_ITEM_TYPE.ASSIGNMENT:
        type = 'assignments';
        break;
      default:
        break;
    }
    props.handleRelinkShadowItem(type, dataItem);
  }, []);

  const toolTipTitle = () => {
    switch (dataItem?.type) {
      case COURSE_ITEM_TYPE.QUIZ:
        if (
          ![QUIZ_STATUS.DRAFT, QUIZ_STATUS.PUBLIC].includes(dataItem?.status)
        ) {
          return t('error:relink_shadow_quiz_status_tooltip');
        }
        const isOverExecuteTime = checkIsInThePast(
          dataItem?.classSessionEndTime
        );
        if (dataItem?.status === QUIZ_STATUS.PUBLIC && isOverExecuteTime) {
          return t('error:relink_shadow_item_in_the_past_tooltip');
        }
        break;
      case COURSE_ITEM_TYPE.ASSIGNMENT:
        if (
          ![
            ASSIGNMENT_STATUS.DRAFT,
            ASSIGNMENT_STATUS.READY_TO_ASSIGN,
          ].includes(dataItem?.status)
        ) {
          return t('error:relink_shadow_assignment_status_tooltip');
        }
        const isOverDueTime = checkIsInThePast(dataItem?.finalDueTime);
        if (
          dataItem?.status === ASSIGNMENT_STATUS.READY_TO_ASSIGN &&
          isOverDueTime
        ) {
          return t('error:relink_shadow_item_in_the_past_tooltip');
        }
        break;
      default:
        break;
    }
    return '';
  };

  const renderIconUnPlugged = React.useMemo(() => {
    switch (dataItem?.type) {
      case COURSE_ITEM_TYPE.QUIZ:
      case COURSE_ITEM_TYPE.ASSIGNMENT:
        if (toolTipTitle() !== '') {
          return (
            <Tooltip placement='top' title={toolTipTitle()}>
              {/* <span className={`icon-icn_unplugged ${classes.iconCourseItem}`} /> */}
              <SvgIcon
                component={IconUnplugged}
                className={`icon-icn_unplugged link-icon ${classes.iconCourseItem}`}
              />
            </Tooltip>
          );
        }
        // return <span className={`icon-icn_unplugged ${classes.iconLink}`} onClick={handleRelinkShadowItem} />;
        return (
          <SvgIcon
            component={IconUnplugged}
            className={`icon-icn_unplugged link-icon ${classes.iconLink}`}
            onClick={handleRelinkShadowItem}
          />
        );
      default:
        break;
    }
    return (
      <SvgIcon
        component={IconUnplugged}
        className={`icon-icn_unplugged link-icon ${classes.iconLink}`}
        onClick={handleRelinkShadowItem}
      />
    );
    // return <span className={`icon-icn_unplugged ${classes.iconLink}`} onClick={handleRelinkShadowItem} />;
  }, [dataItem]);

  return (
    <div className={clsx(classes.root, { [classes.highlight]: isHighlight })}>
      {!!dataItem.render ? (
        dataItem.render()
      ) : (
        <>
          <div
            className={clsx(classes.flex, {
              [classes.header]: isMasterItem || isShadowItem,
              [classes.masterHeader]: isMasterItem,
              [classes.headerRowPlanned]: isPlanned,
            })}
          >
            <div className={`${classes.flex} ${classes.alignSelfCenter}`}>
              <DragIndicatorRoundedIcon className={classes.iconDrag} />
            </div>
            <div
              className={`${classes.flex} ${classes.alignSelfCenter} ${classes.marginRightHalf}`}
            >
              {renderActivityIcon}
            </div>
            <div
              className={`${classes.alignSelfCenter} ${classes.flex} ${classes.availableList}`}
            >
              {key === 'availableList' && (
                // <TblTooltip title={dataItem.name} placement='top-start' arrow >
                <Typography
                  variant='bodyMedium'
                  component='span'
                  color='textPrimary'
                  width='168px'
                  className={clsx('text-ellipsis-3row', {
                    [classes.disabled]: dataItem.planned,
                  })}
                >
                  {dataItem.name}
                </Typography>
                // </TblTooltip>
              )}
              {key === 'shadowItem' && renderStatusIcon()}
              {isMasterItem && renderStatusSelect}
            </div>
            {key === 'shadowItem' && (
              <div
                className={`${classes.flex} ${classes.alignSelfCenter} ${
                  classes.justifyContentFlexEnd
                } ${classes.flexGrow1} ${
                  props.isClone ? classes.paddingRight2 : ''
                }`}
              >
                {linked ? (
                  <div className={`${classes.linkAction} link-plugged`}>
                    {t('linked')}
                    <SvgIcon
                      component={IconPlugged}
                      className={`icon-icn_plugged link-icon ${classes.iconCourseItem}`}
                    />
                    {/* <span className={`icon-icn_plugged ${classes.iconCourseItem}`}></span> */}
                  </div>
                ) : (
                  <div className={`${classes.linkAction} link-unplugged`}>
                    {t('unlinked')}
                    {renderIconUnPlugged}
                  </div>
                )}
              </div>
            )}
            <div
              className={`${classes.flex} ${classes.alignSelfCenter} ${classes.justifyContentFlexEnd} ${classes.flexGrow1}`}
            >
              {!props.isClone && (
                <TblIconButton
                  aria-label='more'
                  aria-controls='long-menu'
                  aria-haspopup='true'
                  onClick={handleClick}
                >
                  <MoreVertIcon className={classes.iconMore} />
                </TblIconButton>
              )}
            </div>
          </div>
          <div
            className={clsx(
              'text-ellipsis-2row shadow-name',
              { [classes.planned]: key === 'availableList' },
              { [classes.disabled]: dataItem.planned }
            )}
            onClick={onClickName}
          >
            {isPlanned ? dataItem.name : dataItem.planned ? t('planned') : ''}
          </div>
          {isShowSetTime && renderSetTimeUI}
        </>
      )}
    </div>
  );
}, areEqual);

ActivityItem.propTypes = {
  dataItem: PropTypes.object,
  handleIconsMore: PropTypes.func,
  viewShadowDetail: PropTypes.func,
  isClone: PropTypes.bool,
  hasPermission: PropTypes.bool,
  viewMasterDetail: PropTypes.func,
  id: PropTypes.number,
  handleRelinkShadowItem: PropTypes.func,
  handleChangeMasterStatus: PropTypes.func,
};

ActivityItem.defaultProps = {
  dataItem: {},
};

export default ActivityItem;
