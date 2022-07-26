import React from 'react';
import { useTranslation } from 'react-i18next';

import trim from 'lodash/trim';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblInputs from 'components/TblInputs';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  input: {
    '& input': {
      borderRight: `1px solid ${theme.newColors.gray[300]}`,
      marginRight: theme.spacing(1)
    }
  },
}));

function OrganizationInformation(props) {
  const { t } = useTranslation(['domain', 'common']);
  const classes = useStyles();
  const { orgInfo } = props;
  const domain = window.location.hostname.replace(`${orgInfo?.subdomain}.`, '');

  return (
    <Grid container>
      <Grid item xs={8}>
        <TblInputs label={t('organization_name')} value={trim(orgInfo?.organizationName) ?? 'Organization Name'} disabled={true} />
        <Box mt={2}>
          <TblInputs
            className={classes.input}
            label={t('school_domain')}
            value={trim(orgInfo?.subdomain) ?? 'School Domain'}
            disabled={true}
            endAdornment={
              <Typography variant='bodyMedium' component='span' color='primary'>{`.${domain}`}</Typography>
            } />
        </Box>
      </Grid>
    </Grid>
  );
}

OrganizationInformation.propTypes = {
  t: PropTypes.func,
  orgInfo: PropTypes.object
};

export const OrganizationInformationWrapper = React.memo(OrganizationInformation);