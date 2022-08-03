<template>
  <div class="search-container">
    <van-search
      v-model="value"
      :placeholder="hork"
      show-action
      @search="onSearch"
      @input="oninput"
      @cancel="$router.back()"
    />
    <div class="con" v-show="searchList.length">
      <van-cell
        @click="searchListTab(item.title)"
        :title="item.title"
        v-for="(item, index) in searchList"
        :key="index"
      />
    </div>
    <!-- 历史记录 -->
    <div class="search-history">
      <van-cell title="搜索历史">
        <div>
          <span @click="delall">全部删除</span>
        </div>
      </van-cell>
      <van-cell
        :title="item"
        v-for="(item, index) in history"
        :key="index"
        :to="{
          path: '/seachList',
          query: {
            key_word: item,
          },
        }"
      >
        <van-icon size="26" @click="delone(index)" name="close" />
      </van-cell>
    </div>
    <!-- /历史记录 -->
  </div>
</template>
<script>
import { search } from '@/api/home';
function debounce(fn, t = 500) {
  let timer = null;
  return function (...arg) {
    clearTimeout(timer);
    timer = setTimeout((v) => {
      fn.apply(this, arg);
    }, t);
  };
}
export default {
  data() {
    return {
      value: '',
      //热词
      hork: '11',
      searchList: [],
      //放历史记录的
      history: [],
    };
  },
  watch: {
    value(n) {
      if (n.trim().length == 0) {
        this.searchList = [];
      }
    },
  },
  created() {
    //一进来判断历史记录
    let history = localStorage.getItem('history');
    if (history) {
      this.history = JSON.parse(history);
    }
  },
  methods: {
    //删除全部历史
    delall() {
      this.history = [];
      localStorage.setItem('history', JSON.stringify(this.history));
    },
    //删除指定历史
    delone(i) {
      this.history.splice(i, 1);
      localStorage.setItem('history', JSON.stringify(this.history));
    },
    //点击跳转详情页
    searchListTab(title) {
      let index = this.history.findIndex((v) => {
        return v == title;
      });
      if (index >= 0) {
        this.history.splice(index, 1);
      }
      this.history.unshift(title);
      localStorage.setItem('history', JSON.stringify(this.history));
      this.$router.push({
        path: '/seachList',
        query: {
          key_word: title,
        },
      });
    },
    //键入触发
    oninput: debounce(function (e) {
      e = e.trim();
      if (e.length == 0) return;
      search({ key_word: e }).then((res) => {
        console.log(res);
        this.searchList = res.data;
      });
    }),
    //enter触发
    onSearch(e) {
      e = e.trim();
      e = e || this.hork;
      //可以直接把热词打印
      this.searchListTab(e);
      console.log(e);
    },
  },
};
</script>
<style lang="less" scoped>
.search-container {
  .con {
    position: fixed;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    z-index: 1;
    top: 54px;
    .van-cell .van-cell__title span {
      display: inline-block;
      width: 360px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .search-history {
    .van-cell .van-cell__title span {
      display: inline-block;
      width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .search-result {
    position: fixed;
    left: 0;
    right: 0;
    top: 54px;
    bottom: 0;
    overflow-y: auto;
  }
}
</style>
