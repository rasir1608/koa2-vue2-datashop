import axios from 'axios';
import store from '../store';

axios.interceptors.request.use(
    (config) => {
        if (store.state.auth.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `Bearer ${store.state.auth.token}`;
        }
        return config;
    },
    err => Promise.reject(err));
 
// http response 拦截器
axios.interceptors.response.use(
    (response) => {
      if (response.data.code === 401) {
        store.commit('LOGOUT');
        window.location.href = '#/user/login';
      }
      return response.data;
    },
    error => Promise.reject(error.response.data));

export default axios;