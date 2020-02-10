<template>
  <DataComWrapper
    title="断电、断网统计"
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
import mockChartData from './utils/mock-data/power-network-fail-count'
import DataComWrapper from './common/DataComWrapper'

export default {
  name: 'DataComPowerNetworkFailCount',

  components: {
    DataComWrapper,
    VueECharts,
  },

  mixins: [DataComponent],

  data() {
    return {
      /*  */
    }
  },

  methods: {
    getChartOption() {
      const COLOR = {
        normal: '#288dff',

        items: [
          '#1ad3c1',
          '#ffd52b',
        ],
      }

      const getTitle = () => {
        return {
          text: '',

          left: 'center',
          top: '50%',

          textStyle: {
            color: COLOR.normal,
            fontSize: 24,
          },

        }
      }

      const getSeriesBaseItem = () => {
        return {
          name: '',
          type: 'pie',

          minAngle: 20, // 最小的扇区角度（0 ~ 360）
          radius: ['30%', '35%'],
          center: ['50%', '50%'],
          data: [],

          label: {
            show: true,

            formatter: '{b} {c}',

            // color: COLOR.normal,

            rich: {
              style_0: {
                color: COLOR.items[0],
              },

              style_1: {
                color: COLOR.items[1],
              },
            },
          },

          labelLine: {
            show: true,
          },

          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }
      }

      const option = {
        title: [],

        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true,
        },

        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}',
        },

        color: COLOR.items,

        series: [],
      }

      // 次数
      const timeTitle = getTitle()
      timeTitle.text = '次'
      timeTitle.left = '26%'
      timeTitle.top = '35%'

      const timeItem = getSeriesBaseItem()
      timeItem.name = '次数'
      timeItem.center = ['30%', '40%']

      // 时长
      const durationTitle = getTitle()
      durationTitle.text = '分钟'
      durationTitle.left = '64%'
      durationTitle.top = '50%'

      const durationItem = getSeriesBaseItem()
      durationItem.name = '时长'
      durationItem.center = ['70%', '55%']

      option.title.push(timeTitle, durationTitle)
      option.series.push(timeItem, durationItem)
      return option
    },

    setMockData(option) {
      if (process.env.NODE_ENV === 'production') {
        return
      }

      option.series[0].data = mockChartData.count.data
      option.series[1].data = mockChartData.duration.data
    },

    handleChartInfo(option) {
      // console.log('handleChartInfo', this.info)

      const info = this.info || {}
      const {
        noNetCount,
        noNetDuration,
        noElecCount,
        noElecDuration,
      } = info

      const count = [
        { value: noNetCount, name: '断网次数' },
        { value: noElecCount, name: '断电次数' },
      ]

      const duration = [
        { value: noNetDuration, name: '断网时长' },
        { value: noElecDuration, name: '断电时长' },
      ]

      option.series[0].data = count
      option.series[1].data = duration
    },
  },

}
</script>

<style lang="scss">
</style>
