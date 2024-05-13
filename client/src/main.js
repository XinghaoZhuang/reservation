import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;


(async function() {
  await store.dispatch('fetchLoginStatus')
  try {
    new Vue({
      render: h => h(App),
      store,
      router,
    }).$mount('#app');
  } catch (e) {
    console.log(e)
  }
})()
