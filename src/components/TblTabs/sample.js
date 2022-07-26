import React, { useEffect, useState } from 'react';

import Skeleton from '@mui/material/Skeleton';

import Tabs from '.';

const tabsExample = [
  {
    label: 'Example 1',
    children: (
      <div>
        <Skeleton variant='text' />
        <Skeleton variant='rectangular' />
        <Skeleton variant='rectangular' width={210} height={118} />
      </div>
    ),
  },
  {
    label: 'Example 2',
    children: (
      <div>
        <Skeleton variant='text' />
        <Skeleton variant='rectangular' />
        <Skeleton variant='rectangular' width={210} height={118} />
      </div>
    ),
  },
  {
    label: 'Example 3',
    children: (
      <div>
        <Skeleton variant='text' />
        <Skeleton variant='rectangular' />
        <Skeleton variant='rectangular' width={210} height={118} />
      </div>
    ),
  },
  {
    label: 'Example 4',
    children: (
      <div>
        <Skeleton variant='text' />
        <Skeleton variant='rectangular' />
        <Skeleton variant='rectangular' width={210} height={118} />
      </div>
    ),
  },
];

const tabs = [
  {
    label: 'Example 1',
    children: (
      <div>
        {' '}
        Example 1 Lorem ipsum, or lipsum as it is sometimes known, is dummy text
        used in laying out print, graphic or web designs. The passage is
        attributed to an unknown typesetter in the 15th century who is thought
        to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for
        use in a type specimen book.
      </div>
    ),
  },
  {
    label: 'Example 2',
    children: (
      <div>
        {' '}
        Example 2 Lorem ipsum, or lipsum as it is sometimes known, is dummy text
        used in laying out print, graphic or web designs. The passage is
        attributed to an unknown typesetter in the 15th century who is thought
        to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for
        use in a type specimen book.
      </div>
    ),
  },
  {
    label: 'Example 3',
    children: (
      <div>
        Example 3 Lorem ipsum, or lipsum as it is sometimes known, is dummy text
        used in laying out print, graphic or web designs. The passage is
        attributed to an unknown typesetter in the 15th century who is thought
        to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for
        use in a type specimen book.
      </div>
    ),
  },
  {
    label: 'Example 4',
    children: (
      <div>
        Example 4 Lorem ipsum, or lipsum as it is sometimes known, is dummy text
        used in laying out print, graphic or web designs. The passage is
        attributed to an unknown typesetter in the 15th century who is thought
        to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for
        use in a type specimen book.
      </div>
    ),
  },
];

export default function TblTabs() {
  const [state, setState] = useState({
    tabs: tabsExample,
    isLoaded: false,
  });
  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleChange = (event, newValue) => {
  };

  useEffect(() => {
    if (!state.isLoaded)
      setTimeout(() => setState({ tabs, isLoaded: true }), 3000);
  });

  return (
    <div>
      <h2>NORMAL</h2>
      <Tabs onChange={handleChange} tabs={state.tabs} />
      <h2>BORDERED</h2>
      <Tabs onChange={handleChange} tabs={state.tabs} bordered />
      <h2>ROUND and CENTER</h2>
      <Tabs onChange={handleChange} tabs={state.tabs} centered type='round' />
    </div>
  );
}
