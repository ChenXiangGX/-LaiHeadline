<template>
  <div class="Home">
    <TopView></TopView>

    <!-- 顶部标签栏 -->
    <van-tabs v-model="active" @click="switchtab">
      <van-tab v-for="item in list" :key="item._id" :title="'' + item.name"></van-tab>
    </van-tabs>

    <div class="box" style="padding-bottom: 50px">
      <ul>
        <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :immediate-check="false"
            finished-text="没有更多了"
            @load="get_article_list"
          >
            <!-- immediate-check是因为默认为true直接执行一次 -->
            <li
              class="box"
              v-for="(item, index) in lists"
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
              <div class="info">
                <div
                  v-if="item.imageSrc.length == 1"
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
                  <div class="lr">
                    <img v-for="(v, i) in item.imageSrc" :src="v" alt="" :key="i" />
                  </div>
                </div>
                <div
                  v-else-if="item.imageSrc.length == 2"
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
                  <div class="lr">
                    <img v-for="(v, i) in item.imageSrc" :src="v" alt="" :key="i" />
                  </div>
                </div>
                <div
                  v-else-if="item.imageSrc.length == 3"
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
                  <div class="lr">
                    <img v-for="(v, i) in item.imageSrc" :src="v" alt="" :key="i" />
                  </div>
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
    <BomViem></BomViem>
  </div>
</template>

<script>
import BomViem from '../components/BomViem.vue';
import TopView from '../components/TopView.vue';
import { List, PullRefresh } from 'vant';
import Vue from 'vue';
import { Tabbar, TabbarItem } from 'vant';
Vue.use(Tabbar);
Vue.use(TabbarItem);

// 顶部标签栏Tab
import { Tab, Tabs } from 'vant';
import { get_cate_list, get_article_list } from '@/api/home.js';

export default {
  name: 'HomeFirst',
  data() {
    return {
      active: 0,
      list: [], //存放分类数据的
      lists: [],
      stry: '',
      //下拉加载
      loading: false,
      //数据是否全部加载完成
      finished: false,

      skip: 0,
      limit: 10,

      isRefresh: false,
    };
  },
  components: {
    BomViem,
    TopView,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
  },
  mounted() {
    this.getitem();
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
  methods: {
    onRefresh() {
      this.lists = [];
      this.skip = 0;
      this.finished = false;
      this.get_article_list(true);
    },
    //切换tab
    switchtab() {
      this.stry = this.list[this.active]._id;
      this.lists = [];
      this.skip = 0;
      this.finished = false;
      this.get_article_list();
    },
    get_article_list(flag) {
      let { stry, skip, limit } = this;
      get_article_list({
        cate_id: stry,
        skip,
        limit,
      }).then((res) => {
        // console.log(res);
        //toutiao.longxiaokj.com/
        res.data = res.data.map((v) => {
          if (v.imageSrc.length) {
            v.imageSrc = v.imageSrc.map((v) => {
              return v + '?imageslim';
            });
          }
          return v;
        });
        if (flag) {
          this.isRefresh = false;
          res.data.forEach((aa, i) => {
            if (aa.imageSrc.length > 0) {
              this.lists.push(aa);
            }
          });
        } else {
          // this.lists.push(...res.data);
          res.data.forEach((v, i) => {
            if (!v.imageSrc.length == 0) {
              this.lists.push(v);
            }
          });
          // res.data.forEach((aa, i) => {
          //   if (aa.imageSrc.length > 0) {
          //     aa.imageSrc.forEach((cc) => {
          //       if (!cc.includes(' ') && cc.includes('http://toutiao.longxiaokj.com/')) {
          //         this.lists.push(aa);
          //       }
          //     });
          //   }
          // });
        }

        let len = this.lists.length;

        if (len >= res.count) {
          this.finished = true;
        } else {
          this.skip = len; //skip更新
          this.loading = false;
        }
      });
    },
    getitem() {
      get_cate_list().then((res) => {
        this.list = res.data;
        this.stry = this.list[this.active]._id;
        this.get_article_list();
      });
    },
    wenzhang() {
      this.$router.push('/Wzdetail');
    },
  },
};
</script>

<style lang="less" scoped>
.Home {
  width: 375px;
  // ::v-deep .van-nav-bar .home-header-serch {
  //   background-color: #caded554 !important;
  // }
  ::v-deep .van-nav-bar {
    background-color: #50657a;
  }
  ::v-deep .van-tabs {
    position: fixed;
    z-index: 10;
    margin-top: -3px;
  }
  ::v-deep .box {
    margin-top: 27px;
  }
  .van-nav-bar__placeholder {
    height: 46.0125px !important;
  }

  div.box {
    // width: 100%;
    // height: 100px;
    ul {
      width: 100%;
      .info {
        .bb {
          padding: 5px 0;
          color: #ccc;
          display: flex;
          align-items: center;

          span:first-child {
            overflow: hidden;
            white-space: nowrap;
            /*文字超出宽度则显示ellipsis省略号*/
            text-overflow: ellipsis;
            width: 30%;
          }
          span:last-child {
            margin-left: 20px;
          }
        }
        margin-bottom: 6px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 16px;
        div.one {
          display: flex;
          justify-content: space-between;
          align-items: center;
          h3 {
            padding: 0;
            margin: 0;
            flex: 1;
            padding-right: 8px;
            box-sizing: border-box;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; /*行数*/
            -webkit-box-orient: vertical;
            height: inherit;
            margin: 0;
          }
          .lr {
            width: 113px;
            height: 88px;
            img {
              border-radius: 9px;
              object-position: center center;
              object-fit: revert;
              width: inherit;
              height: inherit;
            }
          }
        }
        div.two {
          display: flex;
          //   justify-content: space-between;
          align-items: center;
          h3 {
            padding: 0;
            margin: 0;
            flex: 0.5;
            padding-right: 8px;
            box-sizing: border-box;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3; /*行数*/
            -webkit-box-orient: vertical;
            height: 100%;
            margin: 0;
          }
          .lr {
            flex: 1;
            display: flex;
            justify-content: space-between;
            width: 113px;
            height: 88px;
            img {
              border-radius: 9px;
              padding: 0 5px;
              box-sizing: border-box;
              object-position: center center;
              object-fit: revert;
              width: inherit;
              height: inherit;
            }
          }
        }
        div.three {
          //   display: flex;
          //   justify-content: space-between;
          //   align-items: center;
          h3 {
            // padding: 0;
            margin: 0;
            // flex: 0.5;
            padding: 10px 0;
            box-sizing: border-box;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3; /*行数*/
            -webkit-box-orient: vertical;
            height: 60px;
            margin: 0;
          }
          .lr {
            display: flex;
            justify-content: space-between;
            // width: 113px;
            height: 88px;
            img:first-child {
              padding-left: 0;
              padding-right: 0;
            }
            img {
              border-radius: 9px;
              padding: 0 5px;
              box-sizing: border-box;
              object-position: center center;
              object-fit: revert;
              width: 33%;
              height: inherit;
            }
          }
        }
      }
    }
  }
  // img {
  //   width: 80px;
  //   height: 80px;
  // }
}
</style>
