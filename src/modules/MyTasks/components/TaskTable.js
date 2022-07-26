/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLocation } from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';

import isString from 'lodash/isString';

import {
  Box,
  Collapse,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

// import EmptyContent from 'components/EmptyContent';
import TblIconButton from 'components/TblIconButton';
import EmptyContentForStudent from 'shared/MyCourses/components/EmptyContentForStudent';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import TaskTags from './TaskTags';

const styled = makeStyles(
  ({ newColors, mainColors, spacing, fontWeight, fontSize, fontSizeIcon }) => ({
    taskHeader: {
      margin: '0',
      padding: `${spacing(1)} 0`,
      '&.table-header': {
        borderRadius: spacing(0.5),
        border: `solid 1px ${mainColors.gray[4]}`,
        backgroundColor: newColors.gray[100],
      },
      '& .MuiGrid-item': {
        padding: `0 ${spacing(1)}`,
      },
      '& .MuiTypography-bodyMedium': {
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        '& span[class^="icon-"]': {
          fontSize: fontSizeIcon.medium,
          '&.icon-icn_sort_arrow_off': {
            color: mainColors.gray[6],
          },
        },
      },
    },
    wrapperTaskItem: {
      position: 'relative',
      background: 'white',
      '& .MuiGrid-item': {
        padding: spacing(1),
        '& a': {
          fontWeight: fontWeight.semi,
          '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
          },
        },
        '& span[class^="icon-"]': {
          fontSize: fontSizeIcon.medium,
        },
        '& span.no-icon': {
          width: spacing(3),
          height: spacing(3),
        },
        '& .font-weight-semi': {
          fontWeight: fontWeight.semi,
        },
      },
      '&.row-hover:hover': {
        backgroundColor: newColors.gray[50],
        cursor: 'pointer',
      },
      '&.task-activated': {
        border: `solid 1px ${mainColors.green[0]}`,
        borderBottomLeftRadius: '5px',
        borderTopLeftRadius: '5px',
        backgroundColor: 'rgba(47, 184, 0, 0.07) !important',
      },
      '&.task-urgent': {
        borderLeft: `solid 6px ${mainColors.red[0]}`,
        '& .tbl-icon-importance': {
          color: mainColors.red[0],
        },
      },
      '&.task-pressing': {
        borderLeft: `solid 6px ${mainColors.orange[2]}`,
        '& .tbl-icon-importance': {
          color: mainColors.orange[2],
        },
      },
      '&.task-upcoming': {
        borderLeft: `solid 6px ${mainColors.primary1[0]}`,
      },
      '& .tbl-icon-importance': {
        color: mainColors.primary1[0],
      },
    },
    taskName: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      '& span[class^="icon-"]': {
        marginRight: spacing(1),
      },
    },
    columnText: {
      display: 'flex',
      alignItems: 'center',
    },
    columnIcon: {
      display: 'flex',
      alignItems: 'center',
      '& span.icon-icn_arrow_left': {
        fontSize: '24px',
        transition: 'transform 0.2s',
        transform: 'rotate(0deg)',
        '&.expanded': {
          transform: 'rotate(-90deg) !important',
        },
      },
    },
    skeletonContainer: {
      margin: `${spacing(1)} 0`,
      '& .MuiGrid-item': {
        padding: `0 ${spacing(1)}`,
      },
    },
    skeletonCell: {
      borderRadius: spacing(0.5),
    },
    tableEmpty: {
      margin: `${spacing(10)} 0`,
    },
    tableCollapseEmpty: {
      margin: `${spacing(2)} 0`,
    },
    scrollbarTableBody: {
      width: '100%',
      maxHeight: 'calc(100vh - 220px)',
    },
    tableBodyWrapper: {
      height: 'calc(100vh - 205px)',
    },
    wrapperRowCollapse: {
      background: 'white',
      borderRadius: spacing(0.5),
      margin: `${spacing(1)} 0`,
    },
    collapse: {
      width: '100%',
      '& .MuiCollapse-wrapper': {
        padding: spacing(1),
      },
    },
    pagination: {
      position: 'fixed',
      bottom: 0,
      right: 0,
      left: 0,
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: '50px',
      '& > div': {
        margin: '0 16px',
      },
      '& .row-page': {
        display: 'flex',
        alignItems: 'center',
        '& .per-page': {
          marginRight: '16px',
        },
        '& .MuiInputBase-root': {
          '&:before': {
            display: 'none',
          },
          '&:after': {
            display: 'none',
          },
          '& .MuiSelect-select': {
            minHeight: 0,
            '&:focus': {
              background: 'none',
            },
          },
        },
      },
      '& .info-page': {},
      '& .event-page': {
        width: spacing(10),
        display: 'flex',
        justifyContent: 'space-between',
        '& .MuiButtonBase-root': {
          cursor: 'pointer',
        },
      },
    },
    tableAccordion: {
      width: '100%',
    },
    scrollbarCollapse: {
      width: '100%',
      maxHeight: '300px',
    },
    headerTableAccordion: {
      textTransform: 'uppercase',
      fontWeight: fontWeight.semi,
      fontSize: fontSize.small,
      borderBottom: `1px solid ${mainColors.gray[4]}`,
      '& .MuiGrid-container': {
        '& > .MuiGrid-root': {
          padding: spacing(1),
        },
      },
    },
    bodyTableCollapse: {
      overflowY: 'auto',
      // marginRight: spacing(1),
      '& > .MuiGrid-container': {
        borderBottom: `1px solid ${mainColors.gray[4]}`,
        fontSize: fontSize.normal,
        '& .MuiGrid-container': {
          '& > .MuiGrid-root': {
            padding: spacing(1),
            minHeight: '58px',
            display: 'flex',
            alignItems: 'center',
            '& span.icon-icn_more': {
              cursor: 'pointer',
            },
            '& .text-disabled': {
              color: mainColors.gray[6],
            },
          },
        },
      },
    },
    footerTableCollapse: {
      padding: spacing(1),
      '& .footer-column': {
        display: 'flex',
        alignItems: 'center',
        fontSize: fontSize.normal,
        width: 'fit-content',
        cursor: 'pointer',
        '& span': {
          color: mainColors.primary2[0],
          '&.icon-icn_plus': {
            borderRadius: '50%',
            padding: spacing(1),
            border: `1px solid ${mainColors.primary2[0]}`,
            marginRight: spacing(1),
          },
        },
      },
    },
  })
);

const TableRow = ({ row, iRow, ...rest }) => {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const { t, rowSettings, tableFormat, style, rowCollapseSettings } = rest;
  const {
    background = 'white',
    margin = '8px 0',
    border = '',
    borderRadius = '4px',
    hover = true,
  } = rowSettings;
  const taskActivated =
    rowSettings.taskJustScheduled === row.id ||
    urlSearchParams.get('taskJustScheduledId') === row.id.toString();

  const [expanded, setExpanded] = useState(taskActivated);
  const onExpandedCollapse = () => {
    setExpanded(!expanded);
    rowCollapseSettings?.onExpand && rowCollapseSettings.onExpand(row);
  };

  const Columns = tableFormat.map(
    ({ xsCol, mdCol, lgCol, xlCol, columnStyle, bodyColumnFormat }, iCol) => (
      <Grid
        item
        key={iCol}
        xs={xsCol}
        md={mdCol}
        lg={lgCol}
        xl={xlCol}
        className={style[columnStyle]}
      >
        {bodyColumnFormat(row, expanded)}
      </Grid>
    )
  );

  const Tags = useMemo(
    () =>
      rowSettings?.tags?.visible &&
      row?.opportunityType?.length > 0 && (
        <TaskTags opportunities={row.opportunityType} t={t} />
      ),
    [row]
  );

  const subList = useCallback(rowCollapseSettings?.list(row), [row]);
  // console.log('render table row');

  const CollapseContent = useMemo(
    () => (
      <div className={style.tableAccordion}>
        <div className={style.headerTableAccordion}>
          <Grid container item>
            {rowCollapseSettings?.format.map((col, iCol) => (
              <Grid
                item
                key={iCol}
                xs={col.xsCol}
                md={col.mdCol}
                lg={col.lgCol}
                xl={col.xlCol}
              >
                {t(col.headerColumnFormat)}
              </Grid>
            ))}
          </Grid>
          <Box
            width='50px'
            height='100%'
            display='flex'
            alignItems='center'
            justifyContent='center'
          />
        </div>
        <div className={style.bodyTableCollapse}>
          {subList.map((e, i) => (
            <Grid container item key={i}>
              <Grid container item>
                {rowCollapseSettings?.format.map((col, iCol) => (
                  <Grid
                    item
                    key={iCol}
                    xs={col.xsCol}
                    md={col.mdCol}
                    lg={col.lgCol}
                    xl={col.xlCol}
                  >
                    {col.bodyColumnFormat(e, row)}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
          {rowCollapseSettings?.footerColumnFormat && (
            <div className={style.footerTableCollapse}>
              {rowCollapseSettings.footerColumnFormat(row)}
            </div>
          )}
        </div>
      </div>
    ),
    [row]
  );

  if (rowCollapseSettings?.visibleCollapse) {
    return (
      <Grid container className={style.wrapperRowCollapse}>
        {subList.length > 0 ? (
          <>
            <Grid
              key={iRow}
              container
              item
              style={{
                ...row?.style,
                margin: 0,
                background,
                border,
                borderRadius,
                height: 'auto',
              }}
              className={clsx(
                style.wrapperTaskItem,
                hover && 'row-hover',
                rowSettings?.format && rowSettings.format(row),
                taskActivated && 'task-activated'
              )}
              onClick={() => {
                rowSettings?.onClickRow && rowSettings.onClickRow(row);
                onExpandedCollapse();
              }}
            >
              {Columns}
              {Tags}
            </Grid>
            <Collapse className={style.collapse} in={expanded}>
              {CollapseContent}
            </Collapse>
          </>
        ) : (
          <Grid
            key={iRow}
            container
            item
            style={{
              ...row?.style,
              margin: 0,
              background,
              border,
              borderRadius,
              height: 'auto',
            }}
            className={clsx(
              style.wrapperTaskItem,
              hover && 'row-hover',
              rowSettings?.format && rowSettings.format(row)
            )}
            onClick={() => {
              rowSettings?.onClickRow && rowSettings.onClickRow(row);
            }}
          >
            {Columns}
            {Tags}
          </Grid>
        )}
      </Grid>
    );
  }
  return (
    <Grid
      key={iRow}
      container
      item
      style={{
        ...row?.style,
        margin,
        background,
        border,
        borderRadius,
        height: 'auto',
      }}
      className={clsx(
        style.wrapperTaskItem,
        hover && 'row-hover',
        rowSettings?.format && rowSettings.format(row)
      )}
      onClick={() => rowSettings?.onClickRow && rowSettings.onClickRow(row)}
    >
      {Columns}
      {Tags}
    </Grid>
  );
};

TableRow.propTypes = {
  row: PropTypes.object,
  iRow: PropTypes.number,
  t: PropTypes.func,
  rowSettings: PropTypes.object,
  onClickRow: PropTypes.func,
  rowFormat: PropTypes.func,
  tableFormat: PropTypes.array,
  style: PropTypes.object,
};

function TaskTable(props) {
  const {
    tableHeader = true,
    tableFormat = [],
    taskList = [],
    isLoading = false,
    contextMenu = null,
    t = () => {},
    skeletons,
    skeletonHeight,
    sortInfo,
    pagination = {},
    virtual,
  } = props;

  const {
    visible: visiblePaging = false,
    limits = [25, 50, 100],
    defaultPaging,
    total = 0,
    onPaging,
  } = pagination;

  const style = styled();

  const [{ fieldSort, typeSort }, setSort] = useState({
    fieldSort: sortInfo?.defaultSort?.fieldSort,
    typeSort: sortInfo?.defaultSort?.typeSort === 'asc',
  });
  const [currentPage, setCurrentPage] = useState(defaultPaging?.page || 1);
  const [currentLimit, setCurrentLimit] = useState(
    defaultPaging?.limit || limits[1]
  );

  const onSort = (field, type) => {
    if (sortInfo.onSort) {
      setSort({ fieldSort: field, typeSort: type });
      sortInfo.onSort(field, type ? 'asc' : 'desc');
    }
  };

  const renderSkeleton = useMemo(
    () =>
      [...Array(skeletons || Math.floor(Math.random() * 5 + 1))].map(
        (e, index) => (
          <Grid key={index} container className={clsx(style.skeletonContainer)}>
            {tableFormat.map((col, iCol) => (
              <Grid
                item
                key={iCol}
                xs={col.xsCol}
                md={col.mdCol}
                lg={col.lgCol}
                xl={col.xlCol}
              >
                <Skeleton
                  variant='rectangular'
                  height={skeletonHeight || 100}
                  className={style.skeletonCell}
                />
              </Grid>
            ))}
          </Grid>
        )
      ),
    [skeletons]
  );

  const renderHeaderTitle = (sortable, headerColumnFormat, field) => {
    switch (true) {
      case isString(headerColumnFormat):
        if (sortInfo && sortable) {
          return (
            <Typography
              component='p'
              variant='bodyMedium'
              onClick={() => onSort(field, !typeSort)}
              style={{ cursor: 'pointer' }}
            >
              {t(headerColumnFormat)}{' '}
              {field === fieldSort ? (
                renderSortIcon
              ) : (
                <span className='icon-icn_sort_arrow_off' />
              )}
            </Typography>
          );
        }
        return (
          <Typography component='p' variant='bodyMedium'>
            {t(headerColumnFormat)}
          </Typography>
        );
      // ... other type
      default:
        return headerColumnFormat;
    }
  };

  const renderSortIcon = useMemo(
    () => (
      <span className={`icon-icn_sort_arrow_${typeSort ? 'up' : 'down'}`} />
    ),
    [typeSort]
  );

  const CustomScrollbar = React.forwardRef((props, ref) => (
    <PerfectScrollbar
      {...props}
      className={style.scrollbarTableBody}
      containerRef={ref}
    />
  ));

  const renderBody = () => {
    if (virtual) {
      const TableRowVirtualized = (item) =>
        useMemo(() => {
          const iRow = item.index;
          const row = item.data[item.index];
          row.style = item.style;
          return <TableRow row={row} iRow={iRow} style={style} {...props} />;
        }, [taskList]);
      return (
        <div className={style.tableBodyWrapper}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                itemKey={(key) => `task-${key}`}
                itemData={taskList}
                itemCount={taskList.length}
                itemSize={(ind) =>
                  taskList[ind]?.opportunityType?.length > 0 &&
                  !taskList[ind]?.opportunityType.includes(0)
                    ? 134
                    : 100
                }
                layout='vertical'
                outerElementType={CustomScrollbar}
              >
                {TableRowVirtualized}
              </List>
            )}
          </AutoSizer>
        </div>
      );
    }
    if (taskList.length) {
      return (
        <PerfectScrollbar className={style.scrollbarTableBody}>
          {taskList.map((row, iRow) => (
            <TableRow
              row={row}
              iRow={iRow}
              key={iRow}
              style={style}
              {...props}
            />
          ))}
        </PerfectScrollbar>
      );
    }
    return <EmptyContentForStudent scrollable />;
  };

  const renderPagination = useMemo(() => {
    const from = taskList.length && (currentPage - 1) * currentLimit + 1;
    const to = (currentPage - 1) * currentLimit + taskList.length;
    const maxTo = to >= total ? total : to;

    const onChangeRange = (e) => {
      setCurrentLimit(e.target.value);
      setCurrentPage(1);
      onPaging(1, e.target.value);
    };

    const onNext = () => {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      onPaging(nextPage, currentLimit);
    };

    const onPrevious = () => {
      const previousPage = currentPage - 1;
      currentPage > 1 && setCurrentPage(previousPage);
      onPaging(previousPage, currentLimit);
    };

    return (
      <div className={style.pagination}>
        {isLoading ? (
          <React.Fragment>
            <div className='row-page'>
              <span className='per-page'>
                {t('myTasks:pagination-row_per_pages')}:
              </span>
              <Skeleton height={25} width={60} />
            </div>
            <div className='info-page'>
              <Skeleton height={25} width={60} />
            </div>
            <div className='event-page'>
              <Skeleton height={25} width={60} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className='row-page'>
              <span className='per-page'>
                {t('myTasks:pagination-row_per_pages')}:
              </span>
              <Select defaultValue={currentLimit} onChange={onChangeRange}>
                {limits.map((e, i) => (
                  <MenuItem key={i} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className='info-page'>
              <span>
                {from}-{maxTo} of {total}
              </span>
            </div>
            <div className='event-page'>
              <TblIconButton
                onClick={onPrevious}
                disabled={!taskList.length || currentPage === 1}
              >
                <span className='icon-icn_arrow_left' />
              </TblIconButton>
              <TblIconButton
                onClick={onNext}
                disabled={
                  !taskList.length || currentPage * currentLimit >= total
                }
              >
                <span className='icon-icn_arrow_right' />
              </TblIconButton>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }, [pagination]);

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

  return (
    <React.Fragment>
      {contextMenu && renderContextMenu()}
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
        className={clsx(style.taskHeader, tableHeader && 'table-header')}
      >
        {taskList.length ? (
          tableFormat.map(
            (
              {
                headerColumnFormat,
                xsCol,
                mdCol,
                lgCol,
                xlCol,
                columnStyle,
                fieldSort,
                sortable,
              },
              index
            ) => (
              <Grid
                key={index}
                item
                xs={xsCol}
                md={mdCol}
                lg={lgCol}
                xl={xlCol}
                className={style[columnStyle]}
              >
                {renderHeaderTitle(sortable, headerColumnFormat, fieldSort)}
              </Grid>
            )
          )
        ) : (
          <></>
        )}
      </Grid>
      {isLoading ? renderSkeleton : renderBody()}
      {visiblePaging && renderPagination}
    </React.Fragment>
  );
}

TaskTable.propTypes = {
  tableHeader: PropTypes.bool,
  rowSettings: PropTypes.object,
  onClickRow: PropTypes.func,
  rowFormat: PropTypes.func,
  tableFormat: PropTypes.array,
  rowCollapseSettings: PropTypes.object,
  headerTitle: PropTypes.string,
  taskList: PropTypes.array,
  t: PropTypes.func,
  isLoading: PropTypes.bool,
  dialog: PropTypes.object,
  contextMenu: PropTypes.object,
  skeletons: PropTypes.number,
  skeletonHeight: PropTypes.number,
  sortInfo: PropTypes.object,
  pagination: PropTypes.object,
  virtual: PropTypes.bool,
};

export default withTranslation(['myTasks', 'common'])(TaskTable);
