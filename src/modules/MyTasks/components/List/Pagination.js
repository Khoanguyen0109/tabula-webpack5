import React, { useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';

import PropTypes from 'prop-types';

const styled = makeStyles(({ spacing }) => ({
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
      margin: '0 16px'
    },
    '& .row-page': {
      display: 'flex',
      alignItems: 'center',
      '& .per-page': {
        marginRight: '16px'
      },
      '& .MuiInputBase-root': {
        '&:before': {
          display: 'none'
        },
        '&:after': {
          display: 'none'
        },
        '& .MuiSelect-select': {
          minHeight: 0,
          paddingTop: spacing(1.25),
          paddingBottom: spacing(1.25),

          '&:focus': {
            background: 'none'
          }
        }
      }
    },
    '& .info-page': {

    },
    '& .event-page': {
      width: spacing(10),
      display: 'flex',
      justifyContent: 'space-between',
      '& .MuiButtonBase-root': {
        cursor: 'pointer'
      }
    }
  }
}));

function Pagination(props) {
  const {
    taskList = [],
    isLoading = false,
    t = () => { },
    pagination = {},
  } = props;

  const { visible: visiblePaging = false, limits = [25, 50, 100], defaultPaging, total = 0, onPaging } = pagination;

  const style = styled();

  const [currentPage, setCurrentPage] = useState(defaultPaging?.page || 1);
  const [currentLimit, setCurrentLimit] = useState(defaultPaging?.limit || limits[1]);

  const renderPagination = useMemo(() => {
    const from = taskList.length && ((currentPage - 1) * currentLimit + 1);
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
        {isLoading
          ? (
            <React.Fragment>
              <div className='row-page'>
                <span className='per-page'>{t('myTasks:pagination-row_per_pages')}:</span>
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
                <span className='per-page'>{t('myTasks:pagination-row_per_pages')}:</span>
                <Select defaultValue={currentLimit} onChange={onChangeRange}>
                  {limits.map((e, i) => <MenuItem key={i} value={e}>{e}</MenuItem>)}
                </Select>
              </div>
              <div className='info-page'>
                <span>{from}-{maxTo} of {total}</span>
              </div>
              <div className='event-page'>
                <TblIconButton onClick={onPrevious} disabled={!taskList.length || currentPage === 1}>
                  <span className='icon-icn_arrow_left' />
                </TblIconButton>
                <TblIconButton onClick={onNext} disabled={!taskList.length || (currentPage * currentLimit) >= total}>
                  <span className='icon-icn_arrow_right' />
                </TblIconButton>
              </div>
            </React.Fragment>
          )}
      </div>
    );
  }, [currentLimit, currentPage, isLoading, limits, onPaging, style.pagination, t, taskList.length, total]);

  return (
    <React.Fragment>
      {visiblePaging && renderPagination}
    </React.Fragment>
  );
}

Pagination.propTypes = {
  taskList: PropTypes.array,
  t: PropTypes.func,
  isLoading: PropTypes.bool,
  pagination: PropTypes.object
};

export default withTranslation(['myTasks', 'common'])(Pagination);
