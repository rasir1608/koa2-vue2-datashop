/* eslint-disable no-shadow */
import { Message } from 'element-ui';
import axios from '../http';

const state = {
 mySystemList: JSON.parse(localStorage.getItem('datashop_systemList') || JSON.stringify([])),
};
const mutations = {
  SET_MY_SYSTEM_LIST(state, list) {
    state.mySystemList = list || [];
    localStorage.setItem('datashop_systemList', JSON.stringify(state.mySystemList));
  },
};
const actions = {
  async getMySystemList({ commit }, userRid) {
    const list = await axios.get('/system/operatorSystems', { params: { userRid } });
    if (list.ok) {
      commit('SET_MY_SYSTEM_LIST', list.data);
    } else {
      Message.error(list.msg || '获取项目列表失败');
      commit('SET_MY_SYSTEM_LIST', []);
    }
  },
};
const getters = {
  mySystemList: state => state.mySystemList,
};

export default {
  state,
  mutations,
  actions,
  getters,
};