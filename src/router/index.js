import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/reg",
    name: "reg",

    component: () => import(/* webpackChunkName: "about" */ "../views/reg.vue"),
  },
  {
    path: "/login",
    name: "login",

    component: () => import(/* webpackChunkName: "about" */ "../views/login.vue"),
  },
  {
    path: "/user",
    name: "user",

    component: () => import(/* webpackChunkName: "about" */ "../views/user.vue"),
  },
  {
    path: "/study",
    name: "study",

    component: () => import(/* webpackChunkName: "about" */ "../views/study.vue"),
  },
  {
    path: "/fabu",
    name: "fabu",

    component: () => import(/* webpackChunkName: "about" */ "../views/fabu.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
