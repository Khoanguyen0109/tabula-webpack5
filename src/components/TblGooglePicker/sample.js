import React from 'react';

import GooglePicker from '.';

const SCOPE = ['https://www.googleapis.com/auth/drive.readonly'];

function App() {
  const [link, setLink] = React.useState('');

  return (
    <div className='container'>
      <GooglePicker clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        developerKey={process.env.REACT_APP_GOOGLE_DEVELOPER_KEY}
        scope={SCOPE}
        onChange={(data) => {
          setLink(data?.docs?.[0]?.url);
        }}
        multiselect={true}
        navHidden={true}
        authImmediate={false}
        mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
        viewId={'DOCUMENTS'} />
      {link && <embed src={link} width='500' height='500' />}
    </div>
  );
}

export default App;