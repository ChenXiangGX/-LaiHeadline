import axios from "./index"; //这是被加工过的axios

//获取分类
export function get_cate_list() {
  return axios.post("/api/get_cate_list");
}
export function addArticle(params) {
  return axios.post("/api/add_article", params);
}
//获取文章列表
// export function get_article_list(params) {
//   return axios.post("/api/get_article_list", params);
// }

//get方法 params会直接把参数拼接在url后
export function get_article_list(params) {
  return axios.get("/api/get_article_list", { params });
}

export function login(params) {
  return axios.post("/user/login", params);
}

export function reg(params) {
  return axios.post("/user/reg", params);
}

export function sendSms(params) {
  return axios.post("/user/sendSms", params);
}

export function delete_user(params) {
  return axios.post("/user/delete_user", params);
}

export function getUserInfo(params) {
  return axios.post("/user/getuserInfo", params);
}
export function editUserInfo(params) {
  return axios.post("/user/editUserInfo", params);
}
