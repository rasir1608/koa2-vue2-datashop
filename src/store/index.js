import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const files = require.context('.', false, /\.js$/);
const modules = {};
files.keys().forEach((key) => {
  if (key !== './index.js') modules[key.replace(/(\.\/)|(\.js$)/g, '')] = files(key).default;
});
export default new Vuex.Store({
  modules,
});