<template>
  <div class="Home">
    <TopView></TopView>
    <!-- 顶部标签栏 -->
    <van-tabs v-model="active" @click="getitem">
      <van-tab v-for="item in list" :key="item._id" :title="'' + item.name"></van-tab>
    </van-tabs>

    <div class="box">
      <ul>
        <li class="box" v-for="(item, index) in lists" :key="index" @click="edit(item)">
          <div class="info">
            <h3>
              {{ item.title }}
            </h3>
            <div class="imgs">
              <img v-for="(v, i) in item.imageSrc" :src="v" alt="" :key="i" />
            </div>

            <div>
              <span> 评论人{{ item.author }} </span>
              <!-- <span> 时间 {{ item.time | formatDate }} </span> -->
            </div>
          </div>
        </li>
      </ul>
    </div>
    <BomViem></BomViem>
  </div>
</template>

<script>
import BomViem from "../components/BomViem.vue";
import TopView from "../components/TopView.vue";
import Vue from "vue";
import { Tabbar, TabbarItem } from "vant";
Vue.use(Tabbar);
Vue.use(TabbarItem);

// 顶部标签栏Tab
import { Tab, Tabs } from "vant";
import { get_cate_list, get_article_list } from "@/api/home.js";
export default {
  name: "HomeFirst",
  data() {
    return {
      value: "",
      active: 0,
      list: [],
      lists: [],
      stry: "",
      item: 1,
    };
  },
  components: {
    BomViem,
    TopView,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
  mounted() {
    // 获取标签分类
    get_cate_list().then((res) => {
      console.log(res);
      this.list = res.data;
      // 获取文章列表
      this.stry = res.data[0]._id;
      get_article_list({
        cate_id: this.stry,
        skip: 0,
        limit: "10",
      }).then((res) => {
        console.log(res.data);
        this.lists = res.data;
      });
    });
  },
  filters: {
    formatDate: function (value) {
      // 时间戳转换日期格式方法
      if (value == null) {
        return "";
      } else {
        let date = new Date(value);
        let y = date.getFullYear(); // 年
        let MM = date.getMonth() + 1; // 月
        MM = MM < 10 ? "0" + MM : MM;
        let d = date.getDate(); // 日
        d = d < 10 ? "0" + d : d;
        // let h = date.getHours(); // 时
        // h = h < 10 ? "0" + h : h;
        // let m = date.getMinutes(); // 分
        // m = m < 10 ? "0" + m : m;
        // let s = date.getSeconds(); // 秒
        // s = s < 10 ? "0" + s : s;
        // return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
        return y + "-" + MM + "-" + d;
      }
    },
  },
  methods: {
    getitem(i) {
      this.stry = this.list[i]._id;
      console.log(this.stry);
      get_article_list({
        cate_id: this.stry,
        skip: 0,
        limit: "",
      }).then((res) => {
        this.lists = res.data;
      });
    },
    wenzhang() {
      this.$router.push("/Wzdetail");
    },
  },
};
</script>

<style lang="less">
.Home {
  width: 375px;
  div.box {
    // width: 100%;
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
          div > span:first-child,
          h3 {
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;

            white-space: nowrap;
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
