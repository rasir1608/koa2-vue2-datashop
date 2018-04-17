export default [
    {
        path: '/system',
        redirect: '/system/list',
        name: 'System',
        component: () => import('@/views/system/Layout'),
        meta: { title: '我的项目' },
        children: [
          {
            path: '/system/edite/:id',
            name: 'SystemEdite',
            component: () => import('@/views/system/edite/Layout'),
            meta: { title: '接口列表' },
          },
          {
            path: '/system/list',
            name: 'SystemList',
            component: () => import('@/views/system/list/Layout'),
            meta: { title: '接口列表' },
          },
        ],
    },
];