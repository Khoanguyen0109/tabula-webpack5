import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { ReactComponent as NoActivities } from 'assets/images/no_activities_grid.svg';

function NoDataColumn() {
    const {t} = useTranslation('myCourses');
    return (
        <Box 
        sx={{
            textAlign: 'center'
        }}>
            <NoActivities />
            <Typography component='div' variant='bodyMedium'>
                {t('no_course_activities_assigned_yet')}
            </Typography>
        </Box>
    );
}

export default NoDataColumn;
