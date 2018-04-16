/* eslint-disable no-shadow */
import { Message } from 'element-ui';
import axios from '../http';

const state = {
 systemList: JSON.parse(localStorage.getItem('datashop_systemList') || JSON.stringify([])),
};
const mutations = {
  SET_SYSTEM_LIST(state, list) {
    state.systemList = list || [];
    localStorage.setItem('datashop_systemList', JSON.stringify(state.systemList));
  },
};
const actions = {
  async getSystemList({ commit }, userRid) {
    const list = await axios.get('/system/operatorSystems', { params: { userRid } });
    if (list.ok) {
      commit('SET_SYSTEM_LIST', list.data);
    } else {
      Message.error(list.msg || '获取系统列表失败');
      commit('SET_SYSTEM_LIST', []);
    }
  },
};
const getters = {
  systemList: state => state.systemList,
};

export default {
  state,
  mutations,
  actions,
  getters,
};