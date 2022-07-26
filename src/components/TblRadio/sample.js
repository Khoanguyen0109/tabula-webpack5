import React from 'react';

import Radio from '.';

export default function RadioSample() {
  const values = [
    {
    label: 'Checked',
    value: 1
  },
  {
    label: 'Default',
    value: 2
  },
];
    return (<>
    <div>
        <Radio 
            name='radio-demo'
            values={values}
            value={1}
            label='Default'
          />
    </div>
    </>
    );
}