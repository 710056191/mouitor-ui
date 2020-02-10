<template>
  <div class="warningReporterComponent-container">
    <div>
      <span>地点</span>
      <span>点位编号</span>
      <span>设备IP</span>
      <span>状况</span>
      <span>时间</span>
    </div>
    <div id="warningReporterComponent-scroll">
      <ul class="dataList">
        <li v-for="(item, index) in errReport" :key="index">
          <span>{{ item.selfLocation ? item.selfLocation : '-' }}</span>
          <span>{{ item.typeName ? item.typeName : '-' }}-{{ item.selfCode ? item.selfCode : '-' }}</span>
          <span>{{ item.ip ? item.ip : '-' }}</span>
          <!-- red为红色 -->
          <span :class="item.status === ''?'':'red'">{{ item.alarmDesc ? item.alarmDesc : '-' }}</span>
          <span>{{ item.updateTime ? item.updateTime : '-' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WarningReporterComponent',
  props: {
    errReport: { type: Array, default: Array },
  },
  data() {
    return {
    }
  },
}
</script>

<style scoped>

</style>
