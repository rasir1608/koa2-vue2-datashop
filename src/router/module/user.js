export default [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/Layout'),
        meta: { title: '登陆' },
    },
    {
        path: '/logout',
        name: 'Logout',
        component: () => import('@/views/logout/Layout'),
        meta: { title: '登出' },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/register/Layout'),
        meta: { title: '账号注册' },
    },
    {
        path: '/mine',
        name: 'Mine',
        component: () => import('@/views/mine/Layout'),
        meta: { title: '个人信息' },
    },
];