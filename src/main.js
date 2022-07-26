import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import axios from "axios";
Vue.config.productionTip = false;
import "@/comon/iconfont"; //引入iconfontjs
import "@/components/vant";
// 配置axios

// axios.defaults.baseURL = "https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http/";
// Vue.prototype.$http = axios;

//定义全局的颜色变量  less里的只能在css里使用
Vue.mixin({
  data() {
    return {
      basegreen: "red",
    };
  },
});

let token = localStorage.getItem("token");
if (!token) {
  //你是第一次进来，原来没登陆过
  //自己玩去
} else {
  //有token说明原来登陆过
  //拿着token可以去请求数据
  store.dispatch("getUserInfo", token);
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
