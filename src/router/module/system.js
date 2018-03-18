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
        component: () => import('@/views/my-interface/Layout'),
        meta: { title: '接口管理' },
    },
];