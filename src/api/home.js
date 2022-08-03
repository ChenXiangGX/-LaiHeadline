import axios from './index'; //这是被加工过的axios

//获取分类
export function get_cate_list() {
  return axios.post('/api/get_cate_list');
}
export function addArticle(params) {
  return axios.post('/api/add_article', params);
}
//获取
// export function get_article_list(params) {
//   return axios.post("/api/get_article_list", params);
// }
//文章列表
//get方法 params会直接把参数拼接在url后
export function get_article_list(params) {
  return axios.get('/api/get_article_list', { params });
}
//登录
export function login(params) {
  return axios.post('/user/login', params);
}
//注册
export function reg(params) {
  return axios.post('/user/reg', params);
}
//验证码
export function sendSms(params) {
  return axios.post('/user/sendSms', params);
}
//删除用户
export function delete_user(params) {
  return axios.post('/user/delete_user', params);
}
//获取用户信息
export function getUserInfo(params) {
  return axios.post('/user/getuserInfo', params);
}
//修改信息
export function editUserInfo(params) {
  return axios.post('/user/editUserInfo', params);
}
//搜索
export function search(params) {
  return axios.post('/api/search', params);
}
//文章详情
export function getArticleDetail(params) {
  return axios.post('/api/get_article_detail', params);
}
//收藏
export function add_fav(params) {
  return axios.post('/api/add_fav', params);
}
//取消收藏
export function remove_fav(params) {
  return axios.post('/api/remove_fav', params);
}
//点赞
export function like(params) {
  return axios.post('/api/like', params);
}
//取消点赞
export function unlike(params) {
  return axios.post('/api/unlike', params);
}
//评论列表
export function get_comment_list(params) {
  return axios.post('/api/get_comment_list', params);
}
//评论文章
export function addComment(params) {
  return axios.post('/api/add_comment', params);
}
//评论点赞
export function comment_like(params) {
  return axios.post('/api/comment_like', params);
}
//取消评论点赞
export function comment_unlike(params) {
  return axios.post('/api/comment_unlike', params);
}
//收藏列表
export function get_fav_list(params) {
  return axios.post('/api/get_fav_list', params);
}
//回复评论的列表

export function get_reply_list(params) {
  return axios.post('/api/get_reply_list', params);
}
//历史记录

export function get_history_list(params) {
  return axios.post('/api/get_history_list', params);
} //我的发布
export function get_user_article_list(params) {
  return axios.post('/api/get_user_article_list', params);
}
//删除发布
export function del_user_article(params) {
  return axios.post('/api/del_user_article', params);
}
