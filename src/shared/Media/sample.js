import React from 'react';

import Grid from '@mui/material/Grid';

import TblButton from 'components/TblButton';

import Media from './containers';

export default class MediaSample extends React.PureComponent {
  state = {
    open: false
  }
  render() {
    const {open} = this.state;
    return <Grid container>
            <TblButton onClick={() => this.setState({open: true})}>Show</TblButton>
        <Media visible={open} multiple={true} onClose={() => {this.setState({open: false}); }} mediaType='media' />
    </Grid>;
  }
}