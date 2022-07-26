import axios from "../index"; //这是被加工过的axios
export function addArticle(params) {
  return axios.post("/api/add_article", params);
}
//获取上传七牛云上传token
export function getUploadToken() {
  return axios.get("upload/token");
}
//上传七牛云
export function uploadQiniu(formData) {
  return axios.post("https://upload-z1.qiniup.com", formData);
}
