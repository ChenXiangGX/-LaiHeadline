<template>
  <div class="bom">
    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/fabu"
        >发布
        <template #icon>
          <van-icon name="add-o" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/user"
        >我的
        <template #icon>
          <van-icon name="manager-o" /> </template
      ></van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      // active: 0,
    };
  },
};
</script>
