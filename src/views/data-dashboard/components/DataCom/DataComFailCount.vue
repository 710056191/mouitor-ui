<template>
  <DataComWrapper
    :nest-border="true"
    title="故障数量统计"
  >
    <VueECharts
      :init-options="chartInitOption"
      :options="chartOption"
      autoresize
    />
  </DataComWrapper>
</template>

<script>
import 'echarts'
import VueECharts from 'vue-echarts'
import DataComponent from './mixins/data-component'
import DataComWrapper from './common/DataComWrapper'
import mockChartData from './utils/mock-data/fail-count'

export default {
  name: 'DataComFailCount',

  components: {
    DataComWrapper,
    VueECharts,
  },
  mixins: [DataComponent],

  data() {
    return {
    }
  },

  methods: {
    getChartOption() {
      const COLOR = {
        // tooltipLabelBg: '#6a7985',

        axisLine: '#288dff',

        linear: ['#2a75c6', '#00efc2'],

        label: '#38c6f8',
      }

      const option = {
        tooltip: {
          show: true,
          formatter: '{b}: {c}',
        },

        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true,
        },

        xAxis: [{
          show: false,
        }],

        yAxis: [
          {
            data: [],
            inverse: true,

            axisTick: false,
            axisLine: {
              show: false,
              lineStyle: {
                color: COLOR.axisLine,
              },
            },

            axisLabel: {
              fontSize: 14,
              // align: 'left', // todo
            },
          },
        ],

        series: [
          {
            name: '条',
            type: 'bar',
            yAxisIndex: 0,
            barWidth: 8,
            // barCategoryGap: '50%',

            label: {
              show: true,
              // position: ['92%', -20],
              position: 'right',
              color: COLOR.label,
              fontSize: 16,

              textShadowColor: COLOR.label,
              textShadowBlur: 10,
            },

            itemStyle: {
              color: {
                type: 'linear',

                colorStops: [
                  {
                    offset: 0,
                    color: COLOR.linear[0],
                  },
                  {
                    offset: 1,
                    color: COLOR.linear[1],
                  },
                ],
              },
            },
          },
        ],
      }
      return option
    },

    setMockData(option) {
      if (process.env.NODE_ENV === 'production') {
        return
      }

      option.yAxis[0].data = mockChartData.names
      option.series[0].data = mockChartData.values
    },

    handleChartInfo(option) {
      // console.log('handleChartInfo', this.info)

      const info = this.info || {}
      const dataList = info.list

      const yAxisData = []
      const seriesData = []

      dataList.forEach(item => {
        yAxisData.push(item.deviceName)
        seriesData.push(item.alarmCount)
      })

      option.yAxis[0].data = yAxisData
      option.series[0].data = seriesData
    },
  },

}
</script>

<style>
</style>
