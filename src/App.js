import React from 'react';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';

import withStyles from '@mui/styles/withStyles';
import { AdapterMoment as DateAdapter } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { BreadcrumbProvider } from 'components/TblBreadcrumb';
import ErrorPage from 'components/TblErrorPage';
import BlockThirdPartyErrorPage from 'components/TblErrorPage/BlockThirdPartyError';
import InternalError from 'components/TblErrorPage/InternalError';

import CurrentUser from 'shared/Auth/containers/CurrentUser';
import DomainStatus from 'shared/Auth/containers/DomainStatus';

import { createBrowserHistory as createHistory } from 'history';
import SwitchLayout, {Layout, LayoutProvider} from 'layout';
import { SnackbarProvider } from 'notistack';

import { AuthProvider, PrivateRoute, PublicRoute } from './AppRoute';
import globalStyles from './global.styled';
import NotificationProvider from './modules/Notifications/container/NotificationProvider';
import routes from './routes';
import GoogleEventListener from './shared/Google/container/GoogleEventListener';
import setupStore from './store';
import './yup';

const history = createHistory();
const store = setupStore();
// const routes = getRoutes();

function App() {

  const privateRoutes = [];
  const publicRoutes = [];

  for(let i = 0; i < routes.length; i++) {
    if (routes[i].private) {
      privateRoutes.push(routes[i]);
    } else {
      publicRoutes.push(routes[i]);
    }
  }
  
  return (
    <InternalError history={history}>
      <Provider store={store} >
      <LocalizationProvider dateAdapter={DateAdapter} >

        {/* <MuiPickersUtilsProvider utils={TabulaMomentUtils}> */}
          <AuthProvider >
            <CurrentUser />
            <DomainStatus >
              <Router history={history}>

                  <LayoutProvider>
                  <BreadcrumbProvider>
                    <SnackbarProvider maxSnack={3}>
                    <GoogleEventListener>

                    <NotificationProvider>
                      <Layout routes={routes}>
                        <SwitchLayout routes={privateRoutes}>
                            {privateRoutes.map((route, index) => (
                              <PrivateRoute key={index}
                                  path={route.path}
                                  exact={route.exact}
                                  routerRoles={route.roles}
                                  component={route.component}
                                  routes={route.routes}
                                  isPublic={!route.private}
                                  external={route.external}
                              />))
                            }
                            {publicRoutes.map((route, index) => (
                              <PublicRoute 
                                component={route.component}
                                  path={route.path}
                                  exact={route.exact}
                                  routes={route.routes}
                                  isPublic={!route.private}
                                  external={route.external}
                                  key={index}/>))
                          }
                          <Route path='/block-third-party' component={BlockThirdPartyErrorPage} isPublic={true}/>
                          <Route path='*' component={ErrorPage} isPublic={true} />
                          
                        </SwitchLayout>
                      </Layout>
                      </NotificationProvider>
                      </GoogleEventListener>

                    </SnackbarProvider>
                    </BreadcrumbProvider>
                  </LayoutProvider>
              </Router>
            </DomainStatus>
          </AuthProvider>
          </LocalizationProvider>
        {/* </MuiPickersUtilsProvider> */}
      </Provider>
    </InternalError>
  );
};
export default withStyles(globalStyles)(App);
