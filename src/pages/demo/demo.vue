<template>
  <div id="app">
    <h2>demo page</h2>
    <p>this is a multi-page demo page</p>
    <!-- <DataScreen /> -->
    <!-- <Test /> -->
  </div>
</template>

<script>
export default {
  name: 'Demo',
  components: {
    // DataScreen: () => import('@/views/dataScreen/index'),
    // Test: () => import('@/views/dataScreen/test/test'),
  },
}
</script>

<style lang="scss">

html,body{
    height: 100%;
    width:100%;
}

#app{
  height: 100%;
  width: 100%;
}
</style>
