/* eslint-disable no-shadow */
const state = {
  userId: '2222',
  routerPath: '',
};
const mutations = {
  ROUTER_PATH(state, path) {
    state.routerPath = path;
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