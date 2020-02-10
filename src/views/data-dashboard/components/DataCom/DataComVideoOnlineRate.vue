<template>
  <DataComWrapper
    title="视频在线率统计"
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
import mockChartData from './utils/mock-data/video-online-rate'
import DataComWrapper from './common/DataComWrapper'

import { getDateCount } from '@/views/monitor/utils'

export default {
  name: 'DataComVideoOnlineRate',

  components: {
    DataComWrapper,
    VueECharts,
  },
  mixins: [DataComponent],

  data() {
    return {}
  },

  methods: {
    getChartOption() {
      const COLOR = {
        tooltipLabelBg: '#6a7985',

        axisLine: '#18478b',

        // 常规颜色
        regular: '#489eff',

        line: '#08D8C3',

        label: '#288dff',

        symbol: '#ecd619',

      }

      const option = {
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'cross',
          //   label: {
          //     backgroundColor: COLOR.tooltipLabelBg,
          //   },
          // },
        },

        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true,
        },

        xAxis: [
          {
            name: '时间',
            type: 'category',
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: COLOR.axisLine,
              },
              symbol: ['none', 'arrow'],
              symbolSize: 5,
            },
            axisLabel: {
              color: COLOR.regular,
            },
            axisTick: false,
            data: [],
          },
        ],
        yAxis: [
          {
            name: '在线率',
            type: 'value',
            nameGap: 20,
            nameRotate: 0.1, // trick: 用于将 name 居左显示
            axisLine: {
              lineStyle: {
                color: COLOR.axisLine,
              },
              symbol: ['none', 'arrow'],
              symbolSize: 5,
            },
            axisLabel: {
              show: false,
              color: COLOR.regular,
            },
            nameTextStyle: {
              color: COLOR.regular,
            },
            splitLine: {
              show: false,
            },
            axisTick: false,
          },
        ],

        series: [
          {
            name: '视频在线率',
            type: 'line',
            label: {
              show: true,
              position: 'top',
              color: COLOR.label,
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgb(8, 216, 195)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(8, 216, 195, 0)',
                  },
                ],
                global: false,
              },
            },
            itemStyle: {
              color: COLOR.symbol,
              borderColor: COLOR.symbol,
              shadowBlur: 10,
              shadowColor: COLOR.symbol,
            },
            lineStyle: {
              color: COLOR.line,
            },
            symbol: 'circle',
            symbolSize: 5,
            data: [],
          },
        ],
      }
      return option
    },

    setMockData(option) {
      if (process.env.NODE_ENV === 'production') {
        return
      }
      option.xAxis[0].data = mockChartData.dateList
      option.series[0].data = mockChartData.rateList
    },

    handleChartInfo(option) {
      // console.log('handleChartInfo', this.info)

      const info = this.info || {}
      const {
        date,
        list = [],
      } = info

      list.forEach(item => {
        item.rate = 1 - (item.alarmCount / item.devTotal).toFixed(2)
      })
      const seriesData = getDateCount(date, list, 'date', 'rate')

      option.xAxis[0].data = date
      option.series[0].data = seriesData
    },
  },
}
</script>

<style lang="scss">
</style>
