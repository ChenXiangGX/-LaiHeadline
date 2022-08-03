<template>
  <div class="list">
    <van-nav-bar fixed title="搜索列表页" left-arrow @click-left="$router.back()" />

    <div class="box" style="padding-bottom: 50px">
      <ul>
        <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList">
            <!-- immediate-check是因为默认为true直接执行一次 -->
            <li
              class="box"
              v-for="(item, index) in list"
              :key="index"
              @click="
                $router.push({
                  path: '/artice',
                  query: {
                    article_id: item._id,
                    title: item.title,
                  },
                })
              "
            >
              <!-- 两张图以上 -->
              <div class="info" v-if="item.imageSrc.length >= 2">
                <h3>
                  {{ item.title }}
                </h3>
                <div
                  class="imgs"
                  :class="{
                    one: item.imageSrc.length == 1,
                    two: item.imageSrc.length == 2,
                    three: item.imageSrc.length == 3,
                  }"
                >
                  <img v-for="(v, i) in item.imageSrc" :src="v" alt="" :key="i" />
                </div>

                <div class="bb">
                  <span> 发布人{{ item.author }} </span>
                  <span> 时间 {{ item.time | formatDate }} </span>
                </div>
              </div>
              <!-- 一张图 -->
              <div class="info" v-else>
                <div
                  class="imgs"
                  :class="{
                    one: item.imageSrc.length == 1,
                    two: item.imageSrc.length == 2,
                    three: item.imageSrc.length == 3,
                  }"
                >
                  <h3>
                    {{ item.title }}
                  </h3>
                  <img v-for="(v, i) in item.imageSrc" :src="v" alt="" :key="i" />
                </div>
                <div class="bb">
                  <span> 发布人{{ item.author }} </span>
                  <span> 时间 {{ item.time | formatDate }} </span>
                </div>
              </div>
            </li>
          </van-list>
        </van-pull-refresh>
      </ul>
    </div>
  </div>
</template>

<script>
import { List, PullRefresh } from 'vant';
import { search } from '@/api/home.js';
export default {
  data() {
    return {
      //下拉加载
      loading: false,
      //数据是否全部加载完成
      finished: false,

      skip: 0,
      limit: 10,

      isRefresh: false,
      list: [],

      key_word: '',
    };
  },
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
        return y + '-' + MM + '-' + d;
      }
    },
  },
  created() {
    // console.log(this.$route.query.key_word);
    this.key_word = this.$route.query.key_word;
  },
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
  },
  methods: {
    getList(flag) {
      let { key_word, limit, skip } = this;
      search({
        key_word,
        limit,
        skip,
      })
        .then((res) => {
          // console.log(res);
          if (res.code == 0) {
            if (flag) {
              this.list = res.data;
              this.isRefresh = false;
            } else {
              this.list.push(...res.data);
            }

            let len = this.list.length;

            if (len >= res.count) {
              this.finished = true;
            } else {
              this.loading = false;
              this.skip = len;
            }
          }
        })
        .catch((err) => {});
    },
    onRefresh() {
      this.skip = 0;
      this.finished = false;
      this.getList(true);
    },
  },
};
</script>

<style lang="less" scoped>
.list {
  ::v-deep .van-nav-bar .van-icon {
    color: black;
  }
  ::v-deep .van-nav-bar {
    background-color: #caded554;
  }
  div.box {
    // width: 100%;
    // height: 100px;
    ul {
      .van-list {
        margin-top: 50px;
        display: flex;
        flex-wrap: wrap;
        width: 375px;
        li {
          width: 100%;
          margin: 8px 0;

          .info {
            .imgs {
              display: flex;
              img {
                padding: 6px;
                width: 100px;
                max-height: 100px;
              }
            }
            .imgs.one {
              display: flex;
              justify-content: space-between;
              img {
                padding: 6px;
                width: 30%;
              }
            }
            .imgs.three {
              display: flex;
              justify-content: space-between;
              img {
                padding: 6px;
                width: 33%;
              }
            }
            .imgs.two {
              display: flex;
              justify-content: space-between;
              img {
                padding: 6px;
                width: 45%;
              }
            }
            div.bb {
              display: flex;
              align-items: center;
              span:nth-child(1) {
                margin-right: 30px;
              }

              span {
                color: #ccc;
              }
            }
            div > span:first-child,
            h3 {
              text-align: center;
              // overflow: hidden;
              // text-overflow: ellipsis;
              /*css代码：*/
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2; /*行数*/
              -webkit-box-orient: vertical;
              height: 100%;
              margin: 0;
              // width: 80%;
              line-height: 10vw;
              white-space: wrap;
            }
          }
        }
      }
      // overflow: hidden;
      // height: 100px;
    }
    // img {
    //   width: 80px;
    //   height: 80px;
    // }
  }
}
</style>
