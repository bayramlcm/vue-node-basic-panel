import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store'

import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/accountList',
    name: 'accountList',
    component: () => import('../views/AccountList.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // NOTE: Giriş kontrolleri
  if ('/login' === to.path.toLowerCase()) {
    store.dispatch('accountLoginCheck').then(() => {
      router.push('/');
      next();
    }).catch(() => next())
  } else if ('/logout' === to.path.toLowerCase()) {
    // Çıkış yap
    store.dispatch('accountLogout');
    router.push('/login')
    next();
  } else {
    store.dispatch('accountLoginCheck').then(() => {
      next();
    }).catch(() => {
      router.push('/login');
      next();
    })
  }
});

export default router;
