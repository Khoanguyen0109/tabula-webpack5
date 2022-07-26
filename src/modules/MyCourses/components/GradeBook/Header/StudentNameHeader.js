import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import PropTypes from 'prop-types';

import SortByName from '../sortByName';

function StudentNameHeader(props) {
  const { sortByName, onSortByName } = props;
  const { t } = useTranslation('myCourses');
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        // width: '100%',
        marginLeft: theme.spacing(1),
        color: theme.newColors.gray[800],
        fontSize: theme.fontSize.normal,
        fontWeight: theme.fontWeight.semi,
        padding: `${theme.spacing(1)} `,
      }}
    >
      {t('student_name')}

      <Box sx={{
          position: 'absolute',
          right: -80
      }}>
        <SortByName
          onClick={onSortByName}
          selectedFieldSort={sortByName}
         />
      </Box>
    </Box>
  );
}

StudentNameHeader.propTypes = {
  onSortByName: PropTypes.func,
  sortByName: PropTypes.string,
};

export default StudentNameHeader;
