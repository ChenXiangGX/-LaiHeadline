<template>
  <div class="ls">
    <div>
      <van-nav-bar left-text="返回" left-arrow @click-left="go">
        <template #title> 收藏列表</template>
      </van-nav-bar>
    </div>
    <div class="box">
      <!-- <p>{{ item.title }}</p>
      <img :src="" alt="" /> -->

      <ul>
        <li class="box" v-for="(item, index) in lists" :key="index" @click="to(item)">
          <div class="info">
            <h3>
              {{ item.title }}
            </h3>
            <div class="imgs">
              <img v-for="(v, i) in item.imageSrc" :src="v" alt="" :key="i" />
            </div>

            <div>
              <span> 评论人{{ item.author }} </span>
              <span> 时间 {{ item.time | formatDate }} </span>
              <span @click.stop="quxiao(item, index)"> 取消收藏 </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { get_fav_list, remove_fav } from '@/api/home';
import { mapState } from 'vuex';
export default {
  filters: {
    formatDate: function (value) {
      // 时间戳转换日期格式方法
      if (value == null) {
        return '';
      } else {
        let date = new Date(value);
        let y = date.getFullYear(); // 年
        let MM = date.getMonth() + 1; // 月
        MM = MM < 10 ? '0' + MM : MM;
        let d = date.getDate(); // 日
        d = d < 10 ? '0' + d : d;
        // let h = date.getHours(); // 时
        // h = h < 10 ? "0" + h : h;
        // let m = date.getMinutes(); // 分
        // m = m < 10 ? "0" + m : m;
        // let s = date.getSeconds(); // 秒
        // s = s < 10 ? "0" + s : s;
        // return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
        return y + '-' + MM + '-' + d;
      }
    },
  },
  computed: {
    ...mapState(['uid']),
  },
  data() {
    return {
      lists: [],
    };
  },
  methods: {
    //
    to(item) {
      // console.log(item);
      this.$router.push({
        path: '/artice',
        query: {
          title: item.title,
          article_id: item._id,
        },
      });
    },
    go() {
      this.$router.go(-1);
    },
    //取消收藏
    quxiao(item, index) {
      let { uid: user_id } = this;
      let { _id: article_id } = this.lists[index];
      this.lists.splice(index, 1);
      remove_fav({
        user_id,
        article_id,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {});
    },
  },
  mounted() {
    let { uid } = this;
    get_fav_list({
      limit: '',
      skip: '',
      user_id: uid,
    }).then((res) => {
      // console.log(res);
      this.lists = res.data;
    });
  },
};
</script>

<style lang="less" scoped>
.ls {
  ::v-deep .van-nav-bar {
    background-color: #3288de;
  }
  ::v-deep .van-nav-bar .van-icon {
    color: black;
  }
  ::v-deep .van-nav-bar__text {
    color: black;
  }
  div.box {
    width: 100%;
    // height: 100px;
    ul {
      display: flex;
      flex-wrap: wrap;
      // overflow: hidden;
      // height: 100px;
      li {
        width: 100%;
        margin: 8px 0;
        // width: 33%;
        // flex: 1;
        // img {
        //   width: 80px;
        //   height: 80px;
        // }
        .info {
          .imgs {
            display: flex;
            // justify-content: space-around;
            img {
              padding: 6px;
              width: 30%;
              height: 100px;
              // height: 110px;
            }
          }
          div {
            display: flex;
            span:nth-child(1) {
              margin-right: 10px;
            }
            // justify-content: space-around;
            span {
              color: #ccc;
            }
          }
          div > span:first-child {
            width: 100px;
          }
          div > span:first-child,
          h3 {
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;

            white-space: nowrap;
          }
          div > span:last-child {
            margin-left: 20px;
          }
        }
      }
    }
    // img {
    //   width: 80px;
    //   height: 80px;
    // }
  }
}
</style>
