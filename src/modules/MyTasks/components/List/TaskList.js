import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import isEmpty from 'lodash/isEmpty';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblActivityIcon from 'components/TblActivityIcon';
import TblButton from 'components/TblButton';
import TblIconButton from 'components/TblIconButton';
import EmptyContentForStudent from 'shared/MyCourses/components/EmptyContentForStudent';

import { TIME_BLOCK_STT } from 'shared/MyTasks/constants';

import clsx from 'clsx';
import { TASK_IMPORTANCE_LEVEL_COLOR } from 'modules/MyTasks/constants';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  completedByType,
  infoByType,
  taskTimeBlockStatus,
} from '../../constants';

import Pagination from './Pagination';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    fontSize: theme.fontSize.normal,
    '& .MuiTableContainer-root': {
      background: 'white',
      border: `1px solid ${theme.newColors.gray[200]}`,
      borderRadius: 8,
      marginTop: theme.spacing(0.5),
      '&:hover': {
        background: 'white',
      },
    },
    '& .MuiTableCell-root': {
      fontSize: theme.fontSize.normal,
    },
    '& .MuiTableCell-head': {
      fontWeight: theme.fontWeight.semi,
      color: theme.newColors.gray[800],
    },
    '& .MuiTableCell-body,& .icon-icn_more ': {
      color: theme.newColors.gray[900],
    },

    '& .MuiTableBody-root .MuiTableRow-root:last-child': {
      '& .MuiTableCell-root': {
        borderBottom: 0,
      },
    },
    '& .task-label': {
      backgroundColor: theme.customColors.primary1.light[3],
      color: theme.customColors.primary1.main,
      borderRadius: 8,
      padding: theme.spacing(0.25, 0.5),
      '& .MuiSvgIcon-root': {
        fontSize: theme.fontSizeIcon.small,
        marginRight: theme.spacing(0.5),
      },
    },
    '& .MuiList-padding': {
      padding: 0,
    },
    '& .important-icon': {
      '& .MuiSvgIcon-root': {
        fontSize: theme.fontSize.medium,
      },
    },
    '& .important-icon-title': {
      textTransform: 'uppercase',
    },
  },
  rowDisabled: {
    '& .MuiTableCell-body': {
      color: theme.newColors.gray[600],
    },
  },
  scrollbarContent: {
    width: '100%',
    maxHeight: 'calc(100vh - 150px)',
  },
  scrollbarHasPaging: {
    width: '100%',
    height: 'calc(100vh - 180px)',
  },
  listSubheader: {
    fontWeight: theme.fontWeight.semi,
    color: theme.newColors.gray[900],
    backgroundColor: theme.newColors.gray[500],
  },
  taskContent: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'white',
    marginTop: theme.spacing(2),
    padding: 0,
    '&:focus, &:hover': {
      backgroundColor: 'white !important',
    },
  },
  taskBorder: {
    minHeight: '100%',
    width: '4px',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginTop: theme.spacing(2),
  },
  showFullBorderRadius: {
    borderRadius: 8,
  },
  taskTitle: {
    padding: theme.spacing(2, 2, 2, 2),
    borderBottom: `1px solid ${theme.newColors.gray[100]}`,
  },
  courseName: {
    color: theme.newColors.gray[600],
  },
  taskInfo: {
    padding: theme.spacing(2, 2, 2, 2),
  },
  subTaskContent: {
    '& .MuiListItem-root': {
      padding: 0,
    },
  },
  subInfo: {
    color: theme.newColors.gray[600],
  },
  activeCollapse: {
    backgroundColor: ` ${theme.openColors.blue[0]} !important`,
    '&:hover': {
      backgroundColor: ` ${theme.openColors.blue[0]} !important`,
    },
  },
}));
TaskList.propTypes = {
  t: PropTypes.func,
  data: PropTypes.array,
  getButtons: PropTypes.func,
  getTaskLabel: PropTypes.func,
  getTags: PropTypes.func,

  footerColumnFormat: PropTypes.func,
  contextMenu: PropTypes.object,
  setAnchorEl: PropTypes.func,

  onStart: PropTypes.func,
  selectedRow: PropTypes.func,
  activeCollapId: PropTypes.number,
  subTitleEmptyContent: PropTypes.string,

  showBorder: PropTypes.bool,
  isLoading: PropTypes.bool,
  pagination: PropTypes.object,
  isStudentRole: PropTypes.bool,
};
const formatTime = 'h:mm A';
const formatFullTime = `ddd · DD MMMM · ${formatTime}`;
const formatDateTime = `DD MMMM · ${formatTime}`;
const formatSortDateTime = `MMM DD · ${formatTime}`;

export default function TaskList({
  t,
  data,
  getButtons,
  getTaskLabel,
  getTags,

  footerColumnFormat,
  contextMenu,
  setAnchorEl,

  onStart,
  selectedRow,
  activeCollapId,
  subTitleEmptyContent,

  showBorder = true,
  isLoading,
  pagination,
  isStudentRole,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [collapseIds, setCollapseIds] = React.useState([activeCollapId]);
  const handleClick = (id) => {
    const index = collapseIds.indexOf(id);
    const newCollapId = [...collapseIds];
    if (index > -1) {
      newCollapId.splice(index, 1);
    } else {
      newCollapId.push(id);
    }
    setCollapseIds(newCollapId);
  };
  const convertTimeBlocks = (row) => {
    const convertedTimeBlocks = [];
    let countUpcoming = 0;
    for (let i = 0; i < row?.timeBlocks.length; i++) {
      const timeBlock = row?.timeBlocks[i];
      if (timeBlock.status === TIME_BLOCK_STT.UPCOMING) {
        if (countUpcoming === 0) {
          timeBlock.isFirstUpcoming = true;
        }
        countUpcoming++;
        timeBlock.indUpcoming = countUpcoming;
      } else if (
        timeBlock.status === TIME_BLOCK_STT.ENDED ||
        timeBlock.status === TIME_BLOCK_STT.SKIPPED
      ) {
        timeBlock.disabled = true;
      }
      convertedTimeBlocks.push(timeBlock);
    }
    return convertedTimeBlocks;
  };
  function TaskContent(task, showExpandIcon) {
    const { typeLabel } = infoByType(task?.type) || {};
    const buttons = (getButtons && getButtons(task)) || [];
    const tags = (getTags && getTags(task)) || [];
    const formatTimeblock = convertTimeBlocks(task);
    const firstTaskUpcoming = formatTimeblock.find((i) => i.isFirstUpcoming);
    const completedBy = completedByType(task.opportunityType, task.type);
    const canStartTask = !isEmpty(firstTaskUpcoming) && isStudentRole;
    return (
      <Grid container>
        <Grid
          container
          sm={12}
          direction='row'
          justifyContent='center'
          alignItems='center'
          className={classes.taskTitle}
        >
          <Grid item sm={7}>
            <Box display='flex' flexDirection='column'>
              <Box display='flex' alignItems='center'>
                <Box>
                  <TblActivityIcon
                    type={task?.type}
                    name={typeLabel}
                    color={theme.newColors.gray[700]}
                    iconColor={theme.newColors.gray[900]}
                    variant='bodySmall'
                  />
                </Box>
                <Box ml={1}>{getTaskLabel(task)}</Box>
              </Box>
              <Box mt={1} width='100%' className='text-ellipsis'>
                <Typography variant='labelLarge' noWrap>
                  {task?.name}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={5}>
            <Box display='flex' justifyContent='flex-end'>
              {canStartTask && (
                <Box ml={0.5} mr={0.5}>
                  <TblButton
                    variant='contained'
                    color='primary'
                    onClick={() => onStart(firstTaskUpcoming, task)}
                  >
                    {t('start_now')}
                  </TblButton>
                </Box>
              )}
              {buttons.map((btn) => (
                <Box ml={0.5} mr={0.5}>
                  {btn}
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid sm={12}>
            <Typography
              variant='bodyMedium'
              className={classes.courseName}
              mt={1}
            >
              {task.courseName}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          sm={12}
          className={clsx(classes.taskInfo, showExpandIcon && 'cursor-pointer')}
          onClick={() => handleClick(task?.id)}
        >
          <Box display='flex' flexGrow={4}>
            <Box flexGrow={1} display='flex'>
              {tags.map((tag) => (
                <Box mr={1}>{tag}</Box>
              ))}
              <Typography
                component='div'
                variant='bodyMedium'
                display='flex'
                alignItems='center'
                className={classes.subInfo}
              >
                {t(completedBy)} ·{' '}
                {moment(task.completedBy).format(formatDateTime)}
              </Typography>
            </Box>
            {!isEmpty(firstTaskUpcoming) ? (
              <Box display='flex' alignItems='center' mr={1}>
                {t('time-block-stt_upcoming')} ·{' '}
                {moment(firstTaskUpcoming.startTime).format(formatSortDateTime)}{' '}
                - {moment(firstTaskUpcoming.endTime).format(formatTime)}
              </Box>
            ) : (
              setAnchorEl && (
                <Typography
                  component='div'
                  variant='bodyMedium'
                  display='flex'
                  alignItems='center'
                  className={classes.subInfo}
                >
                  {t('no_upcoming')}
                </Typography>
              )
            )}
            {showExpandIcon && (
              <Box display='flex' justifyContent='center' alignItems='center'>
                {collapseIds.includes(task?.id) ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  }

  function SubTaskContent(task) {
    const timeBlocks = convertTimeBlocks(task);
    return (
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>{t('myTasks:th-start')}</TableCell>
              <TableCell>{t('myTasks:th-end')}</TableCell>
              <TableCell>{t('myTasks:th-scheduled')}</TableCell>
              <TableCell>{t('myTasks:th-time_block_status')}</TableCell>
              {isStudentRole && (
                <React.Fragment>
                  <TableCell />
                  <TableCell />
                </React.Fragment>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeBlocks?.map((row) => (
              <TableRow
                key={row.id}
                className={clsx(row.disabled && classes.rowDisabled)}
              >
                <TableCell>
                  {moment(row.startTime).format(formatFullTime)}
                </TableCell>
                <TableCell>
                  {moment(row.endTime).format(formatFullTime)}
                </TableCell>
                <TableCell>
                  {t('common:min', { count: row?.duration || 0 })}
                </TableCell>
                <TableCell>{t(taskTimeBlockStatus(row?.status))}</TableCell>
                {isStudentRole && (
                  <React.Fragment>
                    <TableCell align='right'>
                      {row?.isFirstUpcoming && (
                        <TblButton
                          variant='contained'
                          color='primary'
                          onClick={() => onStart(row, task)}
                          isShowCircularProgress={row.id === selectedRow}
                        >
                          {t('myTasks:btn-start')}
                        </TblButton>
                      )}
                    </TableCell>

                    {setAnchorEl && (
                      <TableCell>
                        <Box
                          component='div'
                          width='100%'
                          display='flex'
                          justifyContent='flex-end'
                          fontSize='24px'
                        >
                          <TblIconButton
                            onClick={(e) =>
                              setAnchorEl({
                                anchorEl: e.currentTarget,
                                menuRowSelected: task,
                                menuSubRowSelected: row,
                              })
                            }
                          >
                            <span className='icon-icn_more' />
                          </TblIconButton>
                        </Box>
                      </TableCell>
                    )}
                  </React.Fragment>
                )}
              </TableRow>
            ))}
            {footerColumnFormat && isStudentRole && (
              <TableRow>
                <TableCell>{footerColumnFormat(task)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // TODO: Need to review
  const renderContextMenu = () => {
    const menuItems = contextMenu?.menuItems
      ? contextMenu.menuItems(
          contextMenu.menuRowSelected,
          contextMenu.menuSubRowSelected
        )
      : [];
    if (menuItems.length > 0) {
      return (
        <Paper>
          <Menu
            id={contextMenu.id}
            anchorEl={contextMenu.anchorEl}
            keepMounted
            open={contextMenu.isOpen}
            onClose={contextMenu.onClose}
          >
            {menuItems.map((ele, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  contextMenu.onClose();
                  ele.onSelectMenu(
                    contextMenu.menuRowSelected,
                    contextMenu.menuSubRowSelected
                  );
                }}
                disabled={ele.disabled}
              >
                {t(ele.label)}
              </MenuItem>
            ))}
          </Menu>
        </Paper>
      );
    }
    return null;
  };
  if (isLoading) {
    return (
      <React.Fragment>
        <Box mb={2} height={145}>
          <Skeleton variant='rectangular' animation='wave' height={145} />
        </Box>
        <Box mb={2} height={145}>
          <Skeleton variant='rectangular' animation='wave' height={145} />
        </Box>
        <Box mb={2} height={145}>
          <Skeleton variant='rectangular' animation='wave' height={145} />
        </Box>
      </React.Fragment>
    );
  }
  if (!data.length) {
    return <EmptyContentForStudent subTitle={subTitleEmptyContent} />;
  }

  return (
    <PerfectScrollbar
      className={
        pagination?.visible
          ? classes.scrollbarHasPaging
          : classes.scrollbarContent
      }
    >
      {renderContextMenu()}
      <div className={classes.root}>
        {data.map((task) => {
          const showExpandData = task?.timeBlocks?.length > 0;
          const style = TASK_IMPORTANCE_LEVEL_COLOR[task.importanceLevel];
          const isActiveCollapse = task?.id === activeCollapId;
          return (
            <List>
              <Box display='flex' width='100%'>
                {showBorder && (
                  <Box
                    className={clsx(classes.taskBorder)}
                    style={{ background: style.color }}
                  />
                )}
                <Box
                  width='calc(100% - 4px)'
                  className={clsx(classes.taskContent, {
                    [classes.showFullBorderRadius]: !showBorder,
                    [classes.activeCollapse]: isActiveCollapse,
                  })}
                >
                  {TaskContent(task, showExpandData)}
                </Box>
              </Box>
              {showExpandData ? (
                <Collapse
                  in={collapseIds.includes(task?.id)}
                  timeout='auto'
                  unmountOnExit
                >
                  <div
                    component='div'
                    disablePadding
                    className={classes.subTaskContent}
                  >
                    {SubTaskContent(task)}
                  </div>
                </Collapse>
              ) : (
                ''
              )}
            </List>
          );
        })}
      </div>
      <Box>
        <Pagination
          taskList={data}
          t={t}
          isLoading={isLoading}
          pagination={pagination}
        />
      </Box>
    </PerfectScrollbar>
  );
}
