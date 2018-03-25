import VueRouter from 'vue-router';
import Vue from 'vue';
import store from '../store';

const files = require.context('./module', false, /\.js$/);
let routes = [{
    path: '/',
    redirect: '/my-system',
}];
files.keys().forEach((key) => {
    routes = routes.concat(files(key).default || []);
});
console.log(routes);
Vue.use(VueRouter);
const router = new VueRouter({
    // mode: 'history',
    routes,
});
// router.beforeEach((to, form, next) => {
//     console.log(21, to.path);
//     if (['MySystem', 'MyInterface'].includes(to.name)) {
//         const token = sessionStorage.getItem('data-shop-token');
//         console.log(!token, 23);
//         if (!token) next('/login');
//     } else if (to.name === 'Login') {
//         sessionStorage.setItem('data-shop-token', '');
//         next();
//     } else {
//         next();
//     }
// });
router.afterEach((to) => {
    store.commit('ROUTER_PATH', to.path);
    let doc = '数据市场--';
    if (to.meta.title) {
        doc += to.meta.title;
    }
    document.title = doc;
});
export default router;