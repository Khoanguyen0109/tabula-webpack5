import React from 'react';

import makeStyles from '@mui/styles/makeStyles';

import { Layout1 } from 'layout';
import PropTypes from 'prop-types';

const styled = makeStyles((theme) => ({
  content: {
    display: 'flex',
    height: '100%'
  },
  contentLeft: {
    flex: 1,
    width: '75%',
  },
  contentRight: {
    width: '25%',
    maxWidth: '410px',
    minWidth: '300px',
    padding: `${theme.spacing(2)} 0`
  }
}));

function DetailContent({ children }) {
  const classes = styled();
  return (
    <Layout1
      scrollable={false}
      padding={{ pTop: 1, pRight: 5, pLeft: 5, pBottom: 2 }}
      contentHeight='100%'
    >
      <div className={classes.content}>
        <div className={classes.contentLeft}>
          {children?.[0]}
        </div>
        <div className={classes.contentRight}>
          {children?.[1]}
        </div>
      </div>
    </Layout1>
  );
}

DetailContent.propTypes = {
  children: PropTypes.node
};

export default DetailContent;