<template>
  <div class="reg">
    <van-nav-bar title="注册" left-arrow @click-left="onClickLeft" />

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
        v-model="vercode"
        name="vercode"
        :rules="[
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}/, message: '验证码格式错误' },
        ]"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
      >
        <template #button>
          <van-button
            size="small"
            @click="sendSms"
            :loading="codeBtnLoading"
            loading-type="circular"
            native-type="button"
            :loading-text="code_text"
            :disabled="codeBtnDisabled"
            type="primary"
            >{{ code_text }}</van-button
          >
        </template>
      </van-field>

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
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { reg, sendSms } from '@/api/home.js';

export default {
  data() {
    return {
      username: '',
      password: '',
      vercode: '',
      codeBtnDisabled: false,
      code_text: '发送验证码',
      codeBtnLoading: false,
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    //注册
    onSubmit(values) {
      // console.log("submit", values);
      reg(values)
        .then((res) => {
          console.log(res);
          this.$router.push('/login');
        })
        .catch((err) => {});
    },
    //发送验证码
    async sendSms() {
      let validate_res = await this.$refs.regForm.validate('username');
      this.codeBtnDisabled = true;
      this.code_text = '发送中...';
      this.codeBtnLoading = true;
      sendSms({
        mobile: this.username,
        type: 'register',
      })
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            //发送成功
            this.$toast(`短信已经发送到手机号${this.username},请注意查收`);
            let count = 10;
            let timer = setInterval(() => {
              count--;
              this.code_text = `${count}s后再次获取`;
              if (count == 0) {
                clearInterval(timer);
                this.codeBtnDisabled = false;
                this.code_text = '再次发送';
                this.codeBtnLoading = false;
                count = 10;
              }
            }, 1000);
          } else {
            this.$toast(res.msg || '发送失败');
            this.codeBtnDisabled = false;
            this.code_text = '再次发送';
            this.codeBtnLoading = false;
          }
        })
        .catch((err) => {
          this.$toast(err.msg || '发送失败');
          this.codeBtnDisabled = false;
          this.code_text = '再次发送';
          this.codeBtnLoading = false;
        });
    },
  },
};
</script>
<style lang="less"></style>
