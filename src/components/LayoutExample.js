import React from 'react';

import { Layout1, Layout2, LayoutContent } from 'layout';

class LayoutExample extends React.Component {
  render() {
    return (
      <div>
        <h1> Layout 1 example</h1>
        <Layout1>
          <div title='Layout 1'>
            left 1
          </div>
        </Layout1>
        <h1> Layout 2 example</h1>
        <Layout2>
          <div title='Layout 2 left'>
            left 2
          </div>

          <div title='Layout 2 right'>
            left 2
          </div>
        </Layout2>

        <h1> Layout content example</h1>
        <LayoutContent>
          <div grid={{ xs: 12, sm: 3 }} background='red' boxStyles={{ pr: 5 }}>
            left
          </div>
          <div grid={{ xs: 12, sm: 9 }} background='blue' boxStyles={{ pl: 5 }}>
            Right
          </div>
        </LayoutContent>
      </div>
    );
  }
}

export default LayoutExample;
