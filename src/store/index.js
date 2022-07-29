import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
//引入方法，在actions里调用
import { getUserInfo } from "@/api/home";
import { get_cate_list } from "@/api/home";
import { getUploadToken, uploadQiniu } from "@/api/qiniu/api";
export default new Vuex.Store({
  //放数据的
  state: {
    a: 1,
    uid: "",
    token: "",
    userInfo: {},
    isLogin: false,
    cate: [],
    liked_num: "",
    publish_num: "",
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
      state.liked_num = "";
      state.publish_num = "";
    },
  },
  actions: {
    //配合dispatch  mainjs写了
    getUserInfo(json, token) {
      //在这里写异步
      //调用接口
      getUserInfo({ token })
        .then((res) => {
          // console.log(res);

          //接着存起来
          json.commit("change", { key: "userInfo", value: res.userInfo });
          json.commit("change", { key: "uid", value: res.uid });
          json.commit("change", { key: "token", value: res.token });
          json.commit("change", { key: "publish_num", value: res.publish_num });
          json.commit("change", { key: "liked_num", value: res.liked_num });
        })
        .catch((err) => {});
      // console.log(json, token);
    },
    getCate({ state, commit }) {
      get_cate_list()
        .then((res) => {
          commit("change", { key: "cate", value: res.data });
        })
        .catch((err) => {});
    },

    ///  上传
    async upload(state, fileList) {
      let imageSrc = [];
      if (!fileList || !Array.isArray(fileList) || fileList.length === 0) {
        //没上传图片
        return imageSrc;
      }
      if (!fileList || fileList.length === 0) {
        //  没上传图片
        return imageSrc;
      }

      // 需要 循环
      //  多个异步任务都执行完成  返回他们完成后的结果
      //返回的是一个数组
      let task = fileList.map((v) => {
        return new Promise(async (resolve, reject) => {
          let { file } = v;
          let { type } = file;
          //  拿到类型  比如jpg image/jpg
          type = type.split("/")[1];
          // 重新命名  随机名字
          let file_name = `${new Date().getTime()}_${Math.random().toString(36).slice(2)}.${type}`;
          // 去服务器申请一个上传token

          let { token } = await getUploadToken();

          // console.log(token);

          const formdata = new FormData();
          formdata.append("file", file);
          formdata.append("token", token);
          formdata.append("key", file_name);

          uploadQiniu(formdata).then((res) => {
            console.log(res);
            resolve(`http://toutiao.longxiaokj.com/` + res.key);
          });
        });
      });
      console.log(task);
      // task  [promises,promise]
      //task为数组会依次执行
      imageSrc = await Promise.all(task);

      return imageSrc;
    },
  },
  modules: {},
});
