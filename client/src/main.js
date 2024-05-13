import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'
import apolloProvider from './apollo'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'


Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(ElementUI);


(async function() {
  await store.dispatch('fetchLoginStatus')
  try {
    new Vue({
      render: h => h(App),
      store,
      router,
      apolloProvider,
    }).$mount('#app');
  } catch (e) {
    console.log(e)
  }
})()
