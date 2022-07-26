import React from 'react';

import { Grid } from '@mui/material';

import loadable from '@loadable/component';

const ViewAssignmentDetails = loadable(() => import('modules/MyCourses/components/CourseContent/ViewAssignmentDetails'));
// const ViewQuizDetails = loadable(() => import('modules/MyCourses/components/CourseContent/ViewQuizDetails'));

function CompleteAssignment() {

  return (
    <div>
      <div className='title'>
        <div className='type' />
        <div className='type-name'>
          <span />
          <span />
        </div>
      </div>
      <Grid container>
        <Grid container item xs={4} md={4} lg={4} xl={4} />
        <Grid container item xs={8} md={8} lg={8} xl={8}>
          <ViewAssignmentDetails sectionId={76} />
        </Grid>
      </Grid>
    </div>
  );
};

export default CompleteAssignment;