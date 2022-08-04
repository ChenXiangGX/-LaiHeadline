<template>
  <div class="login">
    <van-nav-bar title="登录" left-arrow @click-left="onClickLeft" />

    <van-form @submit="onSubmit" ref="regForm">
      <van-field
        v-model="username"
        name="username"
        label="手机号"
        placeholder="请输入手机号"
        :rules="[
          { required: true, message: '请填写手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' },
        ]"
      />

      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[
          { required: true, message: '请填写密码' },
          { validator: (e) => /^\w{6,12}$/.test(e), message: '密码格式错误' },
        ]"
      />
      <div class="mima_r"><router-link to="/forget">忘记密码</router-link></div>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/home.js';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    //登录
    onSubmit(values) {
      // console.log("submit", values);
      login(values)
        .then((res) => {
          // console.log(res);

          if (res.code == 0) {
            let { token, tokenExpired } = res;
            localStorage.setItem('username', res.username);
            localStorage.setItem('uid', res.uid);
            localStorage.setItem('token', res.token);
            localStorage.setItem('userInfo', JSON.stringify(res.userInfo));
            localStorage.setItem('tokenExpired', tokenExpired);
            // 存到vuex
            // let { token, userInfo, uid } = res;
            // this.$store.commit("change", { key: "token", value: token });
            // this.$store.commit("change", { key: "userInfo", value: userInfo });
            // this.$store.commit("change", { key: "uid", value: uid });
            this.$store.commit('change', { key: 'isLogin', value: true });
            //直接方法替代
            this.$store.dispatch('getUserInfo', token);

            setTimeout(() => {
              this.$router.back();
            }, 1000);
          } else {
            this.$toast(res.msg);
          }
        })
        .catch((err) => {});
    },
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less">
.login {
  .mima_r {
    a {
      color: #1989fa;
    }
    text-align: right;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    // color: black;
    .router-link-active {
      color: rgb(218, 215, 215);
      line-height: 20px;
    }
  }
}
</style>
