import React, { useCallback, useContext, useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import trim from 'lodash/trim';

import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import withStyles from '@mui/styles/withStyles';

import EmptyContent from 'components/EmptyContent';
import TblTable from 'components/TblTable';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { PropTypes } from 'prop-types';

import schoolYearActions from '../actions';
import { SCHOOL_YEAR_STATUS } from '../constants';
import { ROUTE_SCHOOL_YEAR } from '../constantsRoute';

const styles = (theme) => ({
  root: {},
  schoolYearTable: {
    marginTop: theme.spacing(2),
  },
  status: {
    textTransform: 'capitalize',
    borderRadius: theme.spacing(1),
    minWidth: '80px',
    height: '24px',
    margin: 'auto',
  },
  draft: {
    background: theme.mainColors.orange[0],
    color: theme.newColors.gray[50],
  },
  published: {
    background: theme.mainColors.primary2[0],
    color: theme.newColors.gray[50],
  },
  archived: {
    background: theme.mainColors.gray[2],
  },
  iconOff: {
    color: theme.mainColors.gray[6],
  },
});
const schoolYearSelector = (state) => state.SchoolYear;

function SchoolYearList(props) {
  const { search } = props;
  const [{ sortField, sort, offSortName, offSortFirstDay }, setSort] = useState(
    {
      sortField: 'firstDay',
      sort: 'desc',
      offSortName: true,
      offSortFirstDay: false,
    }
  );
  const { enqueueSnackbar } = useSnackbar();
  const { schoolYearList, isBusy, deleteSchoolYearDraftSuccess } =
    useSelector(schoolYearSelector);
  // const { currentUser } = useSelector(authSelecttor);
  const dispatch = useDispatch();
  const authContext = useContext(AuthDataContext);
  const {
    organizationId,
    organization: { timezone },
  } = authContext.currentUser;
  const getSchoolYearList = useCallback(
    () =>
      dispatch(
        schoolYearActions.getSchoolYearList({
          id: organizationId,
          isBusy: true,
          urlParams: {
            timezone: timezone,
            search: props.search?.trim(),
            sortField,
            sort,
          },
        })
      ),
    [dispatch, organizationId, timezone, props.search, sortField, sort]
  );

  const deleteSchoolYearDraft = (schoolYearId) => {
    dispatch(
      schoolYearActions.deleteSchoolYearDraft({
        deleteSchoolYearDraftSuccess: null,
        orgId: organizationId,
        schoolYearId,
      })
    );
  };

  useEffect(() => {
    getSchoolYearList();
  }, [getSchoolYearList]);

  useDidMountEffect(() => {
    if (deleteSchoolYearDraftSuccess) {
      enqueueSnackbar(t('common:deleted'), {
        variant: 'success',
      });
    }
  }, [deleteSchoolYearDraftSuccess]);

  const onSortFirstDay = () => {
    setSort({
      sortField: 'firstDay',
      sort: sort === 'asc' ? 'desc' : 'asc',
      offSortName: true,
    });
  };

  const onSortName = () => {
    setSort({
      sortField: 'name',
      sort: sort === 'asc' ? 'desc' : 'asc',
      offSortFirstDay: true,
    });
  };

  const { t, classes } = props;
  const columns = [
    {
      title: t('common:name'),
      titleIcon: offSortFirstDay
        ? sort === 'desc'
          ? 'icon-icn_sort_arrow_down'
          : 'icon-icn_sort_arrow_up'
        : `icon-icn_sort_arrow_off ${classes.iconOff}`,
      dataIndex: 'name',
      titleIconAction: onSortName,
      key: 'name',
      render: (text) => (
        <div className='text-ellipsis'>{trim(text)}</div>
      ),
    },
    {
      title: t('first_date'),
      titleIcon: offSortName
        ? sort === 'desc'
          ? 'icon-icn_sort_arrow_down'
          : 'icon-icn_sort_arrow_up'
        : `icon-icn_sort_arrow_off ${classes.iconOff}`,
      dataIndex: 'firstDay',
      key: 'firstDay',
      titleIconAction: onSortFirstDay,
      render: (text) => (
        <div className='text-ellipsis'>
          {moment(text).format('MMM DD, YYYY')}
        </div>
      ),
    },
    {
      title: t('last_date'),
      dataIndex: 'lastDay',
      key: 'lastDay',
      render: (text) => (
        <div className='text-ellipsis'>
          {moment(text).format('MMM DD, YYYY')}
        </div>
      ),
    },
    {
      title: t('status'),
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => {
        let status;
        switch (record.status) {
          case -1:
            status = 'archived';
            break;
          case 0:
            status = 'draft';
            break;
          case 1:
            status = 'published';
            break;
          default:
            break;
        }
        // return <div className={`${classes.status} ${classes[status]}`}>{status}</div>;
        return (
          <Chip
            label={status}
            className={`${classes.status} ${classes[status]}`}
          />
        );
      },
    },
    {
      key: 'action',
      align: 'right',
      contextMenu: (record) => {
        const enableDelete = record.status === SCHOOL_YEAR_STATUS.DRAFT;
        return (
          <>
            <MenuItem
              onClick={() =>
                props.history.push(
                  ROUTE_SCHOOL_YEAR.SCHOOL_YEAR_DETAIL(record.id)
                )
              }
            >
              {t('common:view_details')}
            </MenuItem>
            {enableDelete && (
              <MenuItem onClick={() => deleteSchoolYearDraft(record.id)}>
                {t('common:delete')}
              </MenuItem>
            )}
          </>
        );
      },
    },
  ];
  const emptyData = !search && schoolYearList.length === 0;
  const emptySearch= !!search;
  return (
    <div className={classes.root}>
      <TblTable
        columns={columns}
        rows={schoolYearList}
        className={classes.schoolYearTable}
        isBusy={isBusy}
        viewDetail={(row) =>
          props.history.push(ROUTE_SCHOOL_YEAR.SCHOOL_YEAR_DETAIL(row.id))
        }
        emptySearch={emptySearch}

        emptyContent={
          emptyData && (
            <EmptyContent
              subTitle={
                <span>{t('schoolYear:no_school_year_have_been_added')}</span>
              }
            />
          )
        }
      />
    </div>
  );
}

SchoolYearList.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
  search: PropTypes.string,
  classes: PropTypes.object,
  schoolYearInfo: PropTypes.object,
};

export default withStyles(styles)(
  withTranslation(['schoolYear', 'common'])(SchoolYearList)
);
