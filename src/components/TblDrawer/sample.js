import React from 'react';

import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import TblButton from '../TblButton';

import TblDrawer from '.';

function DrawerSample() {
  const [state, setState] = React.useState(false);
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(open);
  };

  const list = () => (
    <div>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
  return (
    <>
      <TblButton size='large' variant='outlined' color='primary' onClick={toggleDrawer(true)}>Open Drawer</TblButton>
      <TblDrawer anchor={'right'}
open={state}
onClose={toggleDrawer(false)}
        title='Demo'
        footer={
          <>
            <TblButton size='large' variant='outlined' color='primary' onClick={toggleDrawer(false)}>Cancel</TblButton>
            <TblButton size='large' variant='contained' color='primary'>Submit</TblButton>
          </>
        }
      >
        {list()}
      </TblDrawer>
    </>
  );
}
export default DrawerSample; 