import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import loginPage from './components/login-page.vue';
import registerPage from './components/register-page.vue';
import reservationList from './components/reservation-list.vue';
import reservationDetail from './components/reservation-detail.vue';
Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: loginPage,
      meta: {
        title: '登录',
      }
    },
    {
      path: '/register',
      name: 'register',
      component: registerPage,
      meta: {
        title: '注册',
      },
    },
    {
      path: '/reservation',
      name: 'reservation-list',
      component: reservationList,
      meta: {
        title: '预约列表',
        loginRequired: true,
      },
    },
    {
      path: '/reservation/:id',
      name: 'reservation-detail',
      component: reservationDetail,
      meta: {
        title: '预约详情',
        loginRequired: true,
      },
    },
    {
      path: '*',
      redirect: '/login',
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.loginRequired) {
    if (store.state.loginStatus) {
      next();
    } else {
      next({
        path: '/login',
      });
    }
  } else {
    if (store.state.loginStatus) {
      next({
        path: '/reservation',
      });
    } else {
      next();
    }
  }
});

export default router;