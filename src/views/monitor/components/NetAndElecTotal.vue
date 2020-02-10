<template>
  <div>
    <!-- 断网次数 -->
    <span>断网:{{ noNetCount }}</span>
    <!-- 断电次数 -->
    <span>断电:{{ noElecCount }}</span>
    <span>次</span>
    <!-- 断网时长 -->
    <span>断网:{{ noNetDuration }}</span>
    <!-- 断电时长 -->
    <span>断电:{{ noElecDuration }}</span>
    <span>分钟</span>
  </div>
</template>

<script>
export default {
  name: 'NetAndElecTotal',
  props: {
    noNetCount: { type: [Number, String], default: 0 },
    noNetDuration: { type: [Number, String], default: 0 },
    noElecCount: { type: [Number, String], default: 0 },
    noElecDuration: { type: [Number, String], default: 0 },
  },
  data() {
    return {

    }
  },
}
</script>

<style scoped>

</style>
