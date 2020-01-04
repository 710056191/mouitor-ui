<template>
  <div class="cameraPie-container">
    <div ref="pieChart" class="cameraPie"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'CameraOnlineRateComponent',
  props: {
    cameraTotal: { type: [Number, String], default: 0 },
    cameraErrRate: { type: [Number, String], default: 0 },
    cameraOnline: { type: [Number, String], default: 0 },
  },
  data() {
    return {
      option: {},
      chart: null,
      timer: null,
    }
  },
  computed: {
    cameraData: function() {
      return { cameraTotal: this.cameraTotal, cameraOnline: this.cameraOnline, cameraErrRate: this.cameraErrRate }
    },
  },
  watch: {
    cameraData(cur, old) {
      this.initPie()
    },
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initPie() {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}:{d}%',
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['离线率', '在线率'],
        },
        title: {
          text: '总接入数：' + this.cameraTotal,
          left: 'center',
          top: '45%',
          // padding:[24,0],
          textStyle: {
            color: '#031f2d',
            // fontSize: 20 * scale,
            align: 'center',
          },
        },
        series: [
          {
            name: '视频设备统计',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            data: [
              { value: this.cameraErrRate, name: '离线率' },
              { value: this.cameraOnline, name: '在线率' },
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b}:{d}%',
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      }
      this.chart = echarts.init(this.$refs.pieChart)
      this.chart.setOption(option)
    },
  },
}
</script>

<style scoped>
.cameraPie-container{
  width:500px;
  height: 500px;
}
.cameraPie{
  width: 100%;
  height: 100%;
}
</style>
