import VueRouter from 'vue-router';
import Vue from 'vue';
import store from '../store';

const files = require.context('./module', false, /\.js$/);
let routes = [{
    path: '/',
    redirect: '/system',
}];
files.keys().forEach((key) => {
    routes = routes.concat(files(key).default || []);
});
Vue.use(VueRouter);
const router = new VueRouter({
    // mode: 'history',
    routes,
});
router.beforeEach((to, form, next) => {
    if (!/^\/mine/.test(to.path)) {
        const token = store.state.auth.token;
        if (!token) next('/mine/login');
        else next();
    } else if (to.name === 'Logout') {
        store.commit('SET_TOKEN', '');
        next();
    } else {
        next();
    }
});
router.afterEach((to) => {
    store.commit('ROUTER_PATH', to.path);
    let doc = '数据市场--';
    if (to.meta.title) {
        doc += to.meta.title;
    }
    document.title = doc;
});
export default router;