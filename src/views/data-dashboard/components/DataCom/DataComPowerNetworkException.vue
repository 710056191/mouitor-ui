<template>
  <DataComWrapper
    title="电力网络质量趋势图"
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
import mockChartData from './utils/mock-data/power-network-exception'
import DataComWrapper from './common/DataComWrapper'
import { getDateCount } from '@/views/monitor/utils'

export default {
  name: 'DataComPowerNetworkException',

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
        axisLine: '#18478b',

        // 常规颜色
        regular: '#489eff',

        items: [
          '#14eee6',
          '#ffd52b',
        ],
      }

      const getSeriesBaseItem = () => {
        return {
          name: '',
          type: 'line',
          label: {
            show: true,
            position: 'top',
          },

          itemStyle: {
            color: '',
          },

          data: [],
        }
      }

      const option = {
        tooltip: {
          trigger: 'axis',
        },

        legend: {
          data: ['断电', '断网'],
          orient: 'vertical',
          top: 50,
          right: 4,
          itemHeight: 6, // 让其 icon 不过高

          textStyle: {
            color: '#fff',
          },
        },

        grid: {
          left: '3%',
          right: 70,
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
            splitLine: {
              show: true,
              alignWithLabel: true,
              lineStyle: {
                color: COLOR.axisLine,
              },
            },
            axisTick: false,
            data: [],
          },
        ],
        yAxis: [
          {
            name: '数量',
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

        series: [],
      }
      const powerItem = getSeriesBaseItem()
      powerItem.name = '断电'
      powerItem.itemStyle.color = COLOR.items[0]

      const networkItem = getSeriesBaseItem()
      networkItem.name = '断网'
      networkItem.itemStyle.color = COLOR.items[1]

      option.series.push(powerItem, networkItem)

      return option
    },

    setMockData(option) {
      if (process.env.NODE_ENV === 'production') {
        return
      }
      option.xAxis[0].data = mockChartData.dateList
      option.series[0].data = mockChartData.powerList
      option.series[1].data = mockChartData.networkList
    },

    handleChartInfo(option) {
      // console.log('handleChartInfo', this.info)

      const info = this.info || {}
      const charts = info.charts || {}

      const date = charts['日期']
      const noElec = getDateCount(date, charts['断电报警'], 'date', 'alarmCount')
      const noNet = getDateCount(date, charts['网络已断开'], 'date', 'alarmCount')

      option.xAxis[0].data = date
      option.series[0].data = noElec
      option.series[1].data = noNet
    },
  },
}
</script>

<style lang="scss">
</style>
