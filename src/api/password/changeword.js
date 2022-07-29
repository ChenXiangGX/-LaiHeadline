import axios from "../index"; //这是被加工过的axios

//直接修改密码
export function changeword(params) {
  return axios.post("/user/updatePwd", params);
}
//发送修改密码的验证码
export function forgetSends(params) {
  return axios.post("/user/sendSms", params);
}
//修改密码
export function setPassword(params) {
  return axios.post("/user/forget", params);
}
