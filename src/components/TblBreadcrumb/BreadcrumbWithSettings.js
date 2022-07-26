/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Box, ListSubheader } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import TblSelect from 'components/TblSelect';

import useGetSchoolYear from 'utils/customHook/useGetSchoolYear';
import { isTeacher } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import PropTypes from 'prop-types';

import FilterSchoolYearSetting from './FilterSchoolYearSetting';

const useStyles = makeStyles((theme) => ({
  filterSchoolYear: {
    minWidth: theme.spacing(25),
    color: `${theme.mainColors.primary1[0] } !important`,
    background: `${theme.openColors.white } !important`,
    marginLeft: theme.spacing(1),
    '& .MuiInput-input': {
      minWidth: theme.spacing(25),
      maxWidth: theme.spacing(50),
      paddingLeft: 0,
      fontSize: theme.fontSize.large,
      fontWeight: theme.fontWeight.semi,
    },
  },
  boxFilter: {
    position: 'relative',
    width: theme.spacing(36),
    marginLeft: theme.spacing(1),
    '&::before': {
      position: 'absolute',
      display: 'block',
      top: '45%',
      content: '""',
      width: '4px',
      height: '4px',
      border: '1px solid',
      backgroundColor: theme.newColors.gray[800],
      borderRadius: '50%',
    },
  },
  subHeader: {
    height: theme.spacing(3),
    lineHeight: theme.spacing(2),
    color: theme.newColors.gray[400],
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
    pointerEvents: 'none',
  },
}));
export default function BreadcrumbWithSettings({ title, footerContent }) {
  const { t } = useTranslation();

  const classes = useStyles();
  const breadcrumb = useContext(BreadcrumbContext);
  const authContext = useContext(AuthDataContext);
  const { currentUser, currentStudentId } = authContext;
  const [schoolYearSelected, , setFilterSchoolYear, resetSchoolYear] =
    useGetSchoolYear();

  const [schoolYearFilter, setSchoolYearFilter] = useState(false);
  const schoolYears = useSelector((state) => state.Auth.schoolYears) ?? [];

  const showFilter = isTeacher(currentUser);
  useEffect(() => {
    breadcrumb.setData({
      bodyContent: (
        <Typography
          display='flex'
          alignItems='center'
          variant='headingSmall'
          component='span'
          className='text-ellipsis'
        >
          {title}
          {showFilter && schoolYears?.length > 0 && (
            <Box className={classes.boxFilter}>
              <TblSelect
                className={classes.filterSchoolYear}
                value={schoolYearSelected}
                required
                variant='standard'
                disableUnderline
                onChange={(event) => setFilterSchoolYear(event.target.value)}
              >
                <ListSubheader className={classes.subHeader}>
                  {t('schoolYear:school_years')}
                </ListSubheader>
                {schoolYears.map((item) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TblSelect>
            </Box>
          )}
        </Typography>
      ),
      footerContent: footerContent,
    });
  }, [footerContent, currentStudentId]);

  useEffect(() => () => {
      resetSchoolYear();
    }, []);
  return showFilter ? (
    <FilterSchoolYearSetting
      isOpenDialog={schoolYearFilter}
      setOpenDialog={setSchoolYearFilter}
    />
  ) : (
    <></>
  );
}
BreadcrumbWithSettings.propTypes = {
  footerContent: PropTypes.any,
  setOpenDialog: PropTypes.func,
  title: PropTypes.string,
};
