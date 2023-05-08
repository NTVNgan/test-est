export default [
    {
        path: '/outbound',
        redirect: { name: 'OutboundSample' },
        component: () => import(/* webpackChunkName: "Outbound" */ '@/modules/outbound/views/Outbound.vue'),
        children: [
            {
                path: 'sample',
                name: 'OutboundSample',
                component: () =>
                    import(/* webpackChunkName: "OutboundSample" */ '@/modules/outbound/views/OutboundSample.vue'),
            },
        ],
    },
];