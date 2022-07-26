import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTE_MY_PROFILE } from 'modules/MyProfile/constantsRoute';
// import TabulaButton from '../../../shared/UIComponents/TabulaButton';
// import { LayoutContent, Layout1, Layout2 } from 'components/SwitchLayout';
class GetStarted extends React.Component {
  render() {
    return (
      <div id='get-started-page'>
        <div className='get-started-title'>
          <div>Let's get started. Now let’s create your first course.</div>
          <div>
            You can either start with a template or build one from scratch.
          </div>
        </div>
        <div className='get-started-content'>
          <div className='get-started-left-layout'>
            <div className='header'>Feeling ambitious?</div>
            <div>Create your first course from scratch.</div>
            {/* <TabulaButton btnForm="circle" background="white" color="purple"> */}
            <div className='create-course-btn'>
              <Link to='/courses/create'>CREATE COURSE</Link>
            </div>
            {/* </TabulaButton> */}
          </div>
          <div className='get-started-right-layout'>
            <div className='header'>We've got you covered</div>
            <div>Start with one of our pre-built course templates.</div>
            <div className='create-course-btn'>
              <Link to='/courses/create'>CHOOSE TEMPLATE LIBRARY</Link>
            </div>
            <div className='create-course-btn'>
              <Link to={ROUTE_MY_PROFILE.DEFAULT}>MY PROFILE</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GetStarted;
