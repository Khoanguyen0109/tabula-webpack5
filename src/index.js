import './wdyr';
import './polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import * as Sentry from '@sentry/browser';

import App from './App';
import * as serviceWorker from './serviceWorker';
import theme from './theme';
import './i18n';

// import icomoon css to use with Icon component in Material UI
import './assets/styles/icomoon/style.css';
// Perfect scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

if (process.env.NODE_ENV !== 'development')
  Sentry.init({ dsn: 'http://281d556b7fc746c1a61cd7df08c6fe3c@slog.filestring.net/4' });
ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// eslint-disable-next-line no-undef
serviceWorker.register();