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
            <li class="box" v-for="(item, index) in lists" :key="index" @click="edit(item)">
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
    <BomViem></BomViem>
  </div>
</template>

<script>
import BomViem from '../components/BomViem.vue';
import TopView from '../components/TopView.vue';
import { List } from 'vant';
import Vue from 'vue';
import { Tabbar, TabbarItem } from 'vant';
import { PullRefresh } from 'vant';
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
        console.log(res);
        //toutiao.longxiaokj.com/

        if (flag) {
          this.isRefresh = false;
          res.data.forEach((aa, i) => {
            if (aa.imageSrc.length > 0) {
              this.lists.push(aa);
            }
          });
        } else {
          res.data.forEach((aa, i) => {
            if (aa.imageSrc.length > 0) {
              this.lists.push(aa);
            }
          });
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

<style lang="less">
.Home {
  width: 375px;

  .van-nav-bar__placeholder {
    height: 46.0125px !important;
  }

  div.box {
    // width: 100%;
    // height: 100px;
    ul {
      .van-list {
        display: flex;
        flex-wrap: wrap;
        width: 375px;
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
              -webkit-line-clamp: 3; /*行数*/
              -webkit-box-orient: vertical;
              height: 60px;
              // white-space: nowrap;
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
