<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keep"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keep"></router-view>
    <!--加了keep-alive后切换组件回答v_node放到一个对象里缓存
    当再次回来时不用重新创建，直接去这个对象去拿，会记住之前的一些状态 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>
<style lang="less">
//引入字体图标less下的引入
@import url('@/assets/iconfont/iconfont.css');
// @color: red;
#app {
  width: 375px;
  font-size: 12px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.router-link-exact-active {
  color: #42b983;
}
</style>
