<template>
  <div class="errMonth-container">
    <div ref="lineChart" class="lineChart">

    </div>
  </div>
</template>

<script>
import { getDateCount } from '@/views/monitor/utils'
import echarts from 'echarts'
export default {
  name: 'ErrMonthChartsComponent',
  props: {
    data: { type: Object, default: Object },
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    data(cur, old) {
      this.initOption()
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
    initOption() {
      const date = this.data['日期']
      const noNet = getDateCount(date, this.data['网络已断开'], 'date', 'alarmCount')
      const noElec = getDateCount(date, this.data['断电报警'], 'date', 'alarmCount')

      const option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['断网', '断电'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '断网',
            type: 'line',
            data: noNet,
          },
          {
            name: '断电',
            type: 'line',
            data: noElec,
          },
        ],
      }
      this.initLine(option)
    },
    initLine(option) {
      this.chart = echarts.init(this.$refs.lineChart)
      this.chart.setOption(option)
    },
  },
}
</script>

<style scoped>
.errMonth-container{
  width: 400px;
  height: 400px;
}
.lineChart{
  width: 100%;
  height: 100%;
}
</style>
