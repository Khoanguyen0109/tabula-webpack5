import React from 'react';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import clsx from 'clsx';
import PropTypes from 'prop-types';

// Sample
import PreviewFileSample from './PreviewFile/sample';
import TblAutocompleteSample from './TblAutocomplete/sample';
import TabulaButtonSample from './TblButton/sample';
import TblCalendar from './TblCalendar/sample';
import CheckBoxSample from './TblCheckBox/sample';
import TblDialogSample from './TblDialog/sample';
import DrawerSample from './TblDrawer/sample';
import TblExpansionPanel from './TblExpansionPanel/sample';
import TblIconButtonSample from './TblIconButton/sample';
import TblInputSample from './TblInputs/sample';
import NotificationSample from './TblNotification/sample';
import RadioSample from './TblRadio/sample';
import TblSelect from './TblSelect/sample';
import TblTable from './TblTable/sample';
// import LayoutExample from './LayoutExample';
import TblTabs from './TblTabs/sample';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
});

class Sample extends React.PureComponent {
  state = {
    Component: TabulaButtonSample,
    title: ''
  }
  render() {
    const classes = this.props.classes;
    const { title, Component } = this.state;
    return <div className={classes.root}>
      <AppBar position='absolute' className={clsx(classes.appBar, classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <Typography component='headingLarge' variant='bodyMedium' color='inherit' noWrap className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        classes={{
          paper: clsx(classes.drawerPaper),
        }}
        open={true}
      >
        <List>
          <div>
            <ListItem button>
              <ListItemText primary='Button' onClick={() => this.setState({ Component: TabulaButtonSample, title: 'Button' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Icon Button' onClick={() => this.setState({ Component: TblIconButtonSample, title: 'IconButton' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Input' onClick={() => this.setState({ Component: TblInputSample, title: 'Input' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='CheckBox' onClick={() => this.setState({ Component: CheckBoxSample, title: 'CheckBox' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Radio' onClick={() => this.setState({ Component: RadioSample, title: 'Radio' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Drawer' onClick={() => this.setState({ Component: DrawerSample, title: 'Drawer' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Dialog' onClick={() => this.setState({ Component: TblDialogSample, title: 'Dialog' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='List' onClick={() => this.setState({ Component: TblTable, title: 'List' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Select' onClick={() => this.setState({ Component: TblSelect, title: 'Select' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Tabs' onClick={() => this.setState({ Component: TblTabs, title: 'Tabs' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Notification' onClick={() => this.setState({ Component: NotificationSample, title: 'Notification' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Expansion Panel' onClick={() => this.setState({ Component: TblExpansionPanel, title: 'Expansion Panel' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Autocomplete' onClick={() => this.setState({ Component: TblAutocompleteSample, title: 'Autocomplete' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Calendar' onClick={() => this.setState({ Component: TblCalendar, title: 'Calendar' })} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Preview File' onClick={() => this.setState({ Component: PreviewFileSample, title: 'Preview File' })} />
            </ListItem>
          </div>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Component />
            </Grid>
          </Grid>
        </Container>
      </main>
    </div >;
  }
}
Sample.propTypes = {
  classes: PropTypes.object
};
export default withStyles(styles)(Sample);
