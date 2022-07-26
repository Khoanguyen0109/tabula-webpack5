import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import makeStyles from '@mui/styles/makeStyles';
import { Box } from '@mui/system';
import { GridOverlay } from '@mui/x-data-grid-pro';

// import { ReactComponent as NoDataGridImage } from 'assets/images/no_data_grid.svg';
import { ReactComponent as NoResultMatch } from 'assets/images/no_result_match.svg';
import { ReactComponent as NoStudentAvailable } from 'assets/images/no_studens_available.svg';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  root: {
    flexDirection: 'column',
  },
}));
function NoDataGrid(props) {
  const { searchValue } = props;
  const classes = useStyles();
  const { t } = useTranslation('myCourses', 'common');
  const gradeBookColumn = useSelector(
    (state) => state.AllCourses.gradeBookColumn
  );
  const gradeBookRow = useSelector((state) => state.AllCourses.gradeBookRow);

  const noGradeBookData =
    gradeBookColumn.length === 0 && gradeBookRow.length === 0;
  const noStudentAvailable =
    searchValue === '' &&
    gradeBookColumn.length > 0 &&
    gradeBookRow.length === 0;
  const noResult =
    !!searchValue && gradeBookColumn.length > 0 && gradeBookRow.length === 0;
  return (
    <GridOverlay className={classes.root}>
      { (noStudentAvailable || noGradeBookData ) && (
        <>
          <Box>
            <NoStudentAvailable />
          </Box>
          <Box>{t('no_student_available')}</Box>
        </>
      )}
      {noResult && (
        <>
          <Box>
            <NoResultMatch />
          </Box>
          <Box>{t('common:no_result_match')}</Box>
        </>
      )}
    </GridOverlay>
  );
}

NoDataGrid.propTypes = {
  searchValue: PropTypes.string
};

export default NoDataGrid;
