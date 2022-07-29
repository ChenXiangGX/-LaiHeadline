<template>
  <van-nav-bar fixed placeholder>
    <template #title>
      <router-link to="/search" class="home-header-serch">
        <van-icon name="search" size="18" />
        搜索
      </router-link>
    </template>
  </van-nav-bar>
</template>
<script>
import Vue from 'vue';
import { NavBar } from 'vant';

Vue.use(NavBar);
export default {};
</script>
<style lang="less">
.van-nav-bar {
  z-index: 5;
  background-color: #00a95e;
  .home-header-serch {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 210px;
    color: #fff;
    background-color: #77d3aa;
    border-radius: 14px;
  }
}
</style>
