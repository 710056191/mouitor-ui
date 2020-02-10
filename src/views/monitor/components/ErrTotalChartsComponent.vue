<template>
  <div class="err-total-container">
    <div ref="barChart" class="errBarChart">

    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'ErrTotalChartsComponent',
  props: {
    dataList: { type: Array, default: Array },
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    dataList(cur, old) {
      this.initOption()
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
      const yAxisData = []
      const seriesData = []

      this.dataList.forEach(item => {
        yAxisData.push(item.deviceName)
        seriesData.push(item.alarmCount)
      })

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: yAxisData,
        },
        series: [
          {
            name: '异常警报次数',
            type: 'bar',
            data: seriesData,
            itemStyle: {
              normal: {
                label: {
                  show: true, // 开启显示
                  position: 'right', // 在上方显示
                  textStyle: { // 数值样式
                    color: 'black',
                    fontSize: 14,
                  },
                },
              },
            },
          },
        ],
      }

      this.chart = echarts.init(this.$refs.barChart)
      this.chart.setOption(option)
    },
  },
}
</script>

<style scoped>
.err-total-container{
  height: 500px;
  width: 500px;
}
.errBarChart{
  height: 100%;
  width: 100%;
}
</style>
