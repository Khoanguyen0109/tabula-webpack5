import loadable from '@loadable/component';

const Sample = loadable(() => import('./sample'));
const Demo = loadable(() => import('./demo'));

export default [
    {
        path: '/ui-components',
        component: Sample,
        exact: true
    },
    {
        path: '/demo-ui-components',
        component: Demo,
        exact: true
    },
];