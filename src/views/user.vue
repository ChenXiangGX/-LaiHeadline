<template>
  <div class="user">
    <div class="user_t" v-if="isLogin">
      <div class="ll">
        <div class="use_l">
          <img :src="userInfo.avatar" alt="" />
          <span>
            {{ userInfo.nickname }}
          </span>
        </div>
        <div class="use_r"><router-link to="/information" class="home-header-serch">编辑资料</router-link></div>
      </div>
      <div class="use_b">
        <div class="use_b_l">
          <span>{{ publish_num }}</span>
          <span>头条</span>
        </div>
        <div class="use_b_r">
          <span>{{ liked_num }}</span>
          <span>获赞</span>
        </div>
      </div>
    </div>

    <div class="not-login" v-else>
      <div>
        <img class="mobile" src="@/assets/tel.png" />
      </div>
      <div class="text"><span @click="loginzi">登录</span> / <span @click="regzi">注册</span></div>
    </div>
    <!-- <div class="grrr"></div> -->

    <div class="grid">
      <van-grid clickable :column-num="2">
        <van-grid-item to="/ls"><van-icon name="star-o" size="20" color="#f27f98" />收藏</van-grid-item>
        <van-grid-item to=""> <van-icon size="20" color="#f27f98" name="underway-o" />历史</van-grid-item>
      </van-grid>
    </div>
    <div class="cell">
      <van-cell class="cell" @click="tiao" title="修改密码" is-link />
      <van-cell title="联系我们" is-link />
      <van-cell title="关于我们" is-link />
    </div>
    <van-button type="primary" block>注销账号</van-button>
    <BomViem></BomViem>
  </div>
</template>
<script>
import BomViem from "../components/BomViem.vue";
import { mapState, mapMutations } from "vuex";
import Vue from "vue";
// import BomViem from "../components/BomViem.vue";
import { Grid, GridItem } from "vant";
import { Icon } from "vant";
import { Cell, CellGroup } from "vant";

Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Icon);
Vue.use(Grid);
Vue.use(GridItem);
export default {
  name: "user",
  computed: {
    aa() {
      return this.$store.state.uid;
    },
    //相当于封装一个函数传入一个数组，返回值为一个对象(放的是处理的数组形成的方法)...解构对象把方法放到计算属性里类似上面写法
    ...mapState(["uid", "token", "isLogin", "userInfo"]),
  },
  data() {
    return {
      // userInfo: {},
      publish_num: 0,
      liked_num: 0,
    };
  },
  methods: {
    // ...mapMutations(["clear"]),
    loginzi() {
      this.$router.push("/login");
    },
    regzi() {
      this.$router.push("/reg");
    },
    remove() {
      this.$store.commit("clear");
    },
    tiao() {
      this.$router.push("/mima");
    },
  },

  components: {
    BomViem,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.anme]: CellGroup,
  },
};
</script>
<style lang="less">
.user {
  width: 375px;
  background-color: #f5f7f9;
  .grid {
    margin-bottom: 5px;
  }
  .cell {
    margin-bottom: 6px;
  }
  .user_t {
    height: 120px;
    background: green;
    // img {
    //   width: 46px;
    //   height: 46px;
    //   border-radius: 23px;
    //   background-color: white;
    // }
    // display: flex;

    // justify-content: space-between;
    padding: 0px 5px;
    align-items: center;
    .ll {
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .use_l {
        display: flex;
        align-items: center;
        img {
          display: inline-block;
          width: 60px;
          height: 60px;
          background-color: #fff;
          border-radius: 30px;
        }
      }
      .use_r {
        .home-header-serch {
          // color: #fff;
          display: inline-block;
          padding: 3px 10px;
          border-radius: 9px;
          background-color: #42a123;
        }
        span {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 9px;
          background-color: #fff;
        }
      }
    }
    .use_b {
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
      color: white;
      .use_b_l {
        display: flex;
        flex-direction: column;
      }
      .use_b_r {
        display: flex;
        flex-direction: column;
      }
    }
  }
  .not-login {
    height: 180px;
    background: url("@/assets/banner.jpg") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .mobile {
      width: 66px;
      height: 66px;
    }

    .text {
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
