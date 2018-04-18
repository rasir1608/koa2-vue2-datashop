export default [
    {
        path: '/system',
        redirect: '/system/list',
        name: 'System',
        component: () => import('@/views/system/Layout'),
        meta: { title: '项目' },
        children: [
          {
            path: '/system/manage',
            name: 'SystemManage',
            component: () => import('@/views/system/manage/Layout'),
            meta: { title: '项目管理' },
          },
          {
            path: '/system/list',
            name: 'SystemList',
            component: () => import('@/views/system/list/Layout'),
            meta: { title: '项目列表' },
          },
        ],
    },
];