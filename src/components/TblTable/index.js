/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';

import EmptyContent from 'components/EmptyContent';
import TblIconButton from 'components/TblIconButton';
import TblInputLabel from 'components/TblInputLabel';
import TblInputs from 'components/TblInputs';

import useWindowSize from 'utils/windowSize';

import emptySearchImage from 'assets/images/no_result_match.svg';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const StyledTableCell = withStyles((theme) => ({
  head: {
    color: theme.palette.primary.main,
    // textTransform: 'uppercase',
    fontWeight: theme.fontWeight.semi,
    fontSize: theme.fontSize.normal,
    lineHeight: '20px',
    letterSpacing: '0.1px',
    border: '1px solid',
    padding: theme.spacing(1.5, 1),
    borderColor: theme.newColors.gray[200],
    background: theme.newColors.gray[50],
    cursor: 'pointer',
    borderLeft: 'none',

    '&.no-border': {
      borderRight: 'none !important',
      borderBottom: 'none',
      borderLeft: '1px solid',
      visibility: 'hidden', // Keep him here just hide to make sure table width :D
    },
    '&:first-child': {
      borderTopLeftRadius: theme.spacing(1),
      borderLeft: '1px solid',
      borderColor: theme.newColors.gray[200],
    },
    '&:last-child': {
      borderTopRightRadius: theme.spacing(1),
      borderRight: `1px solid ${theme.newColors.gray[200]}`,
    },
    '& .icon-off': {
      color: theme.mainColors.gray[6],
    },
  },
  body: {
    fontSize: theme.fontSize.normal,
    lineHeight: '20px',
    fontWeight: theme.fontWeight.normal,
    color: theme.palette.primary.main,
    border: '1px solid',
    borderColor: theme.newColors.gray[200],
    borderTop: 'none',
    padding: theme.spacing(1.25, 1),

    maxWidth: '100px',
    wordBreak: 'break-word',
    borderLeft: 'none',
    // borderRight: 'none',
    '&.no-border': {
      borderRight: 'none!important',
      borderBottom: 'none',
      // borderLeft: '1px solid'
    },
    '&.view-detail': {
      cursor: 'pointer',
    },
    '&:nth-child(1)': {
      borderLeft: '1px solid',
      borderColor: theme.newColors.gray[200],
    },
    '&:last-child': {
      borderRight: `1px solid ${theme.newColors.gray[200]}`,
      // borderColor: `${theme.newColors.gray[200]} `,
    },

    '& .MuiInputBase-input': {
      color: theme.palette.primary.main,
      fontSize: theme.fontSize.normal,
    },
    '& .MuiInput-underline:before, & .MuiInput-underline:after': {
      display: 'none',
    },
    '& .MuiSelect-icon': {
      color: theme.mainColors.primary1[0],
      right: '10px',
      top: 'calc(50% - 10px)',
      fontSize: theme.fontSizeIcon.normal,
    },
    '& .MuiSvgIcon-root': {
      color: `${theme.newColors.gray[500] }!important`,
      '&:hover': {
        color: `${theme.newColors.gray[700] }!important`,
      },
    },
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    border: '1px solid',
    borderColor: theme.newColors.gray[200],
    '&:last-child': {
      '& .MuiTableCell-root': {
        '&:last-child': {
          borderBottomRightRadius: theme.spacing(1),
        },
        '&:first-child': {
          borderBottomLeftRadius: theme.spacing(1),
        },
      },
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  container: {
    // overflowX: 'unset'
  },
  noSideBorder: {
    padding: theme.spacing(1.7, 1),
    borderLeft: 'none',
    borderRight: 'none',
  },
  table: {
    borderCollapse: 'separate',
    '& .MuiSelect-icon': {
      top: '2px',
    },
  },

  titleWithIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: theme.fontSizeIcon.normal,
    cursor: 'pointer',
  },
  cursor: {
    cursor: 'pointer',
  },
  paper: {
    boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.24)',
  },
  pagination: {
    '& .MuiSelect-icon': {
      top: '2px',
    },
  },
  inputSearch: {
    padding: '0 !important',
    borderRight: `1px solid ${theme.newColors.gray[200]}`,
    '& .TblInput': {
      margin: 0,
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 0,
      },
    },
  },
  errorCell: {
    border: `1px solid ${theme.mainColors.red[0]} !important`,
  },
  disabled: {
    background: theme.newColors.gray[100],
    pointerEvents: 'none',
    '& .MuiFormControl-root': {
      background: theme.newColors.gray[100],
    },
    '& input': {
      fontWeight: 400,
      color: `${theme.newColors.gray[500] }!important`,
      borderStyle: 'none',
      background: theme.newColors.gray[100],
    },

    '& .MuiInputAdornment-root': {
      display: 'none',
    },
  },
  borderCell: {
    border: '1px solid',
    borderColor: theme.newColors.gray[200],
  },
}));

function TblTable(props) {
  const { t } = useTranslation(['common']);
  const { emptyContent, emptySearch } = props;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(props.rowsPerPage);
  const size = useWindowSize();
  // Delta are spacing, height other components
  const height = size.height - props.delta;
  const handleChangeRowsPerPage = (event) => {
    if (props.onChangePage) {
      props.onChangePage(event, page, event.target.value);
    }
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, page) => {
    if (props.onChangePage) {
      props.onChangePage(event, page);
    }
    setPage(page);
  };

  const [anchorEl, setAnchorEl] = useState({});

  const handleClickMore = (recordId, event) => {
    setAnchorEl({ ...anchorEl, [recordId]: event.currentTarget });
  };

  const handleCloseMoreMenu = () => {
    setAnchorEl({});
  };
  const viewDetail = (record, index) => () => {
    if (index !== 0) {
      return null;
    }
    if (props.viewDetail) {
      props.viewDetail(record);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [props.total]); // to reset page in row label to 0 when search

  const renderCol = (text, record, col, index) => {
    if (col.contextMenu) {
      return (
        <div>
          <TblIconButton
            aria-haspopup='true'
            onClick={(event) => handleClickMore(record[props.keyId], event)}
          >
            <span className='icon-icn_more' />
          </TblIconButton>
          <Paper>
            <Menu
              id='more-menu'
              anchorEl={anchorEl[record[props.keyId]]}
              open={Boolean(anchorEl[record[props.keyId]])}
              onClose={handleCloseMoreMenu}
              classes={{ paper: classes.paper }}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              {/* Pass function close to callback */}
              {col.contextMenu(record, handleCloseMoreMenu)}
            </Menu>
          </Paper>
        </div>
      );
    }
    if (col.render) {
      return col.render(text, record, index);
    }
    return text;
  };

  const renderEmptySearch = useMemo(() => {
    if (emptyContent) return emptyContent;
    const props = {
      subTitle: t('no_data'),
    };
    if (emptySearch) {
      props.subTitle = t('no_result_match');
      props.emptyImage = emptySearchImage;
    }
    return <EmptyContent {...props} />;
  }, [emptyContent, emptySearch]);

  const countHideColumns = props.columns.filter((c) => c.hide).length;

  return (
    <div className='tbl-list-container'>
      {props.tableLabel && (
        <TblInputLabel required={props.requiredLabel}>
          {props.tableLabel}
        </TblInputLabel>
      )}

      <TableContainer
        className={classes.container}
        style={{ height: props.scrollInline ? height : 'auto' }}
      >
        <PerfectScrollbar>
          <Table
            className={`${classes.table} ${props.className}`}
            aria-label='simple table'
            stickyHeader
          >
            <TableHead>
              <TableRow>
                {props.columns.map((col) => (
                  <StyledTableCell
                    key={col.key}
                    className={`${col.hide ? 'no-border' : ''} ${props.noSideBorder ? classes.noSideBorder : ''} 
                    ${classes[props.borderCell && 'borderCell']}`}
                    align={col.align || 'inherit'}
                    width={col.width}
                    id={col?.id}
                  >
                    <Box display='flex' justifyContent={col.align}>
                      {col.titleIcon ? (
                        <Box
                          className={clsx(classes.titleWithIcon, {
                            [classes.cursor]: col.cursor,
                          })}
                          onClick={col.titleIconAction}
                        >
                          <div>{col.title}</div>
                          <div className={`${classes.icon} ${col.titleIcon}`} />
                        </Box>
                      ) : (
                        col.title
                      )}
                      {col.titleIconEl}
                    </Box>
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.hasSearchList && (
                <StyledTableRow>
                  <StyledTableCell
                    component='td'
                    scope='row'
                    colSpan={props.columns.length - countHideColumns}
                    className={classes.inputSearch}
                  >
                    <TblInputs
                      inputSize='medium'
                      placeholder='Search'
                      id='inputSearch'
                      noneBorder={true}
                      hasSearchIcon={true}
                      onChange={(e) => {
                        e.persist();
                        props.onSearch(e);
                      }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {props.isBusy ? (
                <StyledTableRow>
                  {props.columns.map((col, index) => (
                    <StyledTableCell
                      className={clsx({
                        [classes.noSideBorder]: props.noSideBorder,
                      })}
                      key={index}
                    >
                      <Skeleton variant='text' />
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ) : props.rows.length ? (
                props.rows.map((row, i) => (
                  <StyledTableRow key={i}>
                    {props.columns.map((col, index) => (
                        <StyledTableCell
                          component='td'
                          scope='row'
                          key={`${i}_${col.key}`}
                          className={clsx(
                            '',
                            {
                              'no-border': col.hide,
                              'view-detail': index === 0 && viewDetail,
                            },
                            {
                              [classes.noSideBorder]: props.noSideBorder,
                              [classes.disabled]:
                                col.disabled &&
                                typeof col.disabled === 'function' &&
                                col.disabled(i),
                              [classes.errorCell]:
                                typeof col?.hasError === 'function'
                                  ? col.hasError(i)
                                  : col.hasError,
                            }
                          )}
                          align={col.align || 'inherit'}
                          onClick={viewDetail(row, index)}
                        >
                          {renderCol(row[col.key], row, col, i)}
                        </StyledTableCell>
                      ))}
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell
                    component='td'
                    scope='row'
                    colSpan={props.columns.length - countHideColumns}
                  >
                    {renderEmptySearch}
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </PerfectScrollbar>
      </TableContainer>
      {!!props.rows && !!props.rows.length && props.pagination && (
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component='div'
          count={props.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className={classes.pagination}
        />
      )}
    </div>
  );
}

TblTable.defaultProps = {
  pagination: false,
  rowsPerPage: 50,
  rows: [],
  columns: [],
  isList: true,
  viewDetail: () => { },
  isBusy: false,
  delta: 0,
  scrollInline: false,
  keyId: 'id',
  noSideBorder: false,
};

TblTable.propTypes = {
  borderCell: PropTypes.bool,
  className: PropTypes.any,
  columns: PropTypes.array,
  delta: PropTypes.number,
  emptyContent: PropTypes.node,
  emptySearch: PropTypes.bool,
  handleChangePerPage: PropTypes.func,
  hasSearchList: PropTypes.bool,
  isBusy: PropTypes.bool,
  isList: PropTypes.bool,
  keyId: PropTypes.string,
  noSideBorder: PropTypes.bool,
  onChangePage: PropTypes.func,
  onSearch: PropTypes.func,
  pagination: PropTypes.bool,
  requiredLabel: PropTypes.bool,
  rows: PropTypes.array,
  rowsPerPage: PropTypes.number,
  scrollInline: PropTypes.bool,
  t: PropTypes.func,
  tableLabel: PropTypes.string,
  total: PropTypes.number,
  viewDetail: PropTypes.func,
};

export default TblTable;
