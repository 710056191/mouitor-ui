<template>
  <div class="cameraLineChart-container">
    <div ref="cameraLineChart" class="cameraLineChart">

    </div>
  </div>
</template>

<script>
import { getDateCount } from '@/views/monitor/utils'
import echarts from 'echarts'
export default {
  name: 'CameraOnlineLineChart',
  props: {
    data: { type: Array, default: Array },
    date: { type: Array, default: Array },
  },
  data() {
    return {
      chart: null,
    }
  },
  computed: {
    originData() {
      return { data: this.data, dates: this.dates }
    },
  },
  watch: {
    originData: {
      handler: function(cur, old) {
        this.initOption()
      },
      deep: true,
    },
  },
  mounted() {
    this.initOption()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initOption() {
      this.data.forEach(item => {
        item.rate = 1 - (item.alarmCount / item.devTotal).toFixed(2)
      })
      const seriesData = getDateCount(this.date, this.data, 'date', 'rate')

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.date,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '视频在线率',
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top',
              },
            },
            areaStyle: { normal: {}},
            data: seriesData,
          },
        ],
      }

      this.initLineChart(option)
    },
    initLineChart(option) {
      this.chart = echarts.init(this.$refs.cameraLineChart)
      this.chart.setOption(option)
    },
  },
}
</script>

<style scoped>
.cameraLineChart-container{
  width: 800px;
  height: 400px;
}
.cameraLineChart{
  width: 100%;
  height: 100%;
}
</style>
