import Vue from 'vue';
import 'vue-awesome/icons/flag';
import 'vue-awesome/icons';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import Icon from 'vue-awesome/components/Icon';
import $axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import store from './store'; 
import router from './router';

Vue.use(iView);
Vue.prototype.$axios = $axios;
Vue.component('icon', Icon);
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});