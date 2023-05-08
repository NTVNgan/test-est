export default [
    {
        path: '/article',
        redirect: { name: 'Article' },
        component: () => import(/* webpackChunkName: "Article" */ '@/modules/article/views/Article.vue'),
        children: [
            {
                path: 'list',
                name: 'Article',
                component: () =>
                    import(/* webpackChunkName: "ArticleSample" */ '@/modules/article/views/ArticleList.vue'),
            },
            {
                path: 'create',
                name: 'ArticleCreate',
                component: () =>
                    import(
                        /* webpackChunkName: "ArticleCreate" */ '@/modules/article/views/ArticleListCreate.vue'
                    ),
            },
            {
                path: 'edit/:id',
                name: 'ArticleEdit',
                component: () =>
                    import(
                        /* webpackChunkName: "ArticleCreate" */ '@/modules/article/views/ArticleListEdit.vue'
                    ),
            },
        ],
    },
];