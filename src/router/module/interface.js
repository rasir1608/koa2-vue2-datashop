
export default [
  {
    path: '/interface',
    name: 'MyInterface',
    redirect: '/interface/list',
    component: () => import('@/views/interface/Layout'),
    meta: { title: '接口管理' },
    children: [
        {
            path: '/interface/list',
            name: 'InterFaceList',
            component: () => import('@/views/interface/list/Layout'),
            meta: { title: '接口列表' },
        },
        {
            path: '/interface/edite/:id',
            name: 'InterfaceEdite',
            component: () => import('@/views/interface/edite/Layout'),
            meta: { title: '接口编辑' },
        },
    ],
  },
];