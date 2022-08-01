import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import login from '../views/login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      keep: true,
    },
  },
  {
    path: '/reg',
    name: 'reg',
    component: () => import(/* webpackChunkName: "about" */ '../views/reg.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/user',
    name: 'user',

    component: () => import(/* webpackChunkName: "about" */ '../views/userinfo/user.vue'),
    meta: {
      keep: true,
    },
  },
  {
    path: '/study',
    name: 'study',

    component: () => import(/* webpackChunkName: "about" */ '../views/study.vue'),
  },
  {
    path: '/edit',
    name: 'edit',

    component: () => import(/* webpackChunkName: "about" */ '../views/edit.vue'),
    meta: {
      keep: true,
    },
  },
  {
    path: '/fabu',
    name: 'fabu',

    component: () => import(/* webpackChunkName: "about" */ '../views/fabu.vue'),
    meta: {
      keep: true,
    },
  },
  {
    path: '/change',
    name: 'change',
    component: () => import(/* webpackChunkName: "about" */ '../views/password/change.vue'),
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import(/* webpackChunkName: "about" */ '../views/forget/forget.vue'),
  },
  // 搜索
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "about" */ '../views/search/search.vue'),
  },
  //搜索列表页
  {
    path: '/seachList',
    name: 'seachList',
    component: () => import(/* webpackChunkName: "about" */ '../views/search/list.vue'),
  },
  //详情页
  {
    path: '/artice',
    name: 'artice',
    component: () => import(/* webpackChunkName: "about" */ '../views/artice/article.vue'),
  },
  //收藏
  {
    path: '/collection',
    name: 'collection',
    component: () => import(/* webpackChunkName: "about" */ '../views/collection/collection.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
