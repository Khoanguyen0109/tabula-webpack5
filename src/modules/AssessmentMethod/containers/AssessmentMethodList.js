import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import trim from 'lodash/trim';

import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import withStyles from '@mui/styles/withStyles';

import { StyledRadio } from 'components/TblRadio';
import TblTable from 'components/TblTable';
import TblTooltip from 'components/TblTooltip';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { PropTypes } from 'prop-types';

import assessmentMethodActions from '../actions';

const styles = (theme) => ({
  root: {},
  assessmentMethodTable: {
    marginTop: theme.spacing(2),
  },
});

function AssessmentMethodList(props) {
  const { t } = useTranslation(['assessmentMethod', 'common']);
  const assessmentMethodList = useSelector(
    (state) => state.AssessmentMethod.assessmentMethodList
  );
  // NOTE: connect redux
  const authContext = useContext(AuthDataContext);
  const dispatch = useDispatch();

  const { classes } = props;
  const {
    organizationId,
    organization: { timezone },
  } = authContext.currentUser;
  
  const onChangeDefault = (e) => {
    dispatch(
      assessmentMethodActions.setDefaultAssessmentMethod({
        orgId: organizationId,
        gradeScaleId: e.target.value,
      })
    );
  };

  const columns = [
    {
      title: t('common:name'),
      dataIndex: 'methodName',
      key: 'methodName',
      render: (text, record) => (
        <div
          className='text-ellipsis'
          onClick={() => props.editAssessmentMethod(record)}
        >
          {trim(text)}
        </div>
      ),
    },
    {
      title: t('preview'),
      dataIndex: 'ranges',
      key: 'ranges',

      render: (text) => trim(text.map((item) => item.name).join(', ')),
    },
    {
    title: t('use_as_default'),
      dataIndex: 'default',
      key: 'default',
      align: 'center',
      width: '100px',
      render: (text, record) => (
          <StyledRadio
            checked={record.default}
            value={record.id}
            onChange={onChangeDefault}
          />
        ),
    },
    {
      key: 'action',
      align: 'right',
      contextMenu: (record, callback) => {
        const beingUsed = record.courses.length > 0;
        return (
          <>
            <MenuItem
              onClick={() => {
                props.editAssessmentMethod(record);
                if (callback) callback();
              }}
            >
              {t('common:edit')}
            </MenuItem>

            <MenuItem
              sx={{
                '&.Mui-disabled': {
                  pointerEvents: 'auto',
                },
              }}
              disabled={beingUsed}
              onClick={() => {
                if (!beingUsed) {
                  props.deleteAssessmentMethod(record.id);
                  if (callback) callback();
                }
              }}
            >
              <TblTooltip
                disableHoverListener={!beingUsed}
                title={t('assessmentMethod:can_not_delete_assessment_method')}
                placement='top'
                arrow
              >
                <span>{t('common:delete')}</span>
              </TblTooltip>
            </MenuItem>
          </>
        );
      },
    },
  ];

  const getAssessmentMethodList = useCallback(
    () =>
      dispatch(
        assessmentMethodActions.getAssessmentMethodList({
          orgId: organizationId,
          isBusy: true,
          urlParams: {
            timezone: timezone,
            search: props.search,
          },
        })
      ),
    [dispatch, organizationId, timezone, props.search]
  );

  useEffect(() => {
    getAssessmentMethodList();
  }, [getAssessmentMethodList]);

  if (!assessmentMethodList) {
    return (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    );
  }

  return (
    <div className={classes.root}>
      <TblTable
        columns={columns}
        rows={assessmentMethodList}
        className={classes.assessmentMethodTable}
      />
    </div>
  );
}

AssessmentMethodList.propTypes = {
  assessmentMethodActions: PropTypes.object,
  assessmentMethodList: PropTypes.array,
  classes: PropTypes.object,
  deleteAssessmentMethod: PropTypes.func,
  editAssessmentMethod: PropTypes.func,
  search: PropTypes.string
};

export default withStyles(styles)(AssessmentMethodList);
