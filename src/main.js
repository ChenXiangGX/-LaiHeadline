import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import axios from "axios";
Vue.config.productionTip = false;
import '@/comon/iconfont'; //引入iconfontjs
import '@/components/vant';
// 配置axios

// axios.defaults.baseURL = "https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http/";
// Vue.prototype.$http = axios;

//为了解决评论列表下拉加载
let windowHeight = document.documentElement.scrollHeight;
//定义全局的颜色变量  less里的只能在css里使用
//vue的混入

import mixin from '@/comon/mixins'; // 全局混入
Vue.mixin(mixin);
Vue.mixin({
  data() {
    return {
      basegreen: 'red',
      windowHeight: windowHeight + 'px',
    };
  },
  methods: {
    //频繁用到这里封装
    checkLogin(url = '/login', msg = '请先登录', t = 500) {
      if (!this.$store.state.uid) {
        this.$toast(msg);
        setTimeout((v) => {
          this.$router.push(url);
        }, t);
        return false;
      }
      return true;
    },
  },
});

let token = localStorage.getItem('token');
let tokenExpired = localStorage.getItem('tokenExpired');

// if (!token) {
//   //你是第一次进来，原来没登陆过
//   //自己玩去
//   router.push("/login");
// } else {
//   //有token说明原来登陆过
//   //拿着token可以去请求数据
//   store.dispatch("getUserInfo", token);
// }

// new Vue({
//   router,
//   store,
//   render: (h) => h(App),
// }).$mount("#app");

//在文章详情页，同步请求，这边用户请求还没完成，致使用户id没有，is_like等属性就没有
import init from '@/comon/init'; //  登录态维护
const app = new Vue({
  router,
  store,
  render: (h) => h(App),
});

init().then((res) => {
  app.$mount('#app');
});
