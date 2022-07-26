import React from 'react';

import { Box } from '@mui/material';

import TabulaCheckbox from './index';

export default function CheckBoxSample() {
    return (<>
        <Box>
            <h3>Primary</h3>
            <TabulaCheckbox color='primary' checked={false} />
            <TabulaCheckbox color='primary' checked />
        </Box>
        <Box>
            <h3>Indeterminate</h3>
            <TabulaCheckbox color='primary' indeterminate='true' />
        </Box>
        <Box>
            <h3>Disabled</h3>
            <TabulaCheckbox disabled />
            <TabulaCheckbox disabled checked />
            <TabulaCheckbox color='primary' indeterminate='true' disabled />
        </Box>
    </>
    );
}