<template>
  <div class="mima">
    <van-nav-bar left-text="返回" left-arrow @click-left="go">
      <template #title>
        <div class="nav-login">修改密码</div>
      </template>
    </van-nav-bar>
    <van-form @submit="onSubmit">
      <van-field
        v-model="oldPassword"
        type="password"
        name="原密码"
        label="原密码"
        placeholder="原密码"
        :rules="[{ required: true, message: '请填写原密码' }]"
      />
      <van-field
        v-model="newPassword"
        type="password"
        name="新密码"
        label="新密码"
        placeholder="新密码"
        :rules="[{ required: true, message: '请填写新密码' }]"
      />
      <div class="mima_r"><router-link to="/forget">忘记密码</router-link></div>
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

import { Toast } from 'vant';
// import { changePassword } from "@/api/password/changePassword";
import { changeword } from '@/api/password/changeword';

Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
export default {
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      uid: '',
    };
  },

  watch: {
    //监听这个指定的值的变化
    // 让值最初时候watch就执行就用到了handler和immediate属性
    '$store.state.uid': {
      immediate: true,
      handler(n, o) {
        // console.log(n);
        // console.log(o);
        this.uid = n;
      },
    },
  },
  methods: {
    go() {
      this.$router.go(-1);
    },

    onSubmit(values) {
      //   console.log("submit", values);
      changeword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        uid: this.uid,
      })
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            this.$toast(res.msg);
            setTimeout(() => {
              this.$router.push('/login');
            }, 1000);
          } else {
            this.$toast(res.msg);
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="less" scoped>
.mima {
  // .van-nav-bar__content {
  //   background-color: #07c160;
  // }
  ::v-deep .van-nav-bar {
    background-color: #3288de;
  }
  ::v-deep .van-nav-bar .van-icon {
    color: black;
  }
  ::v-deep .van-nav-bar__text {
    color: black;
  }
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
