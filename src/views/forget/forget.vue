<template>
  <div class="forget">
    <van-nav-bar left-text="返回" left-arrow @click-left="go">
      <template #title>
        <div class="nav-login">忘记密码</div>
      </template>
    </van-nav-bar>
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="手机号"
        label="手机号"
        placeholder="手机号"
        :rules="[{ required: true, message: '请填写手机号' }]"
      />

      <van-field
        v-model="vercode"
        name="验证码"
        type="number"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
      >
        <template #button>
          <van-button @click="aa" size="small" type="primary" native-type="button">发送验证码</van-button>
        </template></van-field
      >
      <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码" />

      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';
import { forgetSends, setPassword } from '@/api/password/changeword';

Vue.use(Form);
Vue.use(Field);
export default {
  data() {
    return {
      username: '',
      password: '',
      vercode: '',
    };
  },
  methods: {
    go() {
      this.$router.go(-1);
    },
    aa() {
      forgetSends({
        mobile: this.username,
        type: 'login',
      })
        .then((res) => {
          //   if (res.data.code === 1) {
          //     Toast.fail(res.data.msg);
          //     this.$router.push("/login");
          //   }
        })
        .catch((err) => {});
    },
    onSubmit(values) {
      console.log('submit', values);
      setPassword({
        username: this.username,
        password: this.password,
        vercode: this.vercode,
      })
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            this.$toast.fail(res.msg);
            setTimeout(() => {
              this.$router.push('/login');
            }, 1000);
          } else {
            this.$toast.fail(res.msg);
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="less" scoped>
.forget {
  .van-nav-bar__content {
    background-color: #07c160;
  }
  ::v-deep .van-nav-bar {
    background-color: #3288de;
  }
  ::v-deep .van-nav-bar .van-icon {
    color: black;
  }
  ::v-deep .van-nav-bar__text {
    color: black;
  }
  ::v-deep .van-button--primary {
    border-radius: 9px;
  }
}
</style>
>
