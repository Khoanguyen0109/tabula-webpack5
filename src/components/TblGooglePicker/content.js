import React from 'react';

import GooglePicker from '.';
const SCOPE = ['https://www.googleapis.com/auth/drive.readonly'];

function App() {
  return (
    <div className='container'>
      <GooglePicker clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        developerKey={process.env.REACT_APP_GOOGLE_DEVELOPER_KEY}
        scope={SCOPE}
        onChange={() => {
        }}
        multiselect={true}
        navHidden={true}
        authImmediate={false}
        mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
        viewId={'DOCUMENTS'} />
    </div>
  );
}

export default App;