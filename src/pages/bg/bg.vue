<template>
  <div id="app">
    <DataDashboard />
  </div>
</template>

<script>
export default {
  name: 'Bg',

  components: {
    // 异步加载，以免 echarts 打包进该页面的入口 js
    // TODO: 额外，将 echarts 独立打包，这里应该就可以不用异步加载
    DataDashboard: () => import('@/views/data-dashboard'),
  },
}
</script>

<style lang="scss">

body {
  height: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}

html {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

#app {
  height: 100%;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

a:focus,
a:active {
  outline: none;
}

a,
a:focus,
a:hover {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

div:focus {
  outline: none;
}

.clearfix {
  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
}

</style>
