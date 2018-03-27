/* eslint-disable no-shadow */
const state = {
  token: localStorage.getItem('datashop_token') || '',
  routerPath: '',
  userInfo: JSON.parse(localStorage.getItem('datashop_userInfo') || '{}') || '',
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
};
const actions = {};
const getters = {
  userInfo: state => state.userInfo,
};

export default {
  state,
  mutations,
  actions,
  getters,
};