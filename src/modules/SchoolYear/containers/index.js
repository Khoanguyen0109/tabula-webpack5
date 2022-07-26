import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';

import Grid from '@mui/material/Grid';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import BreadcrumbTitle from 'components/TblBreadcrumb/BreadcrumbTitle';
import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

// import withReducer from 'components/withReducer';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Layout1 } from 'layout';
import PropTypes from 'prop-types';

import CreateSchoolYear from './CreateSchoolYear';
import SchoolYearList from './SchoolYearList';
// import schoolYearReducer from '../reducers';
// import schoolYearEpics from '../epics';

function SchoolYear({ history }) {
  // NOTE: get contexts
  const { t } = useTranslation('schoolYear', 'common');
  const context = useContext(BreadcrumbContext);
  const authContext = useContext(AuthDataContext);

  // NOTE: initial states
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [search, setSearch] = useState('');

  // NOTE: common functions
  const toggleDialog = (value = false) => {
    setVisibleDialog(value);
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
  };

  // NOTE: handle react lifecycle
  useEffect(() => {
    context.setData({
      showBoxShadow: false,
      bodyContent: (
        <Grid width='100%' spacing={0} container>
          <Grid item xs={5} sm={5}>
            <BreadcrumbTitle title={t('school_years')} />
          </Grid>
          <Grid
            item
            xs={2}
            sm={2}
            sx={{
              '& .TblInput': {
                marginBottom: `${0 }!important`,
              },
            }}
          >
            <TblInputs
              value={search}
              inputSize='medium'
              placeholder={t('common:enter_name')}
              hasSearchIcon={true}
              hasClearIcon={true}
              onChange={onSearch}
            />
          </Grid>
        </Grid>
      ),
    });
  }, [search]);

  return (
    <Layout1>
      <TblButton
        color='primary'
        variant='contained'
        type='submit'
        onClick={() => toggleDialog(true)}
      >
        {t('common:new')}
      </TblButton>
      {visibleDialog && (
        <CreateSchoolYear
          history={history}
          authContext={authContext}
          visibleDialog={visibleDialog}
          toggleDialog={toggleDialog}
        />
      )}
      <SchoolYearList history={history} search={search} />
    </Layout1>
  );
}

SchoolYear.propTypes = {
  history: PropTypes.object,
};

export default withRouter(SchoolYear);
