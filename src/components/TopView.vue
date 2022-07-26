<template>
  <div class="top">
    <van-nav-bar fixed placeholder>
      <template #title>
        <router-link to="/search" class="home-header-serch">
          <van-icon name="search" size="18" />
          搜索
        </router-link>
      </template>
    </van-nav-bar>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar } from "vant";

Vue.use(NavBar);
export default {};
</script>
<style lang="less">
.top {
  .home-header-serch {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 210px;
    color: #fff;
    background-color: green;
    border-radius: 14px;
  }
  // background-color: ;
}
</style>
