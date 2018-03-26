/* eslint-disable no-shadow */
const state = {
  token: '' || localStorage.getItem('datashop_token'),
  routerPath: '',
};
const mutations = {
  ROUTER_PATH(state, path) {
    state.routerPath = path;
  },
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('datashop_token', state.token);
  },
};
const actions = {};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};