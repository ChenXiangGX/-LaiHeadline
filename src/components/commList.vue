<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      @load="getList"
      finished-text="没有更多数据了"
      :immediate-check="immediateCheck"
    >
      <!-- <li></li>   浏览历史 我的收藏  搜索   首页  评论  -->

      <slot :list="list"></slot>
    </van-list>
  </div>
</template>

<script>
import { List } from 'vant';
export default {
  data() {
    return {
      skip: 0,
      loading: false,
      finished: false,
      list: [],
    };
  },
  components: {
    [List.name]: List,
  },
  props: {
    limit: {
      default: 10,
      type: Number,
    },
    immediateCheck: {
      type: Boolean,
      default: true,
    },
    API: {
      type: Function,
      require: true,
    },
    params: {
      type: Object,
    },
  },
  methods: {
    getList() {
      let { skip, limit, params } = this;
      console.log(this.params);

      this.API({
        skip,
        limit,
        ...params,
      }).then((res) => {
        if (res.code == 0) {
          this.list.push(...res.data);

          let len = this.list.length;

          if (len >= res.count) {
            this.finished = true;
          } else {
            this.skip = len;
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style></style>
