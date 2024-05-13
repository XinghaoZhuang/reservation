import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export const mutations = {
  updateLoginStatus(state, data) {
    state.loginStatus = data;
  }
};

export const actions = {
  async fetchLoginStatus({ commit }) {
    try {
      const resp = await axios.get('/api/auth/login');
      commit('updateLoginStatus', resp.data);
    } catch (e) {
      commit('updateLoginStatus', null);
    }
  }
}

export default new Vuex.Store({
  state: {
    loginStatus: null,
  },
  mutations,
  actions,
})