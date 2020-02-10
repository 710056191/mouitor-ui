<template>
  <div class="module-main">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive> -->
      <router-view :key="key" />
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ModuleMain',

  computed: {
    key() {
      return this.$route.path
    },
  },
}
</script>

<style lang="scss">

.module-main{
  height: 100%;
}

</style>
