import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
//引入方法，在actions里调用
import { getUserInfo } from "@/api/home";
import { get_cate_list } from "@/api/home";
export default new Vuex.Store({
  //放数据的
  state: {
    a: 1,
    uid: "",
    token: "",
    userInfo: {},
    isLogin: false,
    cate: [],
  },
  //vue里的计算属性
  getters: {},
  //改数据的
  mutations: {
    //配合commit
    //定义一个方法，store不要改，就是放数据的state
    changa(state, value) {
      state.a = value;
    },
    change(state, { key, value }) {
      state[key] = value;
    },
    clear(state) {
      state.uid = "";
      state.token = "";
      state.userInfo = {};
      state.isLogin = false;
    },
  },
  actions: {
    //配合dispatch  mainjs写了
    getUserInfo(json, token) {
      //在这里写异步

      //调用接口
      getUserInfo({ token })
        .then((res) => {
          console.log(res);

          //接着存起来
          json.commit("change", { key: "userInfo", value: res.userInfo });
          json.commit("change", { key: "uid", value: res.uid });
          json.commit("change", { key: "token", value: res.token });
        })
        .catch((err) => {});
      console.log(json, token);
    },
    getCate({ state, commit }) {
      get_cate_list()
        .then((res) => {
          commit("change", { key: "cate", value: res.data });
        })
        .catch((err) => {});
    },
  },
  modules: {},
});
