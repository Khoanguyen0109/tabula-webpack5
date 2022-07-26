import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Box, MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblSelect from 'components/TblSelect';

import useGetSchoolYear from 'utils/customHook/useGetSchoolYear';

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(36),
  },
}));

const SchoolYearFilter = () => {
  const { t } = useTranslation('myProfile');
  const classes = useStyles();
  const [schoolYearSelected, setSchoolYearSelected] = useGetSchoolYear();
  const schoolYears = useSelector((state) => state.Auth.schoolYears) ?? [];

  return (
    <Box className={classes.root}>
      <TblSelect
        label={t('select_school_year')}
        value={schoolYearSelected}
        required
        onChange={(event) => setSchoolYearSelected(event.target.value)}
      >
        {schoolYears.map((item) => (
          <MenuItem value={item.id} key={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </TblSelect>
    </Box>
  );
};

SchoolYearFilter.propTypes = {};

export default SchoolYearFilter;
