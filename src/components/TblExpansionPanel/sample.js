import React from 'react';

import TblExpansionPanel from '.';

export default function SimpleExpansionPanel() {
  let panels=[];
  for (let i=0; i<5; i++) {
    panels[i] = {title: `Collapsible Group Item ${i}`, children: <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
    sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
    elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.</div>};
  }

  return <TblExpansionPanel panels={panels} expendedAll />;
} 