export default [
    {
        path: '/my-system',
        name: 'MySystem',
        component: () => import('@/views/my-system/Layout'),
        meta: { title: '我的项目' },
    },
    {
        path: '/my-interface',
        name: 'MyInterface',
        redirect: '/my-interface/list',
        component: () => import('@/views/my-interface/Layout'),
        meta: { title: '接口管理' },
        children: [
            {
                path: '/my-interface/list',
                name: 'InterFaceList',
                component: () => import('@/views/my-interface/list/Layout'),
                meta: { title: '接口列表' },
            },
            {
                path: '/my-interface/edite/:id',
                name: 'InterfaceCreate',
                component: () => import('@/views/my-interface/edite/Layout'),
                meta: { title: '创建接口' },
            },
        ],
    },
];