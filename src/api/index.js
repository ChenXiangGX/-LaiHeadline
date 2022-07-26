import axios from "axios";

axios.defaults.baseURL = "https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http";

// axios的拦截器

// 请求拦截
axios.interceptors.request.use(
  (config) => {
    // console.log(config);
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截
axios.interceptors.response.use(
  (config) => {
    // console.log(config);
    //只让他返回res对象里的data
    return config.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axios;
