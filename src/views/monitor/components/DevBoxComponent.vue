<template>
  <div>
    <!-- 设备箱总数 -->
    <div>
      <span>设备箱总数</span>
      <span>{{ boxTotal }}</span>
    </div>
    <!-- 设备箱守护 -->
    <div>
      <span>设备箱守护</span>
      <span>{{ boxOnline }}</span>
    </div>
    <!-- 设备箱异常 -->
    <div>
      <span>设备箱异常</span>
      <span>{{ boxErr }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DevBoxComponent',
  props: {
    boxTotal: { type: Number, default: 0 },
    boxOnline: { type: Number, default: 0 },
    boxErr: { type: Number, default: 0 },
  },
  data() {
    return {
    }
  },
}
</script>

<style scoped>

</style>
