/* eslint-disable no-shadow */
import { Message } from 'element-ui';
import axios from '../http';

const state = {
  token: localStorage.getItem('datashop_token') || '',
  routerPath: '',
  userInfo: JSON.parse(localStorage.getItem('datashop_userInfo') || '{}') || '',
  userList: [],
};
const mutations = {
  ROUTER_PATH(state, path) {
    state.routerPath = path;
  },
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('datashop_token', state.token);
  },
  USER_INFO(state, userInfo) {
    if (userInfo === undefined) return;
    state.userInfo = userInfo;
    localStorage.setItem('datashop_userInfo', JSON.stringify(state.userInfo));
  },
  LOGOUT(state) {
    state.token = '';
    state.userInfo = {};
    localStorage.setItem('datashop_token', state.token);
    localStorage.setItem('datashop_userInfo', JSON.stringify(state.userInfo));
  },
  SET_USER_LIST(state, userList) {
    state.userList = userList || [];
  },
};
const actions = {
  async getUserList({ commit }, userName) {
    if (userName === '') {
      commit('SET_USER_LIST', []);
    } else {
      const userList = await axios.get('/userinfo/getUserListByName', { params: { userName } });
      if (userList.ok) {
        commit('SET_USER_LIST', userList.data);
      } else {
        commit('SET_USER_LIST', []);
        Message.error(userList.msg || '获取用户列表失败');
      }
    }
  },
  async getMyUserInfo({ commit }) {
    const ret = await axios.get('userinfo/userInfo');
    if (ret.ok) {
      commit('USER_INFO', ret.data);
    } else {
      commit('USER_INFO', []);
      Message.error(ret.msg || '获取用户信息失败');
    }
  },
};
const getters = {
  userInfo: state => state.userInfo,
  userList: (state) => {
    if (state.userInfo.rid) {
      const filteList = state.userList.length === 0 ? [] : state.userList.filter(u => u.rid !== state.userInfo.rid);
      return [].concat(state.userInfo, filteList);
    } 
      return state.userList;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};