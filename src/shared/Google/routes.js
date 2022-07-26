import GoogleOAuthPage from './container/GoogleOAuthPage';

const ROUTE_GOOGLE= {
    OAUTH: '/google-oauth'
};

export default [
    {
        path: ROUTE_GOOGLE.OAUTH,
        component: GoogleOAuthPage,
        exact: true
    },
 
];