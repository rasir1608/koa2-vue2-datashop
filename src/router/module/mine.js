export default [
    {
        path: '/mine',
        name: 'Mine',
        component: () => import('@/views/mine/Layout'),
        meta: { title: '个人信息' },
        children: [
            {
                path: '/mine',
                redirect: '/mine/login',
            },
            {
                path: '/mine/login',
                name: 'Login',
                component: () => import('@/views/mine/login/Layout'),
                meta: { title: '登陆' },
            },
            {
                path: '/mine/logout',
                name: 'Logout',
                component: () => import('@/views/mine/logout/Layout'),
                meta: { title: '登出' },
            },
            {
                path: '/mine/register',
                name: 'Register',
                component: () => import('@/views/mine/register/Layout'),
                meta: { title: '账号注册' },
            },
        ],
    },
    
];