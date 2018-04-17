
export default [
  {
    path: '/interface',
    name: 'MyInterface',
    redirect: '/interface/list',
    component: () => import('@/views/my-interface/Layout'),
    meta: { title: '接口管理' },
    children: [
        {
            path: '/interface/list',
            name: 'InterFaceList',
            component: () => import('@/views/my-interface/list/Layout'),
            meta: { title: '接口列表' },
        },
        {
            path: '/interface/edite/:id',
            name: 'InterfaceCreate',
            component: () => import('@/views/my-interface/edite/Layout'),
            meta: { title: '创建接口' },
        },
    ],
  },
];