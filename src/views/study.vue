<template>
  <div class="study">
    <!-- fontclass的引入方式 在appvue引入css-->
    <span class="iconfont icon-gougouchushou"></span>
    <!-- js  symbool的引入方式在main js引入js  定义全局icon的css -->
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-gougouchushou"></use>
    </svg>
    <!-- 用的全局main.js的全局颜色变量 -->
    <van-button :color="basegreen">单色按钮</van-button>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
