export default [
    {
        path: '/report',
        redirect: { name: 'ReportSample' },
        component: () => import(/* webpackChunkName: "Report" */ '@/modules/report/views/Report.vue'),
        children: [
            {
                path: 'sample',
                name: 'ReportSample',
                component: () =>
                    import(/* webpackChunkName: "ReportSample" */ '@/modules/report/views/ReportSample.vue'),
            },
        ],
    },
];